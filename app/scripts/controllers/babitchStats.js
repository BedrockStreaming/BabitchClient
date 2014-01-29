'use strict';

babitchFrontendApp.controller("babitchStatsCtrl", function($scope, $rootScope, babitchService) {

	$scope.gamesList = [];
	$scope.playersList = [];
	$scope.statsGoals = [];

	//To deal with ng-repeat scope in stats-player.html views
	$rootScope.setPredicate = function(variable) {
		$rootScope.predicate = variable;
	};
	$rootScope.setReverse = function() {
		$rootScope.reverse = !$rootScope.reverse;
	};

	babitchService.computeStats();
	$scope.statsGoals = babitchService.getStatsGoals();
	$scope.gamesList = babitchService.getGamesList();
	$scope.playersList = babitchService.getPlayersList();
	$scope.statsType = babitchService.getStatsType();

});