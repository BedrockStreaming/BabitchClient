## Usage of GIT version

## For production purposes

* Configure a Web Server (Apache/Nginx/...) with the `dist` folder as the doc root
* Launch `<yourwebserver.com>/` in a browser

### For dev purposes

Launch:

```
$ grunt serve
```

Then go to `http://127.0.0.1:8080/`,

You have two options for the server side :

* Install the Babitch Server API => [M6Web/Babitch](https://github.com/M6Web/Babitch) and change `app/scripts/config.js`
* Use the faked backend by adding `?nobackend` to the BabitchClient url