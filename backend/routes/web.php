<?php

declare(strict_types=1);

use Core\View;
use Core\Response;
use Core\Request;
use Controllers\UserController;
use Controllers\AddressController;
use Controllers\PhoneController;
use Services\UserService;
use Services\AuthService;
use Services\AddressService;
use Services\PhoneService;
use Repositories\UserRepositoryImpl;
use Repositories\AddressRepositoryImpl;
use Repositories\PhoneRepositoryImpl;

return function (Router $router): void {
    $request = new Request();
    $userController = new UserController(new UserService(new UserRepositoryImpl()));
    $addressController = new AddressController(new AddressService(new AddressRepositoryImpl(), new UserRepositoryImpl()));
    $phoneController = new PhoneController(new PhoneService(new PhoneRepositoryImpl(), new UserRepositoryImpl()));

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

    // Addresses
    $router->get('/users/{id}/addresses', function (int $id) use ($addressController): void {
        $result = $addressController->listAddressesByUser($id);
        Response::json($result, $result['success'] ? 200 : 404);
    });

    $router->post('/users/{id}/addresses', function (int $id) use ($addressController, $request): void {
        $result = $addressController->createAddress($id, $request->body());
        Response::json($result, $result['success'] ? 201 : 422);
    });

    $router->get('/addresses/{id}', function (int $id) use ($addressController): void {
        $result = $addressController->getAddressById($id);
        Response::json($result, $result['success'] ? 200 : 404);
    });

    $router->put('/addresses/{id}', function (int $id) use ($addressController, $request): void {
        $result = $addressController->updateAddress($id, $request->body());
        Response::json($result, $result['success'] ? 200 : 422);
    });

    $router->delete('/addresses/{id}', function (int $id) use ($addressController): void {
        $result = $addressController->deleteAddress($id);
        Response::json($result, $result['success'] ? 200 : 404);
    });

    // Phones
    $router->get('/users/{id}/phones', function (int $id) use ($phoneController): void {
        $result = $phoneController->listPhonesByUser($id);
        Response::json($result, $result['success'] ? 200 : 404);
    });

    $router->post('/users/{id}/phones', function (int $id) use ($phoneController, $request): void {
        $result = $phoneController->createPhone($id, $request->body());
        Response::json($result, $result['success'] ? 201 : 422);
    });

    $router->get('/phones/{id}', function (int $id) use ($phoneController): void {
        $result = $phoneController->getPhoneById($id);
        Response::json($result, $result['success'] ? 200 : 404);
    });

    $router->put('/phones/{id}', function (int $id) use ($phoneController, $request): void {
        $result = $phoneController->updatePhone($id, $request->body());
        Response::json($result, $result['success'] ? 200 : 422);
    });

    $router->delete('/phones/{id}', function (int $id) use ($phoneController): void {
        $result = $phoneController->deletePhone($id);
        Response::json($result, $result['success'] ? 200 : 404);
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
