<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Database\Eloquent\Model;

class UniversalModelEvent
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    public Model $model;
    public string $eventType;

    public function __construct($model, $eventType)
    {
        $this->model = $model;
        $this->eventType = $eventType;
    }
}
