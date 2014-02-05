'use strict';

var babitchFrontendApp = angular.module('babitchFrontendApp', [
    'ngCookies',
    'ngSanitize',
    'ngRoute',
    'babitchServer',
    'faye',
    'ui.gravatar',
    'restangular'
])
    .config(function($routeProvider, $httpProvider, gravatarServiceProvider, RestangularProvider, CONFIG) {
        gravatarServiceProvider.defaults = {
            size: 400,
            "default": 'mm' // Mystery man as default for missing avatars
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
            .when('/admin', {
                templateUrl: 'views/admin.html',
                controller: 'babitchAdminCtrl'
            })
            .when('/admin/new', {
                templateUrl: 'views/admin-player.html',
                controller: 'babitchAdminPlayerCtrl'
            })
            .when('/admin/:id', {
                templateUrl: 'views/admin-player.html',
                controller: 'babitchAdminPlayerEditCtrl',
                resolve: {
                    player: function(Restangular, $route) {
                        return Restangular.one('players', $route.current.params.id).get();
                    }
                }
            })
            .otherwise({
                redirectTo: '/'
            });

        RestangularProvider.setBaseUrl(CONFIG.BABITCH_WS_URL);

        RestangularProvider.setRequestInterceptor(function(element, operation, route, url) {
            console.log(element);
            if (operation === 'put' || operation === 'post') {
                delete element._links;
                delete element.id;
                delete element.route;
                return element;
            }
        });


        //Enable cross domain calls
        $httpProvider.defaults.useXDomain = true;


        //Remove the header used to identify ajax call  that would prevent CORS from working
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    });