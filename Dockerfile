# Build React/Inertia assets
FROM node:20-alpine AS assets
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# PHP production
FROM richarvey/nginx-php-fpm:3.1

COPY --from=assets /app/public/build /var/www/html/public/build
COPY . /var/www/html

RUN composer install --no-dev --optimize-autoloader

RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

EXPOSE 9000
