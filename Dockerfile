# Build React/Inertia assets
FROM node:20-bookworm-slim AS assets
WORKDIR /app
COPY package*.json ./
RUN npm ci --include=dev --no-audit --no-fund
COPY . .
ENV SKIP_WAYFINDER=true
ENV ENABLE_REACT_COMPILER=false
RUN npm run build

# PHP production
FROM php:8.4-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    libicu-dev \
    zip \
    unzip \
    nginx \
    supervisor

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_pgsql pdo_mysql mbstring exif pcntl bcmath gd intl \
    && docker-php-ext-enable intl

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy composer files first for better caching
COPY composer.json composer.lock ./

# Install composer dependencies
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist --no-interaction

# Copy application code (without build artifacts, they're in .dockerignore)
COPY . /var/www/html

# Remove any locally generated Laravel cache files to avoid stale config in production
RUN rm -f /var/www/html/bootstrap/cache/*.php

# Copy built assets from node stage (must be AFTER copying app code)
COPY --from=assets /app/public/build /var/www/html/public/build

# Complete composer installation with scripts and autoloader
RUN composer dump-autoload --optimize --no-dev

# Create required directories and set permissions
RUN mkdir -p storage/framework/{sessions,views,cache} \
    && mkdir -p storage/logs \
    && mkdir -p bootstrap/cache \
    && mkdir -p /var/log/php \
    && mkdir -p /var/log/supervisor \
    && mkdir -p /var/log/nginx \
    && touch storage/logs/laravel.log \
    && touch /var/log/php/error.log \
    && chown -R www-data:www-data /var/www/html \
    && chown -R www-data:www-data /var/log/php \
    && chmod -R 775 storage bootstrap/cache /var/log/php

# Configure PHP
COPY docker/php.ini /usr/local/etc/php/conf.d/laravel.ini

# Configure nginx
COPY docker/nginx.conf /etc/nginx/sites-available/default

# Configure supervisor
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Copy entrypoint script
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
