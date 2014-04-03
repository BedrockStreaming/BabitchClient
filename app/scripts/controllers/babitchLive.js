/* global _ */
/* jshint camelcase: false */
'use strict';

angular.module('babitchFrontendApp').controller('babitchLiveCtrl', function ($scope, fayeClient, Restangular, CONFIG) {

    $scope.refreshAvailableGames = function() {
        $scope.currentGamesIds = [];
        fayeClient.publish(CONFIG.BABITCH_LIVE_FAYE_CHANNEL, {type: 'requestCurrentGame'});
    };

    $scope.clearGame = function() {
        $scope.game          = null;
        $scope.currentGameId = null;
        $scope.redAttacker   = null;
        $scope.redDefender   = null;
        $scope.blueAttacker  = null;
        $scope.blueDefender  = null;
        $scope.lastGoal      = null;
    };

    $scope.$watch('currentGameId', function(newValue, oldValue) {
        if (oldValue && !_.isUndefined(oldValue) && oldValue !== newValue) {
            $scope.clearGame();
            $scope.refreshAvailableGames();
        }

        return newValue;
    });

    $scope.refreshAvailableGames();
    $scope.clearGame();

    fayeClient.subscribe(CONFIG.BABITCH_LIVE_FAYE_CHANNEL, function(data) {
        if (data.type === 'requestCurrentGame') {
            return;
        }

        if (!_.contains($scope.currentGamesIds, data.gameId)) {
            $scope.currentGamesIds.push(data.gameId);
        }

        if (data.type === 'end') {
            $scope.currentGamesIds = _.without($scope.currentGamesIds, data.gameId);
            $scope.refreshAvailableGames();
        }

        if (!$scope.currentGameId || !_.contains($scope.currentGamesIds, $scope.currentGameId)) {
            $scope.currentGameId = data.gameId;
        }

        if(data.gameId !== $scope.currentGameId) {
            return;
        }

        var lastGoal = _.last(data.game.goals);

        if (lastGoal) {
            Restangular.one('players', lastGoal.player_id).get().then(function(player) {
                $scope.lastGoal = _.extend({player: player}, lastGoal);
            });
        }

        $scope.game = data.game;

        data.game.player.forEach(function(position) {
            Restangular.one('players', position.player_id).get().then(function(player) {
                if (position.position === 'attack' && position.team === 'red') {
                    $scope.redAttacker = player;
                }
                if (position.position === 'defense' && position.team === 'red') {
                    $scope.redDefender = player;
                }
                if (position.position === 'attack' && position.team === 'blue') {
                    $scope.blueAttacker = player;
                }
                if (position.position === 'defense' && position.team === 'blue') {
                    $scope.blueDefender = player;
                }
            });
        });
    });
});
