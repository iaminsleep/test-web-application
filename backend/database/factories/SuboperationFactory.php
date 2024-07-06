<?php

namespace Database\Factories;

use App\Models\Operation;

use Illuminate\Support\Str;
use App\Models\Suboperation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Suboperation>
 */

class SuboperationFactory extends Factory
{
    protected $model = Suboperation::class;

    public function definition()
    {
        $operation = Operation::inRandomOrder()->first();

        if (!$operation) {
            $operation = Operation::factory()->create();
        }

        return [
            'uuid' => Str::uuid(),
            'operation_uuid' => $operation->uuid,
            'number' => 1, // Default number, will be overwritten in bulk creation
            'name' => $this->faker->word,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    public function forOperation($operationUuid)
    {
        return $this->state(function (array $attributes) use ($operationUuid) {
            return [
                'operation_uuid' => $operationUuid,
            ];
        });
    }
}
