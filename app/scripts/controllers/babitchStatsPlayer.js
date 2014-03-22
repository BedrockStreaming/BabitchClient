'use strict';

babitchFrontendApp.controller("babitchStatsPlayerCtrl", function($scope, $rootScope, $routeParams, babitchStats) {

    $scope.selectedPlayer = $routeParams.selectedPlayer;
    $scope.menuSelect = 'player';

    //To deal with ng-repeat scope in stats-player.html views
    $rootScope.setPredicate = function(variable) {
        $rootScope.predicate = variable;
    };
    $rootScope.doReverse = function() {
        $rootScope.reverse = !$rootScope.reverse;
    };
    $rootScope.setTableHide = function(variable) {
        $rootScope.tableHide = variable;
        if (!variable) {
            $rootScope.selectedStat = "";
        }
    };

    $scope.stats = babitchStats.getStats();

    $scope.minGamePlayed = 1;
    $rootScope.setTableHide(false);

    $scope.getFilteredStat = function(statType) {
        $rootScope.selectedStat = statType;
        $rootScope.setTableHide(true);
        babitchStats.getStatsTeamsFilterBy(statType, $scope.minGamePlayed, $scope.selectedPlayer);
    };

});
