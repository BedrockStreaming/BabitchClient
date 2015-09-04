#!/bin/sh

cd ..

docker build -t docker_m6web-babitch-client .

docker run --name m6web-babitch-client -d -p 8000:80 docker_m6web-babitch-client



