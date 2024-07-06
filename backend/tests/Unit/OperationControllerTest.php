<?php

namespace Tests\Unit;

use Tests\TestCase;

use Illuminate\Foundation\Testing\RefreshDatabase;

use App\Models\Operation;
use App\Models\Suboperation;

use Illuminate\Support\Str;

class OperationControllerTest extends TestCase
{
    use RefreshDatabase;

    public function testIndex()
    {
        // Arrange
        Operation::factory()->count(3)->create();

        // Act
        $response = $this->getJson('/api/operations');

        // Assert
        $response->assertStatus(200);
        $response->assertJsonCount(3);
    }

    public function testStore()
    {
        // Arrange
        $data = [
            'number' => 1,
            'name' => 'Test Operation',
        ];

        // Act
        $response = $this->postJson('/api/operations', $data);

        // Assert
        $response->assertStatus(201);

        $this->assertDatabaseHas('operations', ['name' => 'Test Operation']);
    }

    public function testShow()
    {
        // Arrange
        $operation = Operation::factory()->create();

        // Act
        $response = $this->getJson("/api/operations/{$operation->uuid}");

        // Assert
        $response->assertStatus(200);
        $response->assertJson(['uuid' => $operation->uuid]);
    }

    public function testUpdate()
    {
        // Arrange
        $operation = Operation::factory()->create();
        $data = ['number' => 2, 'name' => 'Updated Operation'];

        // Act
        $response = $this->putJson("/api/operations/{$operation->uuid}", $data);

        // Assert
        $response->assertStatus(200);
        $this->assertDatabaseHas('operations', ['name' => 'Updated Operation']);
    }

    public function testSoftDestroy()
    {
        // Arrange
        $operation = Operation::factory()->create();

        // Act
        $response = $this->deleteJson("/api/operations/{$operation->uuid}");

        // Assert
        $response->assertStatus(204);
        $this->assertSoftDeleted('operations', ['uuid' => $operation->uuid]);
    }

    public function testForceDestroy()
    {
        // Arrange
        $operation = Operation::factory()->create();

        // Act
        $response = $this->deleteJson("/api/operations/{$operation->uuid}/force");

        // Assert
        $response->assertStatus(204);
        $this->assertDatabaseMissing('operations', ['uuid' => $operation->uuid]);
    }
}
