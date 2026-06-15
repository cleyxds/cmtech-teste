<?php

namespace Controllers;

use Services\AddressService;
use Exceptions\ValidationException;
use Exceptions\NotFoundException;
use Exceptions\BusinessException;

class AddressController
{
    private AddressService $addressService;

    public function __construct(AddressService $addressService)
    {
        $this->addressService = $addressService;
    }

    public function createAddress(int $userId, array $addressData): array
    {
        try {
            $address = $this->addressService->createAddress($userId, $addressData);
            return ['success' => true, 'data' => $address];
        } catch (ValidationException $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        } catch (NotFoundException $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        } catch (BusinessException $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function updateAddress(int $addressId, array $addressData): array
    {
        try {
            $address = $this->addressService->updateAddress($addressId, $addressData);
            return ['success' => true, 'data' => $address];
        } catch (NotFoundException $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        } catch (ValidationException $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function deleteAddress(int $addressId): array
    {
        try {
            $this->addressService->deleteAddress($addressId);
            return ['success' => true, 'message' => 'Address deleted successfully'];
        } catch (NotFoundException $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function getAddressById(int $addressId): array
    {
        try {
            $address = $this->addressService->getAddressById($addressId);
            return ['success' => true, 'data' => $address];
        } catch (NotFoundException $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    public function listAddressesByUser(int $userId): array
    {
        try {
            $addresses = $this->addressService->listAddressesByUser($userId);
            return ['success' => true, 'data' => $addresses];
        } catch (NotFoundException $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        } catch (BusinessException $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}
