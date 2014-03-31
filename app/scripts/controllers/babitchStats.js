'use strict';

angular.module('babitchFrontendApp').controller('babitchStatsCtrl', function($scope, $rootScope, babitchStats) {

    $scope.menuSelect = '';

    //To deal with ng-repeat scope in stats-player.html views
    $rootScope.setPredicate = function(variable) {
        $rootScope.predicate = variable;
    };
    $rootScope.doReverse = function() {
        $rootScope.reverse = !$rootScope.reverse;
    };

    babitchStats.computeStats()
        .then(function() {
            $scope.stats = babitchStats.getStats();
        });
});
