<?php

declare(strict_types=1);

namespace Services;

use Models\Address;
use Repositories\IAddressRepository;
use Repositories\IUserRepository;
use Exceptions\BusinessException;
use Exceptions\NotFoundException;
use Exceptions\ValidationException;

class AddressService
{
    private IAddressRepository $addressRepository;
    private IUserRepository $userRepository;

    public function __construct(IAddressRepository $addressRepository, IUserRepository $userRepository)
    {
        $this->addressRepository = $addressRepository;
        $this->userRepository = $userRepository;
    }

    public function createAddress(int $userId, array $addressData): Address
    {
        $user = $this->userRepository->findById($userId);
        if (!$user) {
            throw new NotFoundException('User not found');
        }
        
        $this->validateAddressData($addressData);
        
        if (isset($addressData['zip_code'])) {
            $addressData = $this->fetchAddressFromViaCEP($addressData);
        }

        $address = new Address(
            $userId,
            $addressData['zip_code'],
            $addressData['street'],
            $addressData['number'],
            $addressData['neighborhood'],
            $addressData['city'],
            $addressData['state'],
            $addressData['complement'] ?? null,
            null,
            Address::STATUS_ACTIVE
        );

        return $this->addressRepository->create($address);
    }

    public function updateAddress(int $addressId, array $addressData): Address
    {
        $address = $this->addressRepository->findById($addressId);
        if (!$address) {
            throw new NotFoundException('Address not found');
        }
        
        $this->validateAddressData($addressData, false);
        
        if (isset($addressData['zip_code'])) {
            $addressData = $this->fetchAddressFromViaCEP($addressData);
        }

        if (isset($addressData['zip_code'])) {
            $address->setZipCode($addressData['zip_code']);
        }
        if (isset($addressData['street'])) {
            $address->setStreet($addressData['street']);
        }
        if (isset($addressData['number'])) {
            $address->setNumber($addressData['number']);
        }
        if (array_key_exists('complement', $addressData)) {
            $address->setComplement($addressData['complement']);
        }
        if (isset($addressData['neighborhood'])) {
            $address->setNeighborhood($addressData['neighborhood']);
        }
        if (isset($addressData['city'])) {
            $address->setCity($addressData['city']);
        }
        if (isset($addressData['state'])) {
            $address->setState($addressData['state']);
        }

        return $this->addressRepository->update($address);
    }

    public function deleteAddress(int $addressId): void
    {
        $address = $this->addressRepository->findById($addressId);
        if (!$address) {
            throw new NotFoundException('Address not found');
        }
        
        $this->addressRepository->softDelete($addressId);
    }

    public function getAddressById(int $addressId): Address
    {
        $address = $this->addressRepository->findById($addressId);
        if (!$address) {
            throw new NotFoundException('Address not found');
        }
        
        return $address;
    }

    public function listAddressesByUser(int $userId): array
    {
        $user = $this->userRepository->findById($userId);
        if (!$user) {
            throw new NotFoundException('User not found');
        }
        
        return $this->addressRepository->findByUserId($userId);
    }

    private function validateAddressData(array $addressData, bool $isCreate = true): void
    {
        if ($isCreate && empty($addressData['zip_code'])) {
            throw new ValidationException('Zip code is required');
        }
        
        if (isset($addressData['zip_code']) && !preg_match('/^\d{8}$/', $addressData['zip_code'])) {
            throw new ValidationException('Invalid zip code format');
        }
        
        if ($isCreate && empty($addressData['street'])) {
            throw new ValidationException('Street is required');
        }
        
        if ($isCreate && empty($addressData['number'])) {
            throw new ValidationException('Number is required');
        }
        
        if ($isCreate && empty($addressData['neighborhood'])) {
            throw new ValidationException('Neighborhood is required');
        }
        
        if ($isCreate && empty($addressData['city'])) {
            throw new ValidationException('City is required');
        }
        
        if ($isCreate && empty($addressData['state'])) {
            throw new ValidationException('State is required');
        }
    }

    private function fetchAddressFromViaCEP(array $addressData): array
    {
        $zipCode = preg_replace('/[^0-9]/', '', $addressData['zip_code']);
        $url = "https://viacep.com.br/ws/{$zipCode}/json/";
        
        $response = file_get_contents($url);
        if ($response === false) {
            throw new BusinessException('Failed to fetch address from ViaCEP');
        }
        
        $data = json_decode($response, true);
        if (isset($data['erro']) && $data['erro'] === true) {
            throw new BusinessException('Zip code not found');
        }
        
        $addressData['street'] = $data['logradouro'] ?? $addressData['street'];
        $addressData['neighborhood'] = $data['bairro'] ?? $addressData['neighborhood'];
        $addressData['city'] = $data['localidade'] ?? $addressData['city'];
        $addressData['state'] = $data['uf'] ?? $addressData['state'];
        
        return $addressData;
    }
}
