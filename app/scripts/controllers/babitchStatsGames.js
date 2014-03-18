'use strict';

babitchFrontendApp.controller("babitchStatsGamesCtrl", function($scope, $rootScope, babitchStats) {

    $scope.menuSelect = 'lastgames';

    $scope.stats = babitchStats.getStats();
});