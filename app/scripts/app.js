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
            .state('root', {
                url: '/',
                templateUrl: 'views/main.html',
                abstract: true
            })
            .state('root.home', {
                url: '',
                views: {
                    'main': {
                        templateUrl: 'views/partial/statsOverall.html',
                        controller: 'babitchStatsCtrl'
                    }
                }
            })
            .state('game', {
                url: '/game',
                controller: 'babitchCtrl',
                templateUrl: 'views/main.html',
                abstract: true
            }).state('game.game', {
                url: '/',
                views: {
                    'main': {
                        templateUrl: 'views/game.html'
                    },
                    'extraMenu': {
                        templateUrl: 'views/menu/gameExtraMenu.html'
                    }
                }
            })
            .state('root.live', {
                url: 'live',
                views: {
                    'main': {
                        templateUrl: 'views/live.html',
                        controller: 'babitchLiveCtrl'
                    },
                    'extraMenu': {
                        templateUrl: 'views/menu/liveExtraMenu.html'
                    }
                }
            })
            .state('root.admin', {
                url: 'admin/',
                views: {
                    'extraMenu': {
                        templateUrl: 'views/menu/adminExtraMenu.html'
                    }
                },
                abstract:true
            })
            .state('root.admin.players', {
                url: 'players',
                views: {
                    'main@root': {
                        templateUrl: 'views/partial/adminPlayers.html',
                        controller: 'babitchAdminPlayersCtrl'
                    }
                }
            })
            .state('root.admin.player-new', {
                url: 'players/new',
                views: {
                    'main@root': {
                        templateUrl: 'views/partial/adminPlayer.html',
                        controller: 'babitchAdminPlayerCtrl'
                    }
                }
            })
            .state('root.admin.player-edit', {
                url: 'players/:id',
                views: {
                    'main@root': {
                        templateUrl: 'views/partial/adminPlayer.html',
                        controller: 'babitchAdminPlayerEditCtrl'
                    }
                }
            })
            .state('root.stats', {
                url: 'stats/',
                templateUrl: 'views/stats.html',
                abstract: true,
                views: {
                    'extraMenu': {
                        templateUrl: 'views/menu/statsExtraMenu.html'
                    }
                }
            })
            .state('root.stats.games', {
                url: 'games',
                views: {
                    'main@root': {
                        templateUrl: 'views/partial/statsLastGames.html',
                        controller: 'babitchStatsGamesCtrl'
                    }
                }
            })
            .state('root.stats.game', {
                url: 'games/:selectedGame',
                views: {
                    'main@root': {
                        templateUrl: 'views/partial/statsGame.html',
                        controller: 'babitchStatsGameCtrl'
                    }
                }
            })
            .state('root.stats.players', {
                url: 'players',
                views: {
                    'main@root': {
                        templateUrl: 'views/partial/statsPlayers.html',
                        controller: 'babitchStatsPlayersCtrl'
                    }
                }
            })
            .state('root.stats.player', {
                url: 'players/:selectedPlayer',
                views: {
                    'main@root': {
                        templateUrl: 'views/partial/statsPlayer.html',
                        controller: 'babitchStatsPlayerCtrl'
                    }
                }
            })
            .state('root.stats.teams', {
                url: 'teams',
                views: {
                    'main@root': {
                        templateUrl: 'views/partial/statsTeams.html',
                        controller: 'babitchStatsTeamsCtrl'
                    }
                }
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
