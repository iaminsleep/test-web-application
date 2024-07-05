<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('suboperations', function (Blueprint $table) {
            $table->uuid()->primary();

            $table->uuid('operation_uuid');
            $table->foreign('operation_uuid')->references('uuid')->on('operations')->onDelete('cascade');
            $table->integer('number');
            $table->unique(['operation_uuid', 'number']);

            $table->string('name');
            $table->timestamps();

            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('suboperations');
    }
};
