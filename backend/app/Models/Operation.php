<?php

namespace App\Models;

use App\Models\Operation;
use App\Models\Suboperation;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Operation extends Model
{
    use HasFactory;

    use SoftDeletes;

    protected $primaryKey = 'uuid'; // Указываем первичный ключ
    protected $keyType = 'string'; // Определяем тип ключа
    public $incrementing = false; // Отключаем автоинкремент

    protected $fillable = ['uuid', 'number', 'name', 'created_at', 'updated_at'];

    protected $dates = ['deleted_at'];

    public function suboperations(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Suboperation::class, 'operation_uuid', 'uuid');
    }
}
