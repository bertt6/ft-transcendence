FROM debian:buster

RUN apt-get update && apt-get install -y nginx openssl

RUN mkdir /etc/nginx/ssl

COPY ./Nginx/nginx.conf /etc/nginx/sites-enabled/default
COPY Backend/templates /var/www/html/templates
COPY ./Nginx/nginx_start.sh /var/www

RUN chmod +x /var/www/nginx_start.sh
RUN mkdir -p /run/nginx

ENTRYPOINT ["var/www/nginx_start.sh"]

EXPOSE 443

CMD ["sh", "Nginx/nginx_start.sh"]