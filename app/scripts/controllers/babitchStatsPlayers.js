'use strict';

babitchFrontendApp.controller("babitchStatsPlayersCtrl", function($scope, $rootScope, babitchStats) {

    $scope.menuSelect = 'playerstats';

    //To deal with ng-repeat scope in stats-player.html views
    $rootScope.setPredicate = function(variable) {
        $rootScope.predicate = variable;
    };
    $rootScope.setReverse = function() {
        $rootScope.reverse = !$rootScope.reverse;
    };

    $scope.stats = babitchStats.getStats();

    $scope.minGamePlayed = 10;

    $scope.getFilteredStat = function(statType) {
         babitchStats.getStatsPlayersFilterBy(statType, $scope.minGamePlayed);
    };

});
