'use strict';

var babitchServer = angular.module("babitchServer", [])
    .constant('CONFIG', {
        'BABITCH_WS_URL': "http://127.0.0.1:8081/app_dev.php/v1"
});

var babitchFrontendApp = angular.module('babitchFrontendApp',[
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'babitchServer'
    ])
    .config(function ($routeProvider, $httpProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'babitchCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });

        //Enable cross domain calls
        $httpProvider.defaults.useXDomain = true;

        //Remove the header used to identify ajax call  that would prevent CORS from working
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    });

