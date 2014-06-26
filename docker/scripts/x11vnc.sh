#!/usr/bin/env bash

X11VNC=/usr/bin/x11vnc
X11VNCARGS="-display $DISPLAY -N -forever"
PIDFILE=/var/run/x11vnc.pid
case "$1" in
  start)
    echo -n "Starting VNC Server: X11VNC"
    start-stop-daemon --start --pidfile $PIDFILE --make-pidfile --background --exec $X11VNC -- $X11VNCARGS
    echo "."
    ;;
  stop)
    echo -n "Stopping VNC Server: X11VNC"
    start-stop-daemon --stop --pidfile $PIDFILE
    echo "."
    ;;
  restart)
    $0 stop
    $0 start
    ;;
esac

exit 0