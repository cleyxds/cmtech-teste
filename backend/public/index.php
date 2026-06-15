<?php

declare(strict_types=1);

session_start();

// CORS: allow frontend to call API during development
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header('Access-Control-Allow-Origin: ' . $origin);
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

spl_autoload_register(function (string $className): void {
    $className = ltrim($className, '\\');
    $relativePath = str_replace('\\', '/', $className) . '.php';

    $directories = [
        __DIR__ . '/../src',
        __DIR__ . '/../src/Core',
    ];

    foreach ($directories as $directory) {
        $file = $directory . '/' . $relativePath;

        if (file_exists($file)) {
            require_once $file;
            return;
        }
    }
});

$router = new Router();
$routes = require __DIR__ . '/../routes/web.php';

$routes($router);
$router->dispatch($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI']);
