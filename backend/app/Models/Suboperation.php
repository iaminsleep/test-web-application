<?php

namespace App\Models;

use App\Models\Operation;
use App\Models\Suboperation;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class Suboperation extends Model
{
    use HasFactory;

    use SoftDeletes;

    protected $primaryKey = 'uuid'; // Указываем первичный ключ
    protected $keyType = 'string'; // Определяем тип ключа
    public $incrementing = false; // Отключаем автоинкремент

    protected $fillable = ['uuid', 'operation_uuid', 'number', 'name', 'created_at', 'updated_at'];

    protected $dates = ['deleted_at'];

    public function operation(): \Illuminate\Database\Eloquent\Relations\belongsTo
    {
        return $this->belongsTo(Operation::class, 'operation_uuid', 'uuid');
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($suboperation) {
            if (is_null($suboperation->uuid)) {
                $suboperation->uuid = Str::uuid();
            }
            if (is_null($suboperation->number)) {
                $maxNumber = Suboperation::where('operation_uuid', $suboperation->operation_uuid)->max('number');
                $suboperation->number = $maxNumber ? $maxNumber + 1 : 1;
            }
        });
    }
}
