<?php

namespace Controllers;

use DTO\UserDto;
use Models\User;
use Services\UserService;
use Exceptions\ValidationException;
use Exceptions\NotFoundException;
use Exceptions\BusinessException;

class UserController
{
    private UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function createUser(array $userData): array
    {
        try {
            $user = $this->userService->createUser($userData);
            return ['success' => true, 'data' => UserDto::fromUser($user)];
        } catch (ValidationException $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        } catch (BusinessException $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function updateUser(int $userId, array $userData): array
    {
        try {
            $user = $this->userService->updateUser($userId, $userData);
            return ['success' => true, 'data' => UserDto::fromUser($user)];
        } catch (NotFoundException $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        } catch (ValidationException $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function deleteUser(int $userId): array
    {
        try {
            $this->userService->deleteUser($userId);
            return ['success' => true, 'message' => 'User deleted successfully'];
        } catch (NotFoundException $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function getUserById(int $userId): array
    {
        try {
            $user = $this->userService->getUserById($userId);
            return ['success' => true, 'data' => UserDto::fromUser($user)];
        } catch (NotFoundException $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function listUsers(): array
    {
        try {
            $users = $this->userService->listUsers();
            return ['success' => true, 'data' => array_map(static fn (User $user): UserDto => UserDto::fromUser($user), $users)];
        } catch (BusinessException $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}
