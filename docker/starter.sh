#!/usr/bin/env bash

case "$1" in
    "prod")
        service nginx start
        ;;
    "dev")
        /var/www/docker/xvfb.sh start
        /var/www/docker/x11vnc.sh start
        service proftpd start
        /bin/bash
        ;;
    "test")
        /var/www/docker/xvfb.sh start
        /var/www/docker/x11vnc.sh start
        /var/www/node_modules/.bin/grunt test
        exit $?
        ;;
esac