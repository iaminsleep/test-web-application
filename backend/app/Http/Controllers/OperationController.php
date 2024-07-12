<?php

namespace App\Http\Controllers;

use App\DTO\OperationDTO;

use App\Models\Operation;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Http\JsonResponse;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OperationController extends Controller
{
    public function index(): JsonResponse
    {
        // Log query execution for debugging
        DB::listen(function ($query) {
            Log::channel('testing')->info($query->sql, $query->bindings, $query->time);
        });

        // Limit the number of records and columns retrieved
        $operations = Operation::orderBy('number')->paginate(12); // Limit to 10 records per page

        return response()->json($operations);
    }

    public function search(Request $request): JsonResponse
    {
        // Retrieve query parameters
        $name = $request->query('name');
        $number = $request->query('number');

        // Build query
        $query = Operation::query();

        if ($name) {
            $query->where('name', 'LIKE', "%{$name}%");
        }

        if ($number) {
            $query->where('number', 'LIKE', "%{$number}%");
        }

        if ($request->has('deleted') && $request->get('deleted') === 'true') {
            $query->onlyTrashed(); // Only soft deleted records
        }


        // Limit the number of records and columns retrieved
        $operations = $query->orderBy('number')->paginate(12);

        return response()->json($operations);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        // Create new operation after validation

        $operation = Operation::create([
            'uuid' => (string) Str::uuid(),
            'number' => $this->generateUniqueNumber(),
            'name' => $request->name,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Filling the DTO with data from the request
        $operationDTO = new OperationDTO([
            'uuid' => $operation->uuid,
            'number' => $operation->number,
            'name' => $operation->name,
            'created_at' => $operation->created_at->toDateTimeString(),
            'updated_at' => $operation->updated_at->toDateTimeString(),
            'deleted_at' => $operation->deleted_at ? $operation->deleted_at->toDateTimeString() : null,
        ]);

        return response()->json($operationDTO, 201);
    }

    /**
     *
     *
     * @param  string  $uuid
     * @return JsonResponse
     */
    public function show(string $uuid): JsonResponse
    {
        $operation = Operation::withTrashed()->with('suboperations')->findOrFail($uuid);
        return response()->json($operation);
    }

    /**
     *
     *
     * @param  Request  $request
     * @param  string  $uuid
     * @return JsonResponse
     */
    public function update(Request $request, string $uuid): JsonResponse
    {
        $operation = Operation::findOrFail($uuid);

        $validated = $request->validate([
            // 'number' => [
            //     'required',
            //     'integer',
            //     'min:1',
            //     Rule::unique('operations')->ignore($operation->uuid, 'uuid')->where(function ($query) {
            //         return $query->whereNull('deleted_at');
            //     }), // Обновление поля number проверяет уникальность, исключая текущую запись по uuid.
            // ],
            'name' => 'required|string|max:255',
        ]);

        // Update
        $operation->update($validated);

        $operationDTO = new OperationDTO($operation->toArray());

        // Return success response
        return response()->json($operationDTO, 200);
    }

    /**
     * Soft Delete
     *
     * @param  string  $uuid
     * @return JsonResponse
     */
    public function destroy(string $uuid): JsonResponse
    {
        $operation = Operation::with('suboperations')->findOrFail($uuid);

        $operation->delete(); // Perform soft delete instead of force delete
        return response()->json($uuid, 200);
    }

    /**
     * Hard Delete
     *
     * @param  string  $uuid
     * @return JsonResponse
     */
    public function forceDestroy(string $uuid): JsonResponse
    {
        $operation = Operation::withTrashed()->with('suboperations')->findOrFail($uuid);

        if ($operation->suboperations()->withTrashed()->count() > 0) {
            return response()->json(['error' => 'Operation cannot be permanently deleted because it has suboperations'], 400);
        }

        $operation->forceDelete(); // Perform hard delete
        return response()->json(null, 204);
    }


    private function generateUniqueNumber(): int
    {
        $maxNumber = Operation::withTrashed()->max('number');
        return is_null($maxNumber) ? 1 : $maxNumber + 1;
    }
}
