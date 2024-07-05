<?php

namespace Database\Factories;

use App\Models\Operation;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Operation>
 */

class OperationFactory extends Factory
{
    protected $model = Operation::class;

    public function definition()
    {
        return [
            'uuid' => Str::uuid(),
            'number' => $this->faker->unique()->numberBetween(1, 100),
            'name' => $this->faker->word,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
