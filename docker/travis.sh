#!/bin/bash

# Exit on first error
set -e

# Kill background processes on exit
trap 'kill $(jobs -p)' SIGINT SIGTERM EXIT

# Start docker daemon
docker -d &
sleep 1

echo $PWD

# Use docker
docker build -t babitch_client_travis ..
docker run --privileged -it --rm babitch_client_travis test