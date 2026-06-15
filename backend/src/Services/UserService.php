<?php

declare(strict_types=1);

namespace Services;

use Models\User;
use Repositories\IUserRepository;
use Exceptions\BusinessException;
use Exceptions\NotFoundException;
use Exceptions\ValidationException;

class UserService
{
    private IUserRepository $userRepository;

    public function __construct(IUserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function createUser(array $userData): User
    {
        $this->validateUserData($userData);
        
        if ($this->userRepository->findByEmail($userData['email'])) {
            throw new BusinessException('Email already in use');
        }
        
        $userData['password'] = password_hash($userData['password'], PASSWORD_DEFAULT);

        $user = new User(
            $userData['name'],
            $userData['email'],
            $userData['password'],
            null,
            User::STATUS_ACTIVE
        );
        
        return $this->userRepository->create($user);
    }

    public function updateUser(int $userId, array $userData): User
    {
        $user = $this->userRepository->findById($userId);
        if (!$user) {
            throw new NotFoundException('User not found');
        }
        
        $this->validateUserData($userData, false);
        
        if (isset($userData['email']) && $userData['email'] !== $user->getEmail()) {
            if ($this->userRepository->findByEmail($userData['email'])) {
                throw new BusinessException('Email already in use');
            }
        }
        
        if (isset($userData['password'])) {
            $user->setPassword(password_hash($userData['password'], PASSWORD_DEFAULT));
        }

        if (isset($userData['name'])) {
            $user->setName($userData['name']);
        }

        if (isset($userData['email'])) {
            $user->setEmail($userData['email']);
        }

        $user->setStatus($user->getStatus());

        return $this->userRepository->update($user);
    }

    public function deleteUser(int $userId): void
    {
        $user = $this->userRepository->findById($userId);
        if (!$user) {
            throw new NotFoundException('User not found');
        }
        
        $this->userRepository->softDelete($userId);
    }

    public function getUserById(int $userId): User
    {
        $user = $this->userRepository->findById($userId);
        if (!$user) {
            throw new NotFoundException('User not found');
        }
        
        return $user;
    }

    public function listUsers(): array
    {
        return $this->userRepository->findAll();
    }

    private function validateUserData(array $userData, bool $isCreate = true): void
    {
        if ($isCreate && empty($userData['name'])) {
            throw new ValidationException('Name is required');
        }
        
        if ($isCreate && empty($userData['email'])) {
            throw new ValidationException('Email is required');
        }
        
        if (isset($userData['email']) && !filter_var($userData['email'], FILTER_VALIDATE_EMAIL)) {
            throw new ValidationException('Invalid email format');
        }
        
        if ($isCreate && empty($userData['password'])) {
            throw new ValidationException('Password is required');
        }
        
        if (isset($userData['password']) && strlen($userData['password']) < 6) {
            throw new ValidationException('Password must be at least 6 characters');
        }
    }
}
