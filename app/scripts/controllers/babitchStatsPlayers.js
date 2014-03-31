'use strict';

angular.module('babitchFrontendApp').controller('babitchStatsPlayersCtrl', function($scope, $rootScope, babitchStats) {

    $scope.menuSelect = 'playerstats';

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
        babitchStats.getStatsPlayersFilterBy(statType);
    };

});
