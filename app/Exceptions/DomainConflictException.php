<?php

namespace App\Exceptions;

use RuntimeException;
use Throwable;

class DomainConflictException extends RuntimeException
{
    public function __construct(
        public readonly string $domain,
        ?string $message = null,
        ?Throwable $previous = null,
    ) {
        parent::__construct(
            $message ?? 'The workspace subdomain is already assigned to another organization.',
            0,
            $previous,
        );
    }
}
