# Usage of Docker version

## Development mode

This mode make contribution easier, it run the container with the following component:

- X11VNC: VNC Server used to render browser while protractor is running (port binding: `-p <your_port>:5999`)
- XVFB: Virtual frame buffer used to simulate a display for protractor purposes
- ProFTPd: FTP server used to edit files in container from your favorite editor (port binding: `-p <your_port>:21`)

There is no Nginx running on dev mode as your will prefer to use `grunt serve` for development purpose.

```shell
$ sudo docker run --privileged -t -i -p 8000:80 -p 5999:5999 -p 2121:21 m6web/babitch-client dev
```

## Production mode

This mode provide a lightweight server, it run the container with the following component:

- Nginx: Web server (port binding: `-p <your_port>:80`)

```shell
$ sudo docker run --privileged -t -i -p 8000:80 m6web/babitch-client prod
```

You now have a BabitchClient listening on port `8000`!

## Test mode

This mode simply launch test suites, it run the container with the following component:

- X11VNC: VNC Server used to render browser while protractor is running (port binding: `-p <your_port>:5999`)
- XVFB: Virtual frame buffer used to simulate a display for protractor purposes

```shell
$ sudo docker run --privileged -t -i -p 5999:5999 m6web/babitch-client test
```