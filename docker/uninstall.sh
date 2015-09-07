#!/bin/sh

# delete BabitchClient container
docker rm -f m6web-babitch-client

# delete BabitchClient image
docker rmi docker_m6web-babitch-client
docker rmi node:0.12-slim
