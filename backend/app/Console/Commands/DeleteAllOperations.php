<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Operation;
use App\Models\Suboperation;

class DeleteAllOperations extends Command
{
    protected $signature = 'delete:all-operations';
    protected $description = 'Delete all operations and suboperations';

    public function handle()
    {
        $this->info('Starting to delete all operations and suboperations...');

        Suboperation::truncate();
        Operation::truncate();

        $this->info('Deletion completed.');
    }
}
