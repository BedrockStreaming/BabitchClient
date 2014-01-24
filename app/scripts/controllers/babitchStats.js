'use strict';

babitchFrontendApp.controller("babitchStatsCtrl", function ($scope, $http, CONFIG) {

	$scope.gamesList = [];
	$scope.playersList = [];

	//Fetch players
	$http({
		url: CONFIG.BABITCH_WS_URL + '/players?per_page=100',
		method: 'GET'
	}).
	success(function(data) {
		data.forEach(function(player) {
			$scope.playersList[player.id] = player;
		});
	});

	$http({
		url: CONFIG.BABITCH_WS_URL + '/games?per_page=100',
		method: 'GET'
	}).
	success(function(data) {
		$scope.gamesList = data;
	});
});
