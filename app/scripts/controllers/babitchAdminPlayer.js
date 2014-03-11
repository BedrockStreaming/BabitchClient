'use strict';

babitchFrontendApp.controller('babitchAdminPlayerCtrl', function($scope, Restangular, $location) {

    // function to submit the form after all validation has occurred
    $scope.submitForm = function() {

        // check to make sure the form is completely valid
        if ($scope.playerForm.$valid) {
            Restangular.all('players').post($scope.player).then(function() {
                $location.path('/admin/players');
            });
            return true;
        }
        else {
            return false;
        }
    };
});
