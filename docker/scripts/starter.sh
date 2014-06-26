#!/usr/bin/env bash

sed -i -e "s|%BABITCH_WS_URL%|${BABITCH_WS_URL}|"\
    -e "s|%BABITCH_LIVE_FAYE_URL%|${BABITCH_LIVE_FAYE_URL}|"\
    -e "s|%BABITCH_LIVE_FAYE_CHANNEL%|${BABITCH_LIVE_FAYE_CHANNEL}|"\
    -e "s|%BABITCH_STATS_MIN_GAME_PLAYED%|${BABITCH_STATS_MIN_GAME_PLAYED}|"\
    prod/scripts/*.scripts.js

case "$1" in
    "prod")
        service nginx start
        ;;
    "dev")
        if [ ! -d "/var/www/dev" ]
        then
            echo "[Error] No dev volume mounted."
            exit 1
        fi
        cd /var/www/dev
        /var/www/scripts/xvfb.sh start
        /var/www/scripts/x11vnc.sh start
        /bin/bash
        ;;
    "test")
        if [ ! -d "/var/www/dev" ]
        then
            echo "[Error] No dev volume mounted."
            exit 1
        fi
        cd /var/www/dev
        /var/www/scripts/xvfb.sh start
        /var/www/scripts/x11vnc.sh start
        /var/www/dev/node_modules/.bin/grunt test
        exit $?
        ;;
esac