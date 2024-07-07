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

        $batchSize = 100; // Adjust batch size to fit within memory limits

        DB::transaction(function () use ($batchSize) {
            $operationNumber = 1;

            // Step 1: Generate and insert operations in batches
            for ($i = 0; $i < 100000; $i += $batchSize) {
                $operations = [];
                for ($j = 0; $j < $batchSize; $j++) {
                    $operations[] = [
                        'uuid' => Str::uuid(),
                        'number' => $operationNumber,
                        'name' => Str::random(rand(4, 10)),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                    $operationNumber++;
                }
                Operation::insert($operations);
                unset($operations); // Clear memory
            }

            // Step 2: Generate and insert suboperations in chunks
            Operation::select('uuid')->chunk($batchSize, function ($operations) use ($batchSize) {
                foreach ($operations as $operation) {
                    $suboperationsCount = rand(1, 10);
                    $suboperations = [];
                    for ($j = 1; $j <= $suboperationsCount; $j++) {
                        $suboperations[] = [
                            'uuid' => Str::uuid(),
                            'operation_uuid' => $operation->uuid,
                            'number' => $j,
                            'name' => Str::random(rand(4, 10)),
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    }
                    Suboperation::insert($suboperations);
                    unset($suboperations); // Clear memory
                }
            });
        });

        $endTime = microtime(true);
        $elapsedTime = $endTime - $startTime;
        $this->info("Generation completed in {$elapsedTime} seconds.");
    }
}
