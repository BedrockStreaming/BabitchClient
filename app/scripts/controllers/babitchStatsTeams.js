'use strict';

babitchFrontendApp.controller("babitchStatsTeamsCtrl", function($scope, $rootScope, babitchStats) {

    $scope.menuSelect = 'teamstats';

    //To deal with ng-repeat scope in stats-player.html views
    $rootScope.setPredicate = function(variable) {
        $rootScope.predicate = variable;
    };
    $rootScope.doReverse = function() {
        $rootScope.reverse = !$rootScope.reverse;
    };
    $rootScope.setTableHide = function(variable) {
        $rootScope.tableHide = variable;
    };

    $scope.stats = babitchStats.getStats();

    $scope.minGamePlayed = 5;
    $rootScope.setTableHide(false);

    $scope.getFilteredStat = function(statType) {
        $rootScope.setTableHide(true);
         babitchStats.getStatsTeamsFilterBy(statType, $scope.minGamePlayed, false);
    };

});
