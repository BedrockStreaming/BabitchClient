'use strict';

var babitchFrontendApp = angular.module('babitchFrontendApp',[
    'ngCookies',
    'ngSanitize',
    'ngRoute',
    'babitchServer',
    'faye',
    'ui.gravatar',
    'restangular'
    ])
    .config(function ($routeProvider, $httpProvider, gravatarServiceProvider, RestangularProvider, CONFIG) {
        gravatarServiceProvider.defaults = {
            size     : 400,
            "default": 'mm'  // Mystery man as default for missing avatars
        };

        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'babitchCtrl'
            })
            .when('/live', {
                templateUrl: 'views/live.html',
                controller: 'babitchLiveCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });

        RestangularProvider.setBaseUrl(CONFIG.BABITCH_WS_URL);

        //Enable cross domain calls
        $httpProvider.defaults.useXDomain = true;


        //Remove the header used to identify ajax call  that would prevent CORS from working
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    });

