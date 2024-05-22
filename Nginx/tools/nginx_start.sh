#!/bin/bash

if [ ! -f /etc/nginx/ssl/nginx.crt ]; then
    echo "Nginx: setting up ssl ...";
    openssl req -x509 -nodes -days 365 -newkey rsa:4096 -keyout /Users/berat/Desktop/deniyorum_local/Nginx/nginx.key -out /Users/berat/Desktop/deniyorum_local/Nginx/nginx.crt -subj "/C=TR/ST=ISTANBUL/L=SARIYER/O=42Istanbul/CN=localhost";
    echo "Nginx: ssl is set up!";
fi

exec "$@"