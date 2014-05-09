'use strict';

angular.module('babitchFrontendApp').controller('babitchStatsPlayersCtrl', function($scope, $rootScope, babitchStats) {

    $scope.menuSelect = 'playerstats';
    $rootScope.statsVisible = '';

    //To deal with ng-repeat scope in stats-player.html views
    $rootScope.setPredicate = function(variable) {
        $rootScope.predicate = variable;
    };
    $rootScope.doReverse = function() {
        $rootScope.reverse = !$rootScope.reverse;
    };
    $scope.showStats = function() {
        if(!$scope.statsSelector) {
            $rootScope.statsVisible = '';
        }
        else if ($scope.statsSelector.match(/who/g)) {
            $rootScope.statsVisible = $scope.statsSelector;
        }
        else {
            $rootScope.statsVisible = 'statsBars';
            babitchStats.getStatsPlayersFilterBy($scope.statsSelector, $scope.selectedPlayer);
        }
    };

    babitchStats.computeStats()
        .then(function() {
            $scope.stats = babitchStats.getStats();
        });
});
