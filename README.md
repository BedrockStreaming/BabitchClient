# Babitch Client

Many companies all over the world uses babyfoot to build team spirit. Babitch Client is a project based on the Babitch Api to record all your babyfoot games.

Babitch provides a simple responsive user interface.

## Installation

#### Clone the project

```
$ git clone https://github.com/M6Web/Babitch-client.git
$ cd Babitch
```

#### Install dependencies

```
$ npm install
$ bower install
```

#### Install Babitch Server

See Here https://github.com/M6Web/Babitch

#### Configure Api URL

Go to app/scripts/config.js and change server config

## Use

* User interface : `http://127.0.0.1:8080/`,

## Test (Unit & E2E)

* `grunt test`

## Live (experimental)

You need to configure `BABITCH_LIVE_FAYE_URL` and `BABITCH_LIVE_FAYE_CHANNEL` in `app/scripts/config.js`

* User interface : `http://127.0.0.1:8080/#live`

## Credits

Developped by [M6 Web](http://tech.m6web.fr/).  

## License

Babitch is licensed under the [MIT license](LICENSE).
