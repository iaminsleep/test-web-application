<?php

namespace App\Http\Controllers;

use App\Models\Operation;
use Illuminate\Support\Str;

use App\DTO\SuboperationDTO;

use App\Models\Suboperation;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Http\JsonResponse;

class SuboperationController extends Controller
{
    public function index($operationUuid): JsonResponse
    {
        $suboperations = Suboperation::withTrashed()->where('operation_uuid', $operationUuid)->get();
        return response()->json($suboperations);
    }

    /**
     *
     *
     * @param  Request  $request
     * @param  string  $operationUuid
     * @return JsonResponse
     */
    public function store(Request $request, string $operationUuid): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        // After validation create new operation

        $suboperation = Suboperation::create([
            'uuid' => (string) Str::uuid(),
            'operation_uuid' => $operationUuid,
            'number' => $this->generateUniqueNumberForOperation($operationUuid),
            'name' => $request->name,
        ]);

        // Filling the DTO with data from the request
        $suboperationDTO = new SuboperationDTO([
            'uuid' => $suboperation->uuid,
            'operation_uuid' => $operationUuid,
            'number' => $suboperation->number,
            'name' => $suboperation->name,
            'created_at' => $suboperation->created_at->toDateTimeString(),
            'updated_at' => $suboperation->updated_at->toDateTimeString(),
            'deleted_at' => $suboperation->deleted_at ? $suboperation->deleted_at->toDateTimeString() : null,
        ]);

        // Return 201
        return response()->json($suboperationDTO, 201);
    }

    public function show(string $operationUuid, string $suboperationUuid): JsonResponse
    {
        $suboperation = Suboperation::where('operation_uuid', $operationUuid)
                                            ->where('uuid', $suboperationUuid)
                                            ->firstOrFail();
        return response()->json($suboperation);
    }

    public function update(Request $request, string $operationUuid, string $suboperationUuid): JsonResponse
    {
        $operation = Operation::findOrFail($operationUuid);
        $suboperation = Suboperation::where('operation_uuid', $operationUuid)->findOrFail($suboperationUuid);

        $validated = $request->validate([
            'number' => [
                'required',
                'integer',
                'min:1',
                Rule::unique('suboperations')->where(function ($query) use ($operation, $suboperation) {
                    return $query->where('operation_uuid', $operation->uuid)
                                 ->where('uuid', '!=', $suboperation->uuid)
                                 ->whereNull('deleted_at');
                }),
            ],
            'name' => 'required|string|max:255',
        ]);

        $suboperation->update($validated);

        return response()->json($suboperation);
    }

    public function destroy(string $operationUuid, string $suboperationUuid): JsonResponse
    {
        $suboperation = Suboperation::where('operation_uuid', $operationUuid)->findOrFail($suboperationUuid);
        $suboperation->delete();

        // Check if there are any active (non-deleted) suboperations
        $activeSuboperationsCount = Suboperation::where('operation_uuid', $operationUuid)
            ->whereNull('deleted_at')
            ->count();

        if ($activeSuboperationsCount === 0) {
            // Soft delete the operation if there are no active suboperations
            $operation = Operation::findOrFail($operationUuid);
            $operation->delete();
        }

        return response()->json($suboperationUuid, 200);
    }

    public function forceDestroy(string $operationUuid, string $suboperationUuid)
    {
        $suboperation = Suboperation::withTrashed()->where('operation_uuid', $operationUuid)->findOrFail($suboperationUuid);
        $suboperation->forceDelete();

        // Check if operation should be soft deleted AS WELL
        $operation = Operation::withTrashed()->findOrFail($operationUuid);
        if ($operation->suboperations()->count() === 0) {
            $operation->forceDelete();
        }

        return response()->json(null, 204);
    }

    /**
     * Generate unique number for suboperation
     *
     * @param  string  $operationUuid
     * @return int
     */
    private function generateUniqueNumberForOperation(string $operationUuid): int
    {
        $maxNumber = Suboperation::where('operation_uuid', $operationUuid)->withTrashed()->max('number');
        return is_null($maxNumber) ? 1 : $maxNumber + 1;
    }
}
