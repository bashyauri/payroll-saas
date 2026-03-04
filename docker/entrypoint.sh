#!/bin/bash
set +e  # Don't exit on error

echo "Starting Laravel application..."

# Ensure storage and cache directories exist with correct permissions
echo "Setting up directories and permissions..."
mkdir -p /var/www/html/storage/framework/{sessions,views,cache}
mkdir -p /var/www/html/storage/logs
mkdir -p /var/www/html/bootstrap/cache
mkdir -p /var/www/html/public/build
mkdir -p /var/log/php
mkdir -p /var/log/nginx
touch /var/www/html/storage/logs/laravel.log
touch /var/log/php/error.log
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap /var/log/php /var/www/html/public
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache /var/log/php
chmod 755 /var/www/html/public

# Attempt to cache config via background job (non-blocking)
# This will run asynchronously and won't block service startup
(
    sleep 2
    timeout 30 php artisan config:cache 2>&1 &
    timeout 30 php artisan route:cache 2>&1 &
    timeout 60 php artisan migrate --force --no-interaction 2>&1 &
) &

echo "Initialization complete, starting PHP-FPM and Nginx..."

# Start supervisor immediately, don't wait for anything
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
