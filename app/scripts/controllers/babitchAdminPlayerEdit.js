'use strict';

babitchFrontendApp.controller('babitchAdminPlayerEditCtrl', function($scope, Restangular, $routeParams, $location) {

    $scope.player = {
        id: 0
    };

    Restangular.one('players', $routeParams.id).get().then(function(data) {
        $scope.player = data;
    });

    // function to submit the form after all validation has occurred            
    $scope.submitForm = function() {

        // check to make sure the form is completely valid
        if ($scope.playerForm.$valid) {
            $scope.player.put().then(function() {
                $location.path('/admin');
            });
            return true;
        } else {
            return false;
        }
    };
});