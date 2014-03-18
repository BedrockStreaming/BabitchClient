'use strict';

babitchFrontendApp.controller("babitchStatsPlayerCtrl", function($scope, $rootScope, $routeParams, babitchStats) {

    $scope.selectedPlayer = $routeParams.selectedPlayer;
    $scope.menuSelect = 'player';

    //To deal with ng-repeat scope in stats-player.html views
    $rootScope.setPredicate = function(variable) {
        $rootScope.predicate = variable;
    };
    $rootScope.setReverse = function() {
        $rootScope.reverse = !$rootScope.reverse;
    };

    $scope.stats = babitchStats.getStats();
});