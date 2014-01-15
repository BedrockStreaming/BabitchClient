'use strict';

babitchFrontendApp.controller("babitchLiveCtrl", function ($scope, fayeClient, $resource, CONFIG) {
    var Player = $resource(CONFIG.BABITCH_WS_URL + '/players/:playerId', {playerId:'@id'});

    fayeClient.subscribe(CONFIG.BABITCH_LIVE_FAYE_CHANNEL, function(data) {
        $scope.game = data.game;

        data.game.player.forEach(function(position) {
            var player = Player.get({playerId: position.player_id}, function() {
                if (position.position == 'attack' && position.team == 'blue') {
                    $scope.redAttacker = player;
                }
                if (position.position == 'defense' && position.team == 'blue') {
                    $scope.redDefender = player;
                }
                if (position.position == 'attack' && position.team == 'red') {
                    $scope.blueAttacker = player;
                }
                if (position.position == 'defense' && position.team == 'red') {
                    $scope.blueDefender = player;
                }
            });
        });
    });
});
