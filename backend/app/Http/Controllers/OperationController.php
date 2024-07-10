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
        $operations = Operation::paginate(10); // Limit to 10 records per page

        return response()->json($operations);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        // После валидации создаем новую операцию

        $operation = Operation::create([
            'uuid' => (string) Str::uuid(),
            'number' => $request->number,
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
     * Получить операцию по UUID.
     *
     * @param  string  $uuid
     * @return JsonResponse
     */
    public function show(string $uuid): JsonResponse
    {
        $operation = Operation::with('suboperations')->findOrFail($uuid);
        return response()->json($operation);
    }

    /**
     * Обновить операцию.
     *
     * @param  Request  $request
     * @param  string  $uuid
     * @return JsonResponse
     */
    public function update(Request $request, string $uuid): JsonResponse
    {
        $operation = Operation::findOrFail($uuid);

        $validated = $request->validate([
            'number' => [
                'required',
                'integer',
                'min:1',
                Rule::unique('operations')->ignore($operation->uuid, 'uuid')->where(function ($query) {
                    return $query->whereNull('deleted_at');
                }), // Обновление поля number проверяет уникальность, исключая текущую запись по uuid.
            ],
            'name' => 'required|string|max:255',
        ]);

        // Обновляем операцию
        $operation->update($validated);

        $operationDTO = new OperationDTO($operation->toArray());

        // Возвращаем успешный ответ
        return response()->json($operationDTO, 200);

    }

    /**
     * Удалить операцию мягко.
     *
     * @param  string  $uuid
     * @return JsonResponse
     */
    public function destroy(string $uuid): JsonResponse
    {
        $operation = Operation::with('suboperations')->findOrFail($uuid);

        if ($operation->suboperations()->withTrashed()->count() > 0) {
            return response()->json(['error' => 'Operation cannot be permanently deleted because it has suboperations'], 400);
        }

        $operation->delete(); // Perform soft delete instead of force delete
        return response()->json(null, 204);
    }

    /**
     * Удалить операцию полностью.
     *
     * @param  string  $uuid
     * @return JsonResponse
     */
    public function forceDestroy(string $uuid): JsonResponse
    {
        $operation = Operation::with('suboperations')->findOrFail($uuid);

        if ($operation->suboperations()->withTrashed()->count() > 0) {
            return response()->json(['error' => 'Operation cannot be permanently deleted because it has suboperations'], 400);
        }

        $operation->forceDelete(); // Perform hard delete
        return response()->json(null, 204);
    }
}
