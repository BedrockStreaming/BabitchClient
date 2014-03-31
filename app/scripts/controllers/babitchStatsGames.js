'use strict';

angular.module('babitchFrontendApp').controller('babitchStatsGamesCtrl', function($scope, $rootScope, babitchStats) {

    $scope.menuSelect = 'lastgames';

    babitchStats.computeStats()
        .then(function() {
            $scope.stats = babitchStats.getStats();
        });
});
