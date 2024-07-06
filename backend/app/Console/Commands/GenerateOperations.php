<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Operation;
use App\Models\Suboperation;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class GenerateOperations extends Command
{
    protected $signature = 'generate:operations';
    protected $description = 'Generate 100,000 operations with random suboperations';

    public function handle()
    {
        $startTime = microtime(true);
        $this->info('Starting to generate operations...');

        DB::transaction(function () {
            $operations = [];
            $suboperations = [];
            $operationNumber = Operation::max('number') + 1;

            for ($i = 0; $i < 100000; $i++) {
                $operationUuid = Str::uuid();
                $operations[] = [
                    'uuid' => $operationUuid,
                    'number' => $operationNumber++,
                    'name' => Str::random(rand(4, 10)),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];

                $suboperationsCount = rand(1, 10);

                for ($j = 1; $j <= $suboperationsCount; $j++) {
                    $suboperations[] = [
                        'uuid' => Str::uuid(),
                        'operation_uuid' => $operationUuid,
                        'number' => $j,
                        'name' => Str::random(rand(4, 10)),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                }

                // Insert in batches of 1000 to optimize performance
                // After every 1000 operations and 10000 suboperations, the collected data is inserted into the database in a single query to reduce the number of database interactions.
                if (count($operations) >= 1000) {
                    Operation::insert($operations);
                    $operations = [];
                }
                if (count($suboperations) >= 10000) {
                    Suboperation::insert($suboperations);
                    $suboperations = [];
                }
            }

            // Insert any remaining operations and suboperations. Any remaining operations and suboperations are inserted at the end of the loop.
            if (!empty($operations)) {
                Operation::insert($operations);
            }
            if (!empty($suboperations)) {
                Suboperation::insert($suboperations);
            }
        });

        $endTime = microtime(true);
        $elapsedTime = $endTime - $startTime;
        $this->info("Generation completed in {$elapsedTime} seconds.");
    }
}
