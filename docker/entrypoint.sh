#!/bin/bash
set +e  # Don't exit on error

echo "Starting Laravel application..."

# Wait for database to be ready (if using external DB)
if [ ! -z "$DB_HOST" ]; then
    echo "Waiting for database connection at $DB_HOST:$DB_PORT..."
    MAX_RETRIES=30
    RETRY_COUNT=0

    until timeout 5 php artisan db:show >/dev/null 2>&1 || [ $RETRY_COUNT -eq $MAX_RETRIES ]; do
        echo "Database is unavailable - sleeping (attempt $((RETRY_COUNT + 1))/$MAX_RETRIES)"
        sleep 2
        RETRY_COUNT=$((RETRY_COUNT + 1))
    done

    if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
        echo "WARNING: Could not connect to database after $MAX_RETRIES attempts"
        echo "WARNING: App will start but database features may not work"
    else
        echo "Database is ready!"

        # Only run these commands if database is available
        echo "Caching configuration..."
        timeout 30 php artisan config:cache 2>&1 || echo "WARNING: config:cache failed"
        timeout 30 php artisan route:cache 2>&1 || echo "WARNING: route:cache failed"
        timeout 30 php artisan view:cache 2>&1 || echo "WARNING: view:cache failed"

        echo "Running database migrations..."
        timeout 60 php artisan migrate --force --no-interaction 2>&1 || echo "WARNING: Migration had issues, continuing anyway"
    fi
fi

# Ensure storage and cache directories exist with correct permissions (always do this)
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

echo "Laravel application initialization complete!"
echo "Starting PHP-FPM and Nginx..."

# Start supervisor
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
