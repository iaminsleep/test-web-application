# Dockerfile

FROM php:8.1-fpm

# Install dependencies
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

# Set working directory
WORKDIR /var/www

# Copy application files
COPY . .

# Copy php.ini configuration
COPY php.ini /usr/local/etc/php/conf.d/

# Install PHP dependencies with Composer
RUN composer install

# Set permissions
RUN chown -R www-data:www-data /var/www 

EXPOSE 9000
CMD ["php-fpm"]