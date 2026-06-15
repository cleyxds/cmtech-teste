<?php

declare(strict_types=1);

return [
    'jwt_secret' => getenv('JWT_SECRET') ?: 'dev_jwt_secret_change_me',
    'jwt_ttl' => 3600, // seconds
];
