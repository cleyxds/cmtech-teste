<?php

declare(strict_types=1);

namespace Repositories;

use Models\Address;

interface IAddressRepository
{
    public function findAll(): array;

    public function findByUserId(int $userId): array;

    public function findById(int $id): ?Address;

    public function create(Address $address): Address;

    public function update(Address $address): Address;

    public function softDelete(int $id): bool;
}
