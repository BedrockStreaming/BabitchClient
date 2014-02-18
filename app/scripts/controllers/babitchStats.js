'use strict';

babitchFrontendApp.controller("babitchStatsCtrl", function($scope, $rootScope, babitchStats) {

	$scope.selectedPlayer = 0;
	$scope.menuSelect = '';

	//To deal with ng-repeat scope in stats-player.html views
	$rootScope.setPredicate = function(variable) {
		$rootScope.predicate = variable;
	};
	$rootScope.setReverse = function() {
		$rootScope.reverse = !$rootScope.reverse;
	};

	$scope.selectPlayer = function(playerId) {
		$scope.selectedPlayer = playerId;
		$scope.menuSelect = 'player';
	};

	$scope.stats = babitchStats.computeStats();
});