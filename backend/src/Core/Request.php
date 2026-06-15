<?php

declare(strict_types=1);

namespace Core;

class Request
{
    public function body(): array
    {
        $contentType = $_SERVER['CONTENT_TYPE'] ?? $_SERVER['HTTP_CONTENT_TYPE'] ?? '';
        $rawBody = file_get_contents('php://input');

        if ($this->isJson($contentType) && $rawBody !== false && $rawBody !== '') {
            $data = json_decode($rawBody, true);

            if (json_last_error() === JSON_ERROR_NONE && is_array($data)) {
                return $data;
            }

            return [];
        }

        return $_POST;
    }

    private function isJson(string $contentType): bool
    {
        return str_contains($contentType, 'application/json');
    }
}
