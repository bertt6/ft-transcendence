#!/bin/bash
sleep 10

python manage.py collectstatic --no-input

daphne API.asgi.application
 
