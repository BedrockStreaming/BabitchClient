'use strict';

babitchFrontendApp.controller('babitchAdminCtrl', function($scope, Restangular) {
    $scope.players = Restangular.all('players').getList();
});