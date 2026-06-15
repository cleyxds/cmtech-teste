<?php

declare(strict_types=1);

use Core\Response;
use Exceptions\BusinessException;
use Exceptions\NotFoundException;
use Exceptions\ValidationException;

class Router
{
    private array $routes = [];

    public function get(string $path, callable $handler): void
    {
        $this->addRoute('GET', $path, $handler);
    }

    public function post(string $path, callable $handler): void
    {
        $this->addRoute('POST', $path, $handler);
    }

    public function put(string $path, callable $handler): void
    {
        $this->addRoute('PUT', $path, $handler);
    }

    public function delete(string $path, callable $handler): void
    {
        $this->addRoute('DELETE', $path, $handler);
    }

    public function dispatch(string $method, string $uri): void
    {
        $path = parse_url($uri, PHP_URL_PATH) ?: '/';
        $path = rtrim($path, '/') ?: '/';

        foreach ($this->routes[$method] ?? [] as $route) {
            $matches = [];

            if (preg_match($route['pattern'], $path, $matches) !== 1) {
                continue;
            }

            $parameters = array_filter(
                $matches,
                static fn (string|int $key): bool => is_string($key),
                ARRAY_FILTER_USE_KEY
            );

            try {
                call_user_func_array($route['handler'], $this->prepareHandlerParameters($route['handler'], $parameters));
            } catch (NotFoundException $exception) {
                Response::json(['message' => $exception->getMessage()], 404);
            } catch (ValidationException|BusinessException $exception) {
                Response::json(['message' => $exception->getMessage()], 422);
            } catch (Throwable) {
                Response::json(['message' => 'Erro interno do servidor.'], 500);
            }

            return;
        }

        Response::json(['message' => 'Rota não encontrada.'], 404);
    }

    private function addRoute(string $method, string $path, callable $handler): void
    {
        $normalizedPath = rtrim($path, '/') ?: '/';
        $pattern = preg_replace('/\{([a-zA-Z_][a-zA-Z0-9_]*)\}/', '(?P<$1>[^/]+)', $normalizedPath);

        $this->routes[$method][] = [
            'pattern' => '#^' . $pattern . '$#',
            'handler' => $handler,
        ];
    }

    private function prepareHandlerParameters(callable $handler, array $parameters): array
    {
        if (!is_array($parameters) || count($parameters) === 0) {
            return $parameters;
        }

        $reflection = is_array($handler)
            ? new ReflectionMethod($handler[0], $handler[1])
            : new ReflectionFunction($handler);

        $prepared = [];
        foreach ($reflection->getParameters() as $parameter) {
            $name = $parameter->getName();
            if (!array_key_exists($name, $parameters)) {
                continue;
            }

            $value = $parameters[$name];
            $prepared[$name] = $this->castValueToType($value, $parameter);
        }

        return $prepared;
    }

    private function castValueToType(string $value, ReflectionParameter $parameter): mixed
    {
        $type = $parameter->getType();
        if (!$type instanceof ReflectionNamedType || $type->isBuiltin() === false) {
            return $value;
        }

        return match ($type->getName()) {
            'int' => (int) $value,
            'float' => (float) $value,
            'bool' => in_array(strtolower($value), ['1', 'true', 'yes', 'on'], true),
            'string' => (string) $value,
            default => $value,
        };
    }
}
