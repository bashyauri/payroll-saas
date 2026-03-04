#!/bin/bash

echo "Starting Laravel application..."

# Wait for database to be ready (if using external DB)
if [ ! -z "$DB_HOST" ]; then
    echo "Waiting for database connection at $DB_HOST:$DB_PORT..."
    MAX_RETRIES=30
    RETRY_COUNT=0

    until php artisan db:show 2>/dev/null || [ $RETRY_COUNT -eq $MAX_RETRIES ]; do
        echo "Database is unavailable - sleeping (attempt $((RETRY_COUNT + 1))/$MAX_RETRIES)"
        sleep 2
        RETRY_COUNT=$((RETRY_COUNT + 1))
    done

    if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
        echo "ERROR: Could not connect to database after $MAX_RETRIES attempts"
        echo "Please check your database credentials and network connectivity"
    else
        echo "Database is ready!"
    fi
fi

# Ensure storage and cache directories exist with correct permissions
echo "Setting up directories and permissions..."
mkdir -p /var/www/html/storage/framework/{sessions,views,cache}
mkdir -p /var/www/html/storage/logs
mkdir -p /var/www/html/bootstrap/cache
mkdir -p /var/log/php
mkdir -p /var/log/nginx
touch /var/www/html/storage/logs/laravel.log
touch /var/log/php/error.log
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap /var/log/php
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache /var/log/php

# Cache configuration for better performance
echo "Caching configuration..."
php artisan config:cache 2>&1 || echo "WARNING: config:cache failed"
php artisan route:cache 2>&1 || echo "WARNING: route:cache failed"
php artisan view:cache 2>&1 || echo "WARNING: view:cache failed"

# Run migrations (non-fatal)
echo "Running database migrations..."
php artisan migrate --force --no-interaction 2>&1 || echo "WARNING: Migration had issues, continuing anyway"

echo "Laravel application initialization complete!"
echo "Starting PHP-FPM and Nginx..."

# Start supervisor
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
