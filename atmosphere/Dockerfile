FROM php:8.3-cli

RUN apt-get update && apt-get install -y \
    unzip \
    git \
    libpq-dev \
    libxslt-dev \
    && docker-php-ext-install xsl \
    && apt-get clean

WORKDIR /var/www/html

COPY . .
