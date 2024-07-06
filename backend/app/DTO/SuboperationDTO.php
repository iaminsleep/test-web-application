<?php

namespace App\DTO;

class SuboperationDTO
{
    public string $uuid;
    public string $operation_uuid;
    public int $number;
    public string $name;
    public \DateTime $created_at;
    public \DateTime $updated_at;
    public ?\DateTime $deleted_at;

    public function __construct(array $data)
    {
        $this->uuid = $data['uuid'];
        $this->operation_uuid = $data['operation_uuid'];
        $this->number = $data['number'];
        $this->name = $data['name'];
        $this->created_at = new \DateTime($data['created_at']);
        $this->updated_at = new \DateTime($data['updated_at']);
        $this->deleted_at = isset($data['deleted_at']) ? new \DateTime($data['deleted_at']) : null;
    }
}
