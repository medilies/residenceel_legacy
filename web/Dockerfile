FROM php:8.0-apache-buster

# All apt operations
RUN apt-get update || apt-get update; \
    apt-get install -y --no-install-recommends libpng-dev \
    && apt-get install -y zlib1g-dev \
    && apt-get clean

# PHP extentions
RUN docker-php-ext-install pdo pdo_mysql\
    && docker-php-ext-install gd 

# Enable Apache's mod-rewrite
RUN a2enmod rewrite \
    && service apache2 restart
