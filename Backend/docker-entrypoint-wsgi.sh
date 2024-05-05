#!/bin/bash
sleep 10

python manage.py collectstatic --no-input

echo "Starting gunicorn server"
gunicorn Backend.wsgi:application --bind 0.0.0.0:3030 --preload --timeout 90 -w 4
