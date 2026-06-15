<?php

declare(strict_types=1);

namespace Repositories;

use Models\User;

interface IUserRepository
{
    public function findAll(): array;

    public function findById(int $id): ?User;

    public function findByEmail(string $email): ?User;

    public function create(User $user): User;

    public function update(User $user): User;

    public function softDelete(int $id): bool;
}
