<?php

namespace App\Models;

use App\Models\Operation;
use Illuminate\Support\Str;
use App\Models\Suboperation;

use App\Events\UniversalModelEvent;
use Illuminate\Database\Eloquent\Model;
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

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($operation) {
            if (is_null($operation->uuid)) {
                $operation->uuid = Str::uuid();
            }
            if (is_null($operation->number)) {
                $operation->number = Operation::max('number') + 1;
            }
        });

        static::deleting(function ($operation) {
            if ($operation->isForceDeleting()) {
                $operation->suboperations()->forceDelete();
            } else {
                $operation->suboperations()->delete();
            }
        });
    }
}
