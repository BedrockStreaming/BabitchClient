'use strict';

babitchFrontendApp.controller('babitchAdminCtrl', function($scope, Restangular) {

        Restangular.all('players').getList().then(function(players) {
            $scope.players = players;
        });

});