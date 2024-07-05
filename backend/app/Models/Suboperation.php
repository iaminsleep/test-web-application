<?php

namespace App\Models;

use Illuminate\Support\Str;

use App\Models\Suboperation;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Suboperation extends Model
{
    use HasFactory;

    use SoftDeletes;

    protected $primaryKey = 'uuid'; // Указываем первичный ключ
    protected $keyType = 'string'; // Определяем тип ключа
    public $incrementing = false; // Отключаем автоинкремент

    protected $fillable = ['operation_uuid', 'number', 'name'];

    public function operation()
    {
        return $this->belongsTo(Operation::class);
    }
}
