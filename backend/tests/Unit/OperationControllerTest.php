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
        $operationUUID = Str::uuid();

        // Arrange
        $data = [
            'number' => 1,
            'name' => 'Test Operation',
        ];

        // 'suboperations' => [
        //         ['name' => 'Suboperation 1', 'operation_uuid' => $operationUUID],
        //         ['name' => 'Suboperation 2', 'operation_uuid' => $operationUUID]
        //     ]

        // Act
        $response = $this->postJson('/api/operations', $data);

        // Assert
        $response->assertStatus(201);

        $this->assertDatabaseHas('operations', ['name' => 'Test Operation']);

        // $this->assertDatabaseHas('suboperations', ['name' => 'Suboperation 1']);
        // $this->assertDatabaseHas('suboperations', ['name' => 'Suboperation 2']);
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

    public function testDestroy()
    {
        // Arrange
        $operation = Operation::factory()->create();

        // Act
        $response = $this->deleteJson("/api/operations/{$operation->uuid}");

        // Assert
        $response->assertStatus(204);
        $this->assertSoftDeleted('operations', ['uuid' => $operation->uuid]);
    }
}
