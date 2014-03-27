'use strict';

babitchFrontendApp.controller("babitchStatsGamesCtrl", function($scope, $rootScope, babitchStats) {

    $scope.menuSelect = 'lastgames';

    babitchStats.computeStats()
        .then(function(data) {
            $scope.stats = babitchStats.getStats();
        });
});
