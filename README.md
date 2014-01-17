# Babitch Client

Many companies all over the world uses babyfoot to build team spirit. BabitchClient is a project based on the [Babitch Api](https://github.com/M6Web/Babitch) to record all your babyfoot games.

BabitchClient provides a simple responsive user interface.

![Babitch Screenshot](screenshot.png)

## Features 

* 2VS2 
* Attacker/Defender Goal 
* Own goal support
* Cancel last goal

## Installation

### Clone the project

```
$ git clone https://github.com/M6Web/BabitchClient.git
$ cd BabitchClient
```

### For production purposes
```
$ bower install
```
Then,

* Install the Babitch Server API => [M6Web/Babitch](https://github.com/M6Web/Babitch)
* Go to app/scripts/config.js and change server config
* And launch the index.html on any Web Server (Apache/Nginx/...)

### For dev purposes 
```
$ npm install
$ bower install
$ grunt serve
```
Then go to `http://127.0.0.1:8080/`,

You have two options for the server side :

* Install the Babitch Server API => [M6Web/Babitch](https://github.com/M6Web/Babitch) and change app/scripts/config.js
* Use the faked backend by adding `?nobackend` to the BabitchClient url

#### Test (Unit & E2E)

* `grunt test`
 
## Technical Stack

* Yeoman, to boostrap the application
* Angular.Js
* Grunt, for development server and automation
* Karma and PhantomJs, for testing

## Credits

Developped by [M6 Web](http://tech.m6web.fr/).  

## License

Babitch is licensed under the [MIT license](LICENSE).
