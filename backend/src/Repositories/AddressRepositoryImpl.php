<?php

declare(strict_types=1);

namespace Repositories;

use Database;
use Models\Address;
use PDO;
use RuntimeException;

class AddressRepositoryImpl implements IAddressRepository
{
    private PDO $connection;

    public function __construct(?PDO $connection = null)
    {
        $this->connection = $connection ?? Database::getConnection();
    }

    public function findAll(): array
    {
        $statement = $this->connection->prepare(
            'SELECT id, user_id, zip_code, street, number, complement, neighborhood, city, state, status, created_at, updated_at, deleted_at
             FROM addresses
             WHERE deleted_at IS NULL
             ORDER BY id DESC'
        );
        $statement->execute();

        return array_map(
            static fn (array $row): Address => Address::fromArray($row),
            $statement->fetchAll()
        );
    }

    public function findByUserId(int $userId): array
    {
        $statement = $this->connection->prepare(
            'SELECT id, user_id, zip_code, street, number, complement, neighborhood, city, state, status, created_at, updated_at, deleted_at
             FROM addresses
             WHERE user_id = :user_id
               AND deleted_at IS NULL
             ORDER BY id DESC'
        );
        $statement->bindValue(':user_id', $userId, PDO::PARAM_INT);
        $statement->execute();

        return array_map(
            static fn (array $row): Address => Address::fromArray($row),
            $statement->fetchAll()
        );
    }

    public function findById(int $id): ?Address
    {
        $statement = $this->connection->prepare(
            'SELECT id, user_id, zip_code, street, number, complement, neighborhood, city, state, status, created_at, updated_at, deleted_at
             FROM addresses
             WHERE id = :id
               AND deleted_at IS NULL
             LIMIT 1'
        );
        $statement->bindValue(':id', $id, PDO::PARAM_INT);
        $statement->execute();

        $row = $statement->fetch();

        return $row ? Address::fromArray($row) : null;
    }

    public function create(Address $address): Address
    {
        $statement = $this->connection->prepare(
            'INSERT INTO addresses (user_id, zip_code, street, number, complement, neighborhood, city, state, status)
             VALUES (:user_id, :zip_code, :street, :number, :complement, :neighborhood, :city, :state, :status)'
        );
        $statement->bindValue(':user_id', $address->getUserId(), PDO::PARAM_INT);
        $statement->bindValue(':zip_code', $address->getZipCode());
        $statement->bindValue(':street', $address->getStreet());
        $statement->bindValue(':number', $address->getNumber());
        $statement->bindValue(':complement', $address->getComplement());
        $statement->bindValue(':neighborhood', $address->getNeighborhood());
        $statement->bindValue(':city', $address->getCity());
        $statement->bindValue(':state', $address->getState());
        $statement->bindValue(':status', $address->getStatus());
        $statement->execute();

        $createdAddress = $this->findById((int) $this->connection->lastInsertId());

        if (!$createdAddress instanceof Address) {
            throw new RuntimeException('Unable to load created address.');
        }

        return $createdAddress;
    }

    public function update(Address $address): Address
    {
        $statement = $this->connection->prepare(
            'UPDATE addresses
             SET user_id = :user_id,
                 zip_code = :zip_code,
                 street = :street,
                 number = :number,
                 complement = :complement,
                 neighborhood = :neighborhood,
                 city = :city,
                 state = :state,
                 status = :status
             WHERE id = :id
               AND deleted_at IS NULL'
        );
        $statement->bindValue(':id', $address->getId(), PDO::PARAM_INT);
        $statement->bindValue(':user_id', $address->getUserId(), PDO::PARAM_INT);
        $statement->bindValue(':zip_code', $address->getZipCode());
        $statement->bindValue(':street', $address->getStreet());
        $statement->bindValue(':number', $address->getNumber());
        $statement->bindValue(':complement', $address->getComplement());
        $statement->bindValue(':neighborhood', $address->getNeighborhood());
        $statement->bindValue(':city', $address->getCity());
        $statement->bindValue(':state', $address->getState());
        $statement->bindValue(':status', $address->getStatus());
        $statement->execute();

        $updatedAddress = $this->findById((int) $address->getId());

        if (!$updatedAddress instanceof Address) {
            throw new RuntimeException('Unable to load updated address.');
        }

        return $updatedAddress;
    }

    public function softDelete(int $id): bool
    {
        $statement = $this->connection->prepare(
            'UPDATE addresses
             SET status = :status,
                 deleted_at = NOW()
             WHERE id = :id
               AND deleted_at IS NULL'
        );
        $statement->bindValue(':id', $id, PDO::PARAM_INT);
        $statement->bindValue(':status', Address::STATUS_ARCHIVED);
        $statement->execute();

        return $statement->rowCount() > 0;
    }
}
