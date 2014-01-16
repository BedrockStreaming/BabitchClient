'use strict';

babitchFrontendApp.controller("babitchLiveCtrl", function ($scope, fayeClient, $resource, CONFIG) {
    var Player = $resource(CONFIG.BABITCH_WS_URL + '/players/:playerId', {playerId:'@id'});

    fayeClient.publish(CONFIG.BABITCH_LIVE_FAYE_CHANNEL, {type: 'requestCurrentGame'});

    fayeClient.subscribe(CONFIG.BABITCH_LIVE_FAYE_CHANNEL, function(data) {
        if (data.type == 'requestCurrentGame') {
            return;
        }

        console.log(data.type, data.game);

        $scope.game = data.game;

        data.game.player.forEach(function(position) {
            var player = Player.get({playerId: position.player_id}, function() {
                if (position.position == 'attack' && position.team == 'red') {
                    $scope.redAttacker = player;
                }
                if (position.position == 'defense' && position.team == 'red') {
                    $scope.redDefender = player;
                }
                if (position.position == 'attack' && position.team == 'blue') {
                    $scope.blueAttacker = player;
                }
                if (position.position == 'defense' && position.team == 'blue') {
                    $scope.blueDefender = player;
                }
            });
        });
    });
});
