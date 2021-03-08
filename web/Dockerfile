FROM php:8.0-apache-buster

# All apt operations
RUN apt-get update || apt-get update \
    && apt-get clean

# PHP extentions
RUN docker-php-ext-install pdo pdo_mysql

# Enable Apache's mod-rewrite
RUN a2enmod rewrite \
    # enable mod_env for env vars in .htaccess ?
    && service apache2 restart

# WORKDIR /var/www/html/darlink

# COPY ./app ./app
# COPY ./public ./public
# COPY .htaccess .

# inherited:
#   EXPOSE 80
#   CMD ["apache2-foreground"]