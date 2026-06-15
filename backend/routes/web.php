<?php

declare(strict_types=1);

use Core\View;
use Core\Response;
use Core\Request;
use Controllers\UserController;
use Services\UserService;
use Services\AuthService;
use Repositories\UserRepositoryImpl;

return function (Router $router): void {
    $request = new Request();
    $userController = new UserController(new UserService(new UserRepositoryImpl()));

    $router->get('/', function (): void {
        View::render('home', [
            'title' => 'CMTech User Management API',
        ]);
    });

    $router->get('/health-check', function (): void {
        Response::json([
            'status' => 'ok',
            'service' => 'backend',
        ]);
    });

    $router->post('/users', function () use ($userController, $request): void {
        $result = $userController->createUser($request->body());
        Response::json($result, $result['success'] ? 201 : 422);
    });

    $router->post('/login', function () use ($request): void {
        $authService = new AuthService(new UserRepositoryImpl());
        $result = $authService->login($request->body());
        Response::json($result, $result['success'] ? 200 : 401);
    });

    $router->put('/users/{id}', function (int $id) use ($userController, $request): void {
        $result = $userController->updateUser($id, $request->body());
        Response::json($result, $result['success'] ? 200 : 422);
    });

    $router->delete('/users/{id}', function (int $id) use ($userController): void {
        $result = $userController->deleteUser($id);
        Response::json($result, $result['success'] ? 200 : 404);
    });

    $router->get('/users/{id}', function (int $id) use ($userController): void {
        $result = $userController->getUserById($id);
        Response::json($result, $result['success'] ? 200 : 404);
    });

    $router->get('/users', function () use ($userController): void {
        $result = $userController->listUsers();
        Response::json($result);
    });
};
