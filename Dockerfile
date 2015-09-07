FROM node:0.12-slim

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
        git \
        nginx \
        bzip2

RUN mkdir -p /var/www/html/BabitchClient

COPY . /var/www/html/BabitchClient/

WORKDIR /var/www/html/BabitchClient

RUN cp app/scripts/config.js.dist app/scripts/config.js

RUN npm install \
    && npm install grunt \
    && npm install -g \
        bower \
        grunt-cli \
    && bower install --allow-root

RUN grunt build

COPY docker/nginx-vhost.conf /etc/nginx/sites-available/default

EXPOSE 80

ENTRYPOINT ["nginx"]

CMD ["-g", "daemon off;"]
