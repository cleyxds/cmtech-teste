<?php

declare(strict_types=1);

namespace Core;

use RuntimeException;

class View
{
    public static function render(string $view, array $data = []): void
    {
        $viewPath = __DIR__ . '/../../views/' . $view . '.php';

        if (!file_exists($viewPath)) {
            throw new RuntimeException('View not found: ' . $view);
        }

        extract($data, EXTR_SKIP);
        require $viewPath;
    }
}
