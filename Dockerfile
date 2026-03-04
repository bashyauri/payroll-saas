# Build React/Inertia assets
FROM node:20-alpine AS assets
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ENV SKIP_WAYFINDER=true
RUN npm run build

# PHP production
FROM richarvey/nginx-php-fpm:latest

WORKDIR /var/www/html

# Copy composer files first for better caching
COPY composer.json composer.lock ./

# Install composer dependencies
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist --no-interaction

# Copy application code
COPY --from=assets /app/public/build /var/www/html/public/build
COPY . /var/www/html

# Complete composer installation with scripts and autoloader
RUN composer dump-autoload --optimize --no-dev

# Create required directories and set permissions
RUN mkdir -p storage/framework/{sessions,views,cache} \
    && mkdir -p storage/logs \
    && mkdir -p bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

EXPOSE 9000
