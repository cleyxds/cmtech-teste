<?php

declare(strict_types=1);

namespace Repositories;

use Database;
use Models\Phone;
use PDO;
use RuntimeException;

class PhoneRepositoryImpl implements IPhoneRepository
{
    private PDO $connection;

    public function __construct(?PDO $connection = null)
    {
        $this->connection = $connection ?? Database::getConnection();
    }

    public function findAll(): array
    {
        $statement = $this->connection->prepare(
            'SELECT id, user_id, phone_number, status, created_at, updated_at, deleted_at
             FROM phones
             WHERE deleted_at IS NULL
             ORDER BY id DESC'
        );
        $statement->execute();

        return array_map(
            static fn (array $row): Phone => Phone::fromArray($row),
            $statement->fetchAll()
        );
    }

    public function findByUserId(int $userId): array
    {
        $statement = $this->connection->prepare(
            'SELECT id, user_id, phone_number, status, created_at, updated_at, deleted_at
             FROM phones
             WHERE user_id = :user_id
               AND deleted_at IS NULL
             ORDER BY id DESC'
        );
        $statement->bindValue(':user_id', $userId, PDO::PARAM_INT);
        $statement->execute();

        return array_map(
            static fn (array $row): Phone => Phone::fromArray($row),
            $statement->fetchAll()
        );
    }

    public function findById(int $id): ?Phone
    {
        $statement = $this->connection->prepare(
            'SELECT id, user_id, phone_number, status, created_at, updated_at, deleted_at
             FROM phones
             WHERE id = :id
               AND deleted_at IS NULL
             LIMIT 1'
        );
        $statement->bindValue(':id', $id, PDO::PARAM_INT);
        $statement->execute();

        $row = $statement->fetch();

        return $row ? Phone::fromArray($row) : null;
    }

    public function create(Phone $phone): Phone
    {
        $statement = $this->connection->prepare(
            'INSERT INTO phones (user_id, phone_number, status)
             VALUES (:user_id, :phone_number, :status)'
        );
        $statement->bindValue(':user_id', $phone->getUserId(), PDO::PARAM_INT);
        $statement->bindValue(':phone_number', $phone->getPhoneNumber());
        $statement->bindValue(':status', $phone->getStatus());
        $statement->execute();

        $createdPhone = $this->findById((int) $this->connection->lastInsertId());

        if (!$createdPhone instanceof Phone) {
            throw new RuntimeException('Unable to load created phone.');
        }

        return $createdPhone;
    }

    public function update(Phone $phone): Phone
    {
        $statement = $this->connection->prepare(
            'UPDATE phones
             SET user_id = :user_id,
                 phone_number = :phone_number,
                 status = :status
             WHERE id = :id
               AND deleted_at IS NULL'
        );
        $statement->bindValue(':id', $phone->getId(), PDO::PARAM_INT);
        $statement->bindValue(':user_id', $phone->getUserId(), PDO::PARAM_INT);
        $statement->bindValue(':phone_number', $phone->getPhoneNumber());
        $statement->bindValue(':status', $phone->getStatus());
        $statement->execute();

        $updatedPhone = $this->findById((int) $phone->getId());

        if (!$updatedPhone instanceof Phone) {
            throw new RuntimeException('Unable to load updated phone.');
        }

        return $updatedPhone;
    }

    public function softDelete(int $id): bool
    {
        $statement = $this->connection->prepare(
            'UPDATE phones
             SET status = :status,
                 deleted_at = NOW()
             WHERE id = :id
               AND deleted_at IS NULL'
        );
        $statement->bindValue(':id', $id, PDO::PARAM_INT);
        $statement->bindValue(':status', Phone::STATUS_ARCHIVED);
        $statement->execute();

        return $statement->rowCount() > 0;
    }
}
