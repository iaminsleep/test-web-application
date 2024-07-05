<?php

namespace Database\Factories;

use App\Models\Suboperation;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Suboperation>
 */

class SuboperationFactory extends Factory
{
    protected $model = Suboperation::class;

    public function definition()
    {
        return [
            'uuid' => Str::uuid(),
            'operation_uuid' => null,
            'number' => $this->faker->numberBetween(1, 10),
            'name' => $this->faker->word,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
