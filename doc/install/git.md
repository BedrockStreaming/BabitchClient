# Install with GIT

## Clone the project

```shell
$ git clone https://github.com/M6Web/BabitchClient.git
```

## Configure

```shell
$ cd BabitchClient
$ cp app/scripts/config.js.dist app/scripts/config.js
```

Then edit app/scripts/config.js to match your requirements

## For production purposes

* Install the Babitch Server API => [M6Web/Babitch](https://github.com/M6Web/Babitch)
* Go to app/scripts/config.js and change server config

```
$ ./node_modules/.bin/bower install
$ ./node_modules/.bin/grunt build
```

## For dev purposes

```
$ npm install
$ ./node_modules/.bin/bower install
```