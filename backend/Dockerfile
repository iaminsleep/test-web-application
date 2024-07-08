# backend/Dockerfile

FROM php:8.1-fpm

# Install dependencies
USER root
RUN apt-get update && apt-get install -y \
    git \
    zip \
    curl \
    sudo \
    unzip \
    libzip-dev \
    libicu-dev \
    libbz2-dev \
    libpng-dev \
    libjpeg-dev \
    libmcrypt-dev \
    libreadline-dev \
    libfreetype6-dev \
    libpq-dev \
    g++ && docker-php-ext-install pdo pdo_pgsql

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Создаём пользователя и группу www для приложения Laravel
RUN groupadd -g 1000 www \
    && useradd -u 1000 -ms /bin/bash -g www www

# Копируем содержимое текущего каталога в рабочую директорию
COPY . /var/www
COPY --chown=www:www . /var/www

# Меняем владельца рабочей директории на www
RUN chown -R www:www /var/www

# Меняем пользователя на www
USER www

# Set working directory
WORKDIR /var/www

# Copy php.ini configuration
COPY php.ini /usr/local/etc/php/conf.d/

# Install PHP dependencies with Composer
RUN composer install --no-interaction --optimize-autoloader --no-dev

EXPOSE 9000
CMD ["php-fpm"]
