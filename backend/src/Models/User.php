<?php

declare(strict_types=1);

namespace Models;

use DateTimeImmutable;

class User implements \JsonSerializable
{
    public const STATUS_ACTIVE = 'ACTIVE';
    public const STATUS_ARCHIVED = 'ARCHIVED';

    private ?int $id;
    private string $name;
    private string $email;
    private string $password;
    private string $status;
    private ?DateTimeImmutable $createdAt;
    private ?DateTimeImmutable $updatedAt;
    private ?DateTimeImmutable $deletedAt;

    public function __construct(
        string $name,
        string $email,
        string $password,
        ?int $id = null,
        string $status = self::STATUS_ACTIVE,
        ?DateTimeImmutable $createdAt = null,
        ?DateTimeImmutable $updatedAt = null,
        ?DateTimeImmutable $deletedAt = null
    ) {
        $this->id = $id;
        $this->name = $name;
        $this->email = $email;
        $this->password = $password;
        $this->status = $status;
        $this->createdAt = $createdAt;
        $this->updatedAt = $updatedAt;
        $this->deletedAt = $deletedAt;
    }

    public static function fromArray(array $data): self
    {
        return new self(
            $data['name'],
            $data['email'],
            $data['password'],
            isset($data['id']) ? (int) $data['id'] : null,
            $data['status'] ?? self::STATUS_ACTIVE,
            self::parseDate($data['created_at'] ?? null),
            self::parseDate($data['updated_at'] ?? null),
            self::parseDate($data['deleted_at'] ?? null)
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'password' => $this->password,
            'status' => $this->status,
            'created_at' => $this->formatDate($this->createdAt),
            'updated_at' => $this->formatDate($this->updatedAt),
            'deleted_at' => $this->formatDate($this->deletedAt),
        ];
    }

    public function jsonSerialize(): array
    {
        return $this->toArray();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): self
    {
        $this->id = $id;

        return $this;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getCreatedAt(): ?DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(?DateTimeImmutable $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?DateTimeImmutable $updatedAt): self
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    public function getDeletedAt(): ?DateTimeImmutable
    {
        return $this->deletedAt;
    }

    public function setDeletedAt(?DateTimeImmutable $deletedAt): self
    {
        $this->deletedAt = $deletedAt;

        return $this;
    }

    public function isActive(): bool
    {
        return $this->status === self::STATUS_ACTIVE && $this->deletedAt === null;
    }

    public function isArchived(): bool
    {
        return $this->status === self::STATUS_ARCHIVED || $this->deletedAt !== null;
    }

    public function archive(?DateTimeImmutable $deletedAt = null): self
    {
        $this->status = self::STATUS_ARCHIVED;
        $this->deletedAt = $deletedAt ?? new DateTimeImmutable();

        return $this;
    }

    private static function parseDate(mixed $value): ?DateTimeImmutable
    {
        if ($value === null || $value === '') {
            return null;
        }

        return $value instanceof DateTimeImmutable ? $value : new DateTimeImmutable((string) $value);
    }

    private function formatDate(?DateTimeImmutable $date): ?string
    {
        return $date?->format('Y-m-d H:i:s');
    }
}
