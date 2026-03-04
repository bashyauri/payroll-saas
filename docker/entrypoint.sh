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
mkdir -p /var/log/supervisor
touch /var/www/html/storage/logs/laravel.log
touch /var/log/php/error.log
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap /var/log/php /var/www/html/public
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache /var/log/php
chmod 755 /var/www/html/public

echo "Initialization complete, starting PHP-FPM and Nginx..."

# Start supervisor immediately, don't wait for anything
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
