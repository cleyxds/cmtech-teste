<?php

namespace Controllers;

use Services\PhoneService;
use Exceptions\ValidationException;
use Exceptions\NotFoundException;
use Exceptions\BusinessException;

class PhoneController
{
    private PhoneService $phoneService;

    public function __construct(PhoneService $phoneService)
    {
        $this->phoneService = $phoneService;
    }

    public function createPhone(int $userId, array $phoneData): array
    {
        try {
            $phone = $this->phoneService->createPhone($userId, $phoneData);
            return ['success' => true, 'data' => $phone];
        } catch (ValidationException $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        } catch (NotFoundException $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        } catch (BusinessException $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function updatePhone(int $phoneId, array $phoneData): array
    {
        try {
            $phone = $this->phoneService->updatePhone($phoneId, $phoneData);
            return ['success' => true, 'data' => $phone];
        } catch (NotFoundException $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        } catch (ValidationException $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function deletePhone(int $phoneId): array
    {
        try {
            $this->phoneService->deletePhone($phoneId);
            return ['success' => true, 'message' => 'Phone deleted successfully'];
        } catch (NotFoundException $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function getPhoneById(int $phoneId): array
    {
        try {
            $phone = $this->phoneService->getPhoneById($phoneId);
            return ['success' => true, 'data' => $phone];
        } catch (NotFoundException $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function listPhonesByUser(int $userId): array
    {
        try {
            $phones = $this->phoneService->listPhonesByUser($userId);
            return ['success' => true, 'data' => $phones];
        } catch (NotFoundException $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        } catch (BusinessException $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}
