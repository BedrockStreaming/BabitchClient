'use strict';

angular.module('babitchFrontendApp').controller('babitchStatsPlayerCtrl', function($scope, $rootScope, $stateParams, babitchStats) {

    $scope.selectedPlayer = parseInt($stateParams.selectedPlayer);
    $scope.menuSelect = 'player';

    //To deal with ng-repeat scope in stats-player.html views
    $rootScope.setPredicate = function(variable) {
        $rootScope.predicate = variable;
    };
    $rootScope.doReverse = function() {
        $rootScope.reverse = !$rootScope.reverse;
    };
    $rootScope.setStatsVisibleTo = function(variable) {
        $rootScope.statsVisible = variable;
        if (!variable) {
            $rootScope.selectedStat = "";
        }
    };

    babitchStats.computeStats()
        .then(function() {
            $scope.stats = babitchStats.getStats();
        });

    $scope.getFilteredStat = function(statType) {
        $rootScope.selectedStat = statType;
        $rootScope.setStatsVisibleTo('statsBars');
        babitchStats.getStatsTeamsFilterBy(statType, $scope.selectedPlayer);
    };

});
