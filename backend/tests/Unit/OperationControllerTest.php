<?php

namespace Tests\Unit;

use Tests\TestCase;

use Illuminate\Foundation\Testing\RefreshDatabase; // for development stage, not production

use App\Models\Operation;
use App\Models\Suboperation;

use Illuminate\Support\Str;

class OperationControllerTest extends TestCase
{
    use RefreshDatabase;
    public function testIndex()
    {
        // Arrange
        Operation::factory()->count(13)->create();

        // Act
        $response = $this->getJson('/api/operations');

        // Assert
        $response->assertStatus(200);
        $response->assertJsonCount(13);
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
        $response->assertStatus(200);
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

    /** @test */
    public function it_can_filter_operations_by_name()
    {
        // Arrange
        Operation::factory()->create(['name' => 'Test Operation']);
        Operation::factory()->create(['name' => 'Another Operation']);

        // Act
        $response = $this->getJson('/api/operations/search?name=Test');

        // Assert
        $response->assertStatus(200);
        $response->assertJsonFragment(['name' => 'Test Operation']);
        $response->assertJsonMissing(['name' => 'Another Operation']);
    }

    /** @test */
    public function it_can_filter_operations_by_number()
    {
        // Arrange
        Operation::factory()->create(['number' => 123]);
        Operation::factory()->create(['number' => 456]);

        // Act
        $response = $this->getJson('/api/operations/search?number=123');

        // Assert
        $response->assertStatus(200);
        $response->assertJsonFragment(['number' => 123]);
        $response->assertJsonMissing(['number' => 456]);
    }

    /** @test */
    public function it_can_filter_operations_by_name_and_number()
    {
        // Arrange
        Operation::factory()->create(['name' => 'Test Operation', 'number' => 123]);
        Operation::factory()->create(['name' => 'Another Operation', 'number' => 456]);

        // Act
        $response = $this->getJson('/api/operations/search?name=Test&number=123');

        // Assert
        $response->assertStatus(200);
        $response->assertJsonFragment(['name' => 'Test Operation', 'number' => 123]);
        $response->assertJsonMissing(['name' => 'Another Operation']);
        $response->assertJsonMissing(['number' => 456]);
    }
}
