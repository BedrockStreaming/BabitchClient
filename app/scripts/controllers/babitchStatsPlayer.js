'use strict';

babitchFrontendApp.controller("babitchStatsPlayerCtrl", function($scope, $rootScope, $routeParams, babitchService) {

	$scope.gamesList = [];
	$scope.playersList = [];
	$scope.statsGoals = [];

	$scope.selectPlayerId = $routeParams.playerId;

	babitchService.computeStats();
	$scope.statsGoals = babitchService.getStatsGoals();
	$scope.gamesList = babitchService.getGamesList();
	$scope.playersList = babitchService.getPlayersList();
	$scope.statsType = babitchService.getStatsType();

});