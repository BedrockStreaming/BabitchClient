'use strict';

babitchFrontendApp.controller('babitchAdminCtrl', function($scope, Restangular) {

    Restangular.all('players').getList().then(function(players) {
        $scope.players = players;
    });

    $scope.deletePlayer = function(id, name) {
        if(confirm('Are you sure to delete player "' + name +'" ?')) {
            Restangular.one('players',id).remove();
            //delete players from scope players
        }
    };

});