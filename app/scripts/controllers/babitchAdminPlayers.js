/* global _ */
'use strict';

angular.module('babitchFrontendApp').controller('babitchAdminPlayersCtrl', function($scope, $window, Restangular) {

    Restangular.all('players').getList().then(function(players) {
        $scope.players = players;
    });

    $scope.deletePlayer = function(player) {
        if($window.confirm('Are you sure to delete player "' + player.name +'" ?')) {
            player.remove().then(function() {
                $scope.players = _.without($scope.players, player);
            });
        }
    };

});
