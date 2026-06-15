<?php

declare(strict_types=1);

namespace Services;

use Repositories\UserRepositoryImpl;
use Models\User;
use Exceptions\BusinessException;

class AuthService
{
    private UserRepositoryImpl $userRepository;
    private string $secret;
    private int $ttl;

    public function __construct(UserRepositoryImpl $userRepository)
    {
        $this->userRepository = $userRepository;
        $config = require __DIR__ . '/../../config/app.php';
        $this->secret = $config['jwt_secret'];
        $this->ttl = (int) ($config['jwt_ttl'] ?? 3600);
    }

    public function login(array $data): array
    {
        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;

        if (!$email || !$password) {
            return ['success' => false, 'message' => 'Email and password required'];
        }

        $user = $this->userRepository->findByEmail($email);

        if (!$user instanceof User) {
            return ['success' => false, 'message' => 'Invalid credentials'];
        }

        if (!password_verify($password, $user->getPassword())) {
            return ['success' => false, 'message' => 'Invalid credentials'];
        }

        $now = time();
        $payload = [
            'sub' => $user->getId(),
            'email' => $user->getEmail(),
            'iat' => $now,
            'exp' => $now + $this->ttl,
        ];

        $token = $this->createJwt($payload);

        return ['success' => true, 'data' => ['token' => $token, 'user' => $user->toArray()]];
    }

    private function base64UrlEncode(string $input): string
    {
        return rtrim(strtr(base64_encode($input), '+/', '-_'), '=');
    }

    private function createJwt(array $payload): string
    {
        $header = ['alg' => 'HS256', 'typ' => 'JWT'];
        $headerEncoded = $this->base64UrlEncode(json_encode($header));
        $payloadEncoded = $this->base64UrlEncode(json_encode($payload));

        $signature = hash_hmac('sha256', $headerEncoded . '.' . $payloadEncoded, $this->secret, true);
        $signatureEncoded = $this->base64UrlEncode($signature);

        return $headerEncoded . '.' . $payloadEncoded . '.' . $signatureEncoded;
    }
}
