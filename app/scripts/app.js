'use strict';

var babitchFrontendApp = angular.module('babitchFrontendApp',[
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'babitchServer',
    'faye',
    'ui.gravatar'
    ])
    .config(function ($routeProvider, $httpProvider, gravatarServiceProvider) {
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
            .when('/stats', {
                templateUrl: 'views/stats.html',
                controller: 'babitchStatsCtrl'
            })
            .when('/stats/:playerId', {
                templateUrl: 'views/stats-player.html',
                controller: 'babitchStatsPlayerCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });

        //Enable cross domain calls
        $httpProvider.defaults.useXDomain = true;


        //Remove the header used to identify ajax call  that would prevent CORS from working
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    });

