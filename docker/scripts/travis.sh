#!/bin/bash

# Exit on first error
set -e

# Mount rount
mount -t tmpfs none /root

# Kill background processes on exit
trap 'kill $(jobs -p)' SIGINT SIGTERM EXIT

# Workaround with cgroup for recent version of docker
cgroups-umount
cgroups-mount

# Start docker daemon
docker -d &
sleep 2

# Use docker
docker build -t babitch_client_travis $1
docker run --privileged -it --rm babitch_client_travis test