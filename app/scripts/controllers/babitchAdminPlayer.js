'use strict';

babitchFrontendApp.controller('babitchAdminPlayerCtrl', function($scope, $routeParams, Restangular) {
    
    if(!$routeParams.id) {
        //New Player
        $scope.newPlayer = true;
    }
    else {
        //Edit Player
        $scope.newPlayer = false;
        Restangular.one('players',$routeParams.id).get().then(function(player) {
            $scope.player = player;
        });
    }

    // function to submit the form after all validation has occurred            
    $scope.submitForm = function() {

        // check to make sure the form is completely valid
        if ($scope.playerForm.$valid) {
            alert('our '+ $scope.newPlayer + ' form is amazing');
        }

    };
});