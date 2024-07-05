<?php

namespace App\Http\Controllers;

use App\Models\Operation;

use Illuminate\Http\Request;

use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class OperationController extends Controller
{
    public function index()
    {
        return Operation::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'number' => [
                'required',
                'integer',
                'min:1',
                Rule::unique('operations')->where(function ($query) {
                    return $query->whereNull('deleted_at'); // Поле number должно быть уникальным в таблице operations, исключая записи с ненулевым значением deleted_at (для учета soft delete).
                }),
            ],
            'name' => 'required|string|max:255',
        ]);

        // После валидации создаем новую операцию
        $operation = new Operation();
        $operation->uuid = Str::uuid();
        $operation->number = $validated['number'];
        $operation->name = $validated['name'];
        $operation->save();

        // Возвращаем успешный ответ
        return response()->json($operation, 201);
    }

    public function show($uuid)
    {
        return Operation::findOrFail($uuid);
    }

    public function update(Request $request, $uuid)
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

        // Возвращаем успешный ответ
        return response()->json($operation, 200);

    }

    public function destroy($uuid)
    {
        $operation = Operation::findOrFail($uuid);
        $operation->delete();

        return response()->json(null, 204);
    }
}
