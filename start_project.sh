#!/bin/bash

docker compose down 
if [ -f ./Devops/elk-stack/elasticsearch_volume ]; then
    rm -rf psql
fi

clear

docker compose up --build 