'use strict';

babitchFrontendApp.controller("babitchStatsTeamsCtrl", function($scope, $rootScope, babitchStats) {

    $scope.menuSelect = 'teamstats';

    //To deal with ng-repeat scope in stats-player.html views
    $rootScope.setPredicate = function(variable) {
        $rootScope.predicate = variable;
    };
    $rootScope.setReverse = function() {
        $rootScope.reverse = !$rootScope.reverse;
    };

    $scope.stats = babitchStats.getStats();

    $scope.minGamePlayed = 5;

    $scope.getFilteredStat = function(statType) {
         babitchStats.getStatsTeamsFilterBy(statType, $scope.minGamePlayed);
    };

});
