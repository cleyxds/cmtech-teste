<?php

declare(strict_types=1);

namespace DTO;

use JsonSerializable;
use Models\User;

class UserDto implements JsonSerializable
{
    private ?int $id;
    private string $name;
    private string $email;
    private string $status;
    private ?string $createdAt;
    private ?string $updatedAt;
    private ?string $deletedAt;

    public function __construct(
        ?int $id,
        string $name,
        string $email,
        string $status,
        ?string $createdAt,
        ?string $updatedAt,
        ?string $deletedAt
    ) {
        $this->id = $id;
        $this->name = $name;
        $this->email = $email;
        $this->status = $status;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
        $this->deletedAt = $deletedAt;
    }

    public static function fromUser(User $user): self
    {
        return new self(
            $user->getId(),
            $user->getName(),
            $user->getEmail(),
            $user->getStatus(),
            $user->getCreatedAt()?->format('Y-m-d H:i:s'),
            $user->getUpdatedAt()?->format('Y-m-d H:i:s'),
            $user->getDeletedAt()?->format('Y-m-d H:i:s')
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'status' => $this->status,
            'created_at' => $this->createdAt,
            'updated_at' => $this->updatedAt,
            'deleted_at' => $this->deletedAt,
        ];
    }

    public function jsonSerialize(): array
    {
        return $this->toArray();
    }
}
