<?php

declare(strict_types=1);

namespace Repositories;

interface IPhoneRepository
{
    public function findAll(): array;

    public function findByUserId(int $userId): array;

    public function findById(int $id): ?\Models\Phone;

    public function create(\Models\Phone $phone): \Models\Phone;

    public function update(\Models\Phone $phone): \Models\Phone;

    public function softDelete(int $id): bool;
}
