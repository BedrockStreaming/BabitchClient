'use strict';

angular.module('babitchFrontendApp').controller('babitchStatsTeamsCtrl', function($scope, $rootScope, babitchStats) {

    $scope.menuSelect = 'teamstats';
    $rootScope.statsVisible = '';

    //To deal with ng-repeat scope in stats-player.html views
    $rootScope.setPredicate = function(variable) {
        $rootScope.predicate = variable;
    };
    $rootScope.doReverse = function() {
        $rootScope.reverse = !$rootScope.reverse;
    };

    $scope.showStats = function() {
        $scope.statsSelector = this.statsSelector; //because when in ng-include, it create a new scope
        if(!$scope.statsSelector) {
            $rootScope.statsVisible = '';
        }
        else {
            $rootScope.statsVisible = 'statsBars';
            babitchStats.getStatsTeamsFilterBy($scope.statsSelector, ($scope.selectedPlayer ? $scope.selectedPlayer : false));
        }
    };

    babitchStats.computeStats()
        .then(function() {
            $scope.stats = babitchStats.getStats();
        });
});
