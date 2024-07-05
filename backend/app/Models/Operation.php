<?php

namespace App\Models;

use App\Models\Operation;

use Illuminate\Support\Str;
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

    protected $fillable = ['number', 'name'];

    public function suboperations()
    {
        return $this->hasMany(Suboperation::class);
    }
}
