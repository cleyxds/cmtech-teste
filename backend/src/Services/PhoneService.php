<?php

declare(strict_types=1);

namespace Services;

use Models\Phone;
use Repositories\IPhoneRepository;
use Repositories\IUserRepository;
use Exceptions\NotFoundException;
use Exceptions\ValidationException;

class PhoneService
{
    private IPhoneRepository $phoneRepository;
    private IUserRepository $userRepository;

    public function __construct(IPhoneRepository $phoneRepository, IUserRepository $userRepository)
    {
        $this->phoneRepository = $phoneRepository;
        $this->userRepository = $userRepository;
    }

    public function createPhone(int $userId, array $phoneData): Phone
    {
        $user = $this->userRepository->findById($userId);
        if (!$user) {
            throw new NotFoundException('User not found');
        }
        
        $this->validatePhoneData($phoneData);

        $phone = new Phone(
            $userId,
            $phoneData['phone_number'],
            null,
            Phone::STATUS_ACTIVE
        );

        return $this->phoneRepository->create($phone);
    }

    public function updatePhone(int $phoneId, array $phoneData): Phone
    {
        $phone = $this->phoneRepository->findById($phoneId);
        if (!$phone) {
            throw new NotFoundException('Phone not found');
        }
        
        $this->validatePhoneData($phoneData, false);

        if (isset($phoneData['phone_number'])) {
            $phone->setPhoneNumber($phoneData['phone_number']);
        }

        return $this->phoneRepository->update($phone);
    }

    public function deletePhone(int $phoneId): void
    {
        $phone = $this->phoneRepository->findById($phoneId);
        if (!$phone) {
            throw new NotFoundException('Phone not found');
        }
        
        $this->phoneRepository->softDelete($phoneId);
    }

    public function getPhoneById(int $phoneId): Phone
    {
        $phone = $this->phoneRepository->findById($phoneId);
        if (!$phone) {
            throw new NotFoundException('Phone not found');
        }
        
        return $phone;
    }

    public function listPhonesByUser(int $userId): array
    {
        $user = $this->userRepository->findById($userId);
        if (!$user) {
            throw new NotFoundException('User not found');
        }
        
        return $this->phoneRepository->findByUserId($userId);
    }

    private function validatePhoneData(array $phoneData, bool $isCreate = true): void
    {
        if ($isCreate && empty($phoneData['phone_number'])) {
            throw new ValidationException('Phone number is required');
        }
        
        if (isset($phoneData['phone_number']) && !preg_match('/^\+?[0-9\s-]{10,}$/', $phoneData['phone_number'])) {
            throw new ValidationException('Invalid phone number format');
        }
    }
}
