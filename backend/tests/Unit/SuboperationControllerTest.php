<?php

namespace Tests\Unit;

use App\Models\Operation;
use App\Models\Suboperation;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class SuboperationControllerTest extends TestCase
{
    use RefreshDatabase;

    public function testIndex()
    {
        // Arrange
        $operation = Operation::factory()->create();

        $suboperationsCount = 10; // You can change this to any number

        // Create suboperations for the created operation
        $this->createSuboperationsForOperation($operation->uuid, $suboperationsCount);

        // Act
        $response = $this->getJson("/api/operations/{$operation->uuid}/suboperations");

        // Assert
        $response->assertStatus(200);
        $response->assertJsonCount($suboperationsCount);

    }

    public function testStore()
    {
        // Arrange
        $operation = Operation::factory()->create();

        $data = [
            'name' => 'Test Suboperation',
        ];

        // Create the first suboperation
        $response = $this->postJson("/api/operations/{$operation->uuid}/suboperations", $data);
        $response->assertStatus(201);
        $firstSuboperation = Suboperation::where('operation_uuid', $operation->uuid)->first();
        $this->assertEquals(1, $firstSuboperation->number);

        // Create the second suboperation
        $response = $this->postJson("/api/operations/{$operation->uuid}/suboperations", $data);
        $response->assertStatus(201);
        $secondSuboperation = Suboperation::where('operation_uuid', $operation->uuid)->orderBy('number', 'desc')->first();
        $this->assertEquals(2, $secondSuboperation->number);

        $this->assertDatabaseHas(
            'suboperations',
            [
                'operation_uuid' => $operation->uuid,
                'name' => 'Test Suboperation',
                'number' => $firstSuboperation->number,
            ]
        );

        $this->assertDatabaseHas(
            'suboperations',
            [
                'operation_uuid' => $operation->uuid,
                'name' => 'Test Suboperation',
                'number' => $secondSuboperation->number,
            ]
        );
    }

    public function testShow()
    {
        // Arrange
        $operation = Operation::factory()->create();
        $suboperation = Suboperation::factory()->create(['operation_uuid' => $operation->uuid]);

        // Act
        $response = $this->getJson("/api/operations/{$operation->uuid}/suboperations/{$suboperation->uuid}");

        // Assert
        $response->assertStatus(200);
        $response->assertJson(['uuid' => $suboperation->uuid, 'operation_uuid' => $operation->uuid]);
    }

    public function testUpdate()
    {
        // Arrange
        $operation = Operation::factory()->create();
        $suboperation = Suboperation::factory()->create(['operation_uuid' => $operation->uuid]);

        $data = ['number' => 2, 'name' => 'Updated Suboperation'];

        // Act
        $response = $this->putJson("/api/operations/{$operation->uuid}/suboperations/{$suboperation->uuid}", $data);

        // Assert
        $response->assertStatus(200);
        $this->assertDatabaseHas('suboperations', ['name' => 'Updated Suboperation', 'number' => 2]);
    }

    public function testSoftDestroy()
    {
        // Arrange
        $operation = Operation::factory()->create();
        $suboperation = Suboperation::factory()->create(['operation_uuid' => $operation->uuid]);

        // Act
        $response = $this->deleteJson("/api/operations/{$operation->uuid}/suboperations/{$suboperation->uuid}");

        // Assert
        $response->assertStatus(204);
        $this->assertSoftDeleted('suboperations', ['uuid' => $suboperation->uuid]);
    }

    public function testForceDestroy()
    {
        // Arrange
        $operation = Operation::factory()->create();
        $suboperation = Suboperation::factory()->create(['operation_uuid' => $operation->uuid]);

        // Act
        $response = $this->deleteJson("/api/operations/{$operation->uuid}/suboperations/{$suboperation->uuid}/force");

        // Assert
        $response->assertStatus(204);
        $this->assertDatabaseMissing('suboperations', ['uuid' => $suboperation->uuid]);
    }

    // Helper function to make sure numbers are unique and generating by increment

    public static function createSuboperationsForOperation($operationUuid, $count)
    {
        $suboperations = [];
        $maxNumber = Suboperation::where('operation_uuid', $operationUuid)->max('number');

        for ($i = 1; $i <= $count; $i++) {
            $suboperations[] = Suboperation::factory()->forOperation($operationUuid)->create([
                'number' => ++$maxNumber,
            ]);
        }

        return $suboperations;
    }
}
