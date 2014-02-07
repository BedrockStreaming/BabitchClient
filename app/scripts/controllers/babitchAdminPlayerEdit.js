'use strict';

babitchFrontendApp.controller('babitchAdminPlayerEditCtrl', function($scope, Restangular, player, $location) {
    
    $scope.player = Restangular.copy(player);

    // function to submit the form after all validation has occurred            
    $scope.submitForm = function() {

        // check to make sure the form is completely valid
        if ($scope.playerForm.$valid) {
            $scope.player.put().then(function() {
                $location.path('/admin');
            });
        }
    };
});