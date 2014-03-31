'use strict';

angular.module('babitchFrontendApp').controller('babitchStatsPlayerCtrl', function($scope, $rootScope, $routeParams, babitchStats) {

    $scope.selectedPlayer = $routeParams.selectedPlayer;
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
    };

    babitchStats.computeStats()
        .then(function() {
            $scope.stats = babitchStats.getStats();
        });

    $scope.getFilteredStat = function(statType) {
        $rootScope.setStatsVisibleTo('statsBars');
        babitchStats.getStatsTeamsFilterBy(statType, $scope.selectedPlayer);
    };

});
