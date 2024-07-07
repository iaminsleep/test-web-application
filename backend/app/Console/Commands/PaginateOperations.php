<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Operation;
use Illuminate\Support\Facades\DB;

class PaginateOperations extends Command
{
    protected $signature = 'paginate:operations';
    protected $description = 'Paginate operations and suboperations with specific logic';

    public function handle()
    {
        $startTime = microtime(true);
        $this->info('Starting to paginate operations...');

        $chunkSize = 1000;
        $pageNumber = 0;

        DB::table('operations')->orderBy('uuid')->chunk($chunkSize, function ($operations) use (&$pageNumber) {
            $pageNumber++;
            $filteredOperations = $operations->filter(function ($operation) {
                // Get suboperations with even numbers
                $suboperations = DB::table('suboperations')
                    ->where('operation_uuid', $operation->uuid)
                    ->whereRaw('MOD(number, 2) = 0')
                    ->get();

                // Keep operations with more than 2 even-numbered suboperations
                return $suboperations->count() > 2;
            });

            // Sort operations by name
            $filteredOperations = $filteredOperations->sortBy('name')->values();

            // Remove every second and fourth operation
            $filteredOperations = $filteredOperations->reject(function ($operation, $key) {
                return in_array($key + 1, [2, 4]);
            })->values();

            // Further filter operations
            $filteredOperations = $filteredOperations->filter(function ($operation) {
                // Get suboperations
                $suboperations = DB::table('suboperations')
                    ->where('operation_uuid', $operation->uuid)
                    ->get();

                // Keep operations with more than 4 suboperations and at least one suboperation with 'A' in the name
                return $suboperations->count() > 4 && $suboperations->contains(function ($suboperation) {
                    return stripos($suboperation->name, 'A') !== false;
                });
            });

            $totalSuboperations = $filteredOperations->sum(function ($operation) {
                return DB::table('suboperations')
                    ->where('operation_uuid', $operation->uuid)
                    ->count();
            });

            $this->info("Page {$pageNumber}: Total Suboperations = {$totalSuboperations}");
        });

        $endTime = microtime(true);
        $elapsedTime = $endTime - $startTime;
        $this->info("Pagination completed in {$elapsedTime} seconds.");
    }
}
