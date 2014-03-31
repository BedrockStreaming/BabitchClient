/* jshint camelcase: false */
'use strict';

angular.module('babitchFrontendApp').controller('babitchStatsGameCtrl', function($scope, $rootScope, $routeParams, babitchStats) {
    $scope.selectedGame = $routeParams.selectedGame;
    $scope.menuSelect = 'game';

    babitchStats.computeStats()
        .then(function() {
            $scope.stats = babitchStats.getStats();
            $scope.games = babitchStats.getGame($scope.selectedGame);
            $scope.games.duration_mn =  parseInt($scope.games.duration / 60,10) + 'mn' + $scope.games.duration % 60 + 's';
            $scope.games.goals.forEach(function(goal) {
                goal.player_name = $scope.stats.playersList[goal.player_id].name;
                goal.player_email = $scope.stats.playersList[goal.player_id].email;
                goal.conceder_name = $scope.stats.playersList[goal.conceder_id].name;
                goal.conceder_email = $scope.stats.playersList[goal.conceder_id].email;
            });
        });
});
