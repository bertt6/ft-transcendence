FROM nginx:alpine

RUN apk add --no-cache openssl

RUN mkdir -p /etc/nginx/ssl

RUN rm /etc/nginx/conf.d/default.conf
COPY ./conf/nginx.conf /etc/nginx/conf.d

COPY ./tools/nginx_start.sh /var/www/nginx_start.sh

RUN chmod +x /var/www/nginx_start.sh

RUN mkdir -p /run/nginx

RUN /bin/sh /var/www/nginx_start.sh

