# --------------------------------------------------
# Build Frontend Assets
# --------------------------------------------------
FROM node:20-bookworm-slim AS assets

WORKDIR /app

COPY package*.json ./

RUN npm ci --include=dev --no-audit --no-fund

COPY . .

ENV SKIP_WAYFINDER=true
ENV ENABLE_REACT_COMPILER=false

RUN npm run build


# --------------------------------------------------
# PHP Production Image
# --------------------------------------------------
FROM php:8.4-fpm

# Install system packages
RUN apt-get update && apt-get install -y \
    git \
    curl \
    nginx \
    supervisor \
    zip \
    unzip \
    libzip-dev \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    libicu-dev \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install \
    pdo_pgsql \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    intl \
    zip

# Verify zip extension is installed
RUN php -m | grep zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# --------------------------------------------------
# Install PHP Dependencies
# --------------------------------------------------
COPY composer.json composer.lock ./

RUN composer install \
    --no-dev \
    --prefer-dist \
    --no-interaction \
    --no-scripts \
    --no-autoloader

# --------------------------------------------------
# Copy Application
# --------------------------------------------------
COPY . .

# Remove cached Laravel files
RUN rm -f bootstrap/cache/*.php

# Copy built frontend assets
COPY --from=assets /app/public/build ./public/build

# Generate optimized autoload files
RUN composer dump-autoload \
    --optimize \
    --no-dev

# --------------------------------------------------
# Create Laravel Directories
# --------------------------------------------------
RUN mkdir -p \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache \
    /var/log/php \
    /var/log/nginx \
    /var/log/supervisor

RUN touch storage/logs/laravel.log \
    && touch /var/log/php/error.log

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chown -R www-data:www-data /var/log/php \
    && chmod -R 775 storage bootstrap/cache

# --------------------------------------------------
# Configuration Files
# --------------------------------------------------
COPY docker/php.ini /usr/local/etc/php/conf.d/laravel.ini

COPY docker/nginx.conf \
    /etc/nginx/sites-available/default

COPY docker/supervisord.conf \
    /etc/supervisor/conf.d/supervisord.conf

COPY docker/entrypoint.sh \
    /usr/local/bin/entrypoint.sh

RUN chmod +x /usr/local/bin/entrypoint.sh

# --------------------------------------------------
# Runtime
# --------------------------------------------------
EXPOSE 80

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]