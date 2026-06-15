<?php

declare(strict_types=1);

namespace Repositories;

use Database;
use Models\User;
use PDO;
use RuntimeException;

class UserRepositoryImpl implements IUserRepository
{
    private PDO $connection;

    public function __construct(?PDO $connection = null)
    {
        $this->connection = $connection ?? Database::getConnection();
    }

    public function findAll(): array
    {
        $statement = $this->connection->prepare(
            'SELECT id, name, email, password, status, created_at, updated_at, deleted_at
             FROM users
             WHERE deleted_at IS NULL
             ORDER BY name ASC'
        );
        $statement->execute();

        return array_map(
            static fn (array $row): User => User::fromArray($row),
            $statement->fetchAll()
        );
    }

    public function findById(int $id): ?User
    {
        $statement = $this->connection->prepare(
            'SELECT id, name, email, password, status, created_at, updated_at, deleted_at
             FROM users
             WHERE id = :id
               AND deleted_at IS NULL
             LIMIT 1'
        );
        $statement->bindValue(':id', $id, PDO::PARAM_INT);
        $statement->execute();

        $row = $statement->fetch();

        return $row ? User::fromArray($row) : null;
    }

    public function findByEmail(string $email): ?User
    {
        $statement = $this->connection->prepare(
            'SELECT id, name, email, password, status, created_at, updated_at, deleted_at
             FROM users
             WHERE email = :email
               AND deleted_at IS NULL
             LIMIT 1'
        );
        $statement->bindValue(':email', $email);
        $statement->execute();

        $row = $statement->fetch();

        return $row ? User::fromArray($row) : null;
    }

    public function create(User $user): User
    {
        $statement = $this->connection->prepare(
            'INSERT INTO users (name, email, password, status)
             VALUES (:name, :email, :password, :status)'
        );
        $statement->bindValue(':name', $user->getName());
        $statement->bindValue(':email', $user->getEmail());
        $statement->bindValue(':password', $user->getPassword());
        $statement->bindValue(':status', $user->getStatus());
        $statement->execute();

        $createdUser = $this->findById((int) $this->connection->lastInsertId());

        if (!$createdUser instanceof User) {
            throw new RuntimeException('Unable to load created user.');
        }

        return $createdUser;
    }

    public function update(User $user): User
    {
        $statement = $this->connection->prepare(
            'UPDATE users
             SET name = :name,
                 email = :email,
                 password = :password,
                 status = :status
             WHERE id = :id
               AND deleted_at IS NULL'
        );
        $statement->bindValue(':id', $user->getId(), PDO::PARAM_INT);
        $statement->bindValue(':name', $user->getName());
        $statement->bindValue(':email', $user->getEmail());
        $statement->bindValue(':password', $user->getPassword());
        $statement->bindValue(':status', $user->getStatus());
        $statement->execute();

        $updatedUser = $this->findById((int) $user->getId());

        if (!$updatedUser instanceof User) {
            throw new RuntimeException('Unable to load updated user.');
        }

        return $updatedUser;
    }

    public function softDelete(int $id): bool
    {
        $statement = $this->connection->prepare(
            'UPDATE users
             SET status = :status,
                 deleted_at = NOW()
             WHERE id = :id
               AND deleted_at IS NULL'
        );
        $statement->bindValue(':id', $id, PDO::PARAM_INT);
        $statement->bindValue(':status', User::STATUS_ARCHIVED);
        $statement->execute();

        return $statement->rowCount() > 0;
    }
}
