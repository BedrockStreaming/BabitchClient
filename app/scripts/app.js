'use strict';

angular.module('babitchFrontendApp', [
    'ngCookies',
    'ngSanitize',
    'ui.router',
    'babitchServer',
    'faye',
    'ui.gravatar',
    'restangular'
])
    .config(function($stateProvider,  $urlRouterProvider, $httpProvider, gravatarServiceProvider, RestangularProvider, CONFIG) {
        gravatarServiceProvider.defaults = {
            size: 400,
            default: 'mm' // Mystery man as default for missing avatars
        };

        $urlRouterProvider.otherwise('/');

        $urlRouterProvider.when('/admin', '/admin/players');

        $stateProvider
            .state('index', {
                url: '/',
                templateUrl: 'views/index.html'
            })
            .state('game', {
                url: '/game',
                templateUrl: 'views/main.html',
                controller: 'babitchCtrl'
            })
            .state('live', {
                url: '/live',
                templateUrl: 'views/live.html',
                controller: 'babitchLiveCtrl'
            })
            .state('admin-players', {
                url: '/admin/players',
                templateUrl: 'views/adminPlayers.html',
                controller: 'babitchAdminPlayersCtrl'
            })
            .state('admin-player-new', {
                url: '/admin/players/new',
                templateUrl: 'views/admin-player.html',
                controller: 'babitchAdminPlayersCtrl'
            })
            .state('admin-player-edit', {
                url: '/admin/players/:id',
                templateUrl: 'views/admin-player.html',
                controller: 'babitchAdminPlayerEditCtrl'
            })
            .state('stats', {
                url: '/stats',
                templateUrl: 'views/stats.html',
                abstract: true
            })
            .state('stats.index', {
                url: '',
                templateUrl: 'views/partial/statsOverall.html',
                controller: 'babitchStatsCtrl'
            })
            .state('stats.games', {
                url: '/games',
                templateUrl: 'views/partial/statsLastGames.html',
                controller: 'babitchStatsGamesCtrl'
            })
            .state('stats.game', {
                url: '/games/:selectedGame',
                templateUrl: 'views/partial/statsGame.html',
                controller: 'babitchStatsGameCtrl'
            })
            .state('stats.players', {
                url: '/players',
                templateUrl: 'views/partial/statsPlayers.html',
                controller: 'babitchStatsPlayersCtrl'
            })
            .state('stats.player', {
                url: '/players/:selectedPlayer',
                templateUrl: 'views/partial/statsPlayer.html',
                controller: 'babitchStatsPlayerCtrl'
            })
            .state('stats.teams', {
                url: '/teams',
                templateUrl: 'views/partial/statsTeams.html',
                controller: 'babitchStatsTeamsCtrl'
            });

        RestangularProvider.setBaseUrl(CONFIG.BABITCH_WS_URL);

        RestangularProvider.setRequestInterceptor(function(element, operation) {
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
