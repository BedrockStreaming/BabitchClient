'use strict';

babitchFrontendApp.controller("babitchStatsPlayerCtrl", function ($scope, $http, CONFIG, $routeParams) {

	$scope.gamesList = [];
	$scope.playersList = [];

	$scope.statsGoals = [];

	$scope.selectPlayerId = $routeParams.playerId;
	
	//Fetch players
	$http({
		url: CONFIG.BABITCH_WS_URL + '/players?per_page=100',
		method: 'GET'
	}).
	success(function(data) {
		data.forEach(function(player) {
			$scope.playersList[player.id] = player;
			
			//Init Stats
			if( ! $scope.statsGoals[player.id] ) {
				$scope.statsGoals[player.id] = { 
					goal: 0,
					autogoal: 0,
					goalAttack: 0,
					goalDefense: 0,
					victory: 0,
					loose: 0,
					gamePlayed: 0,
					teamGoalaverage: 0
				};
			}
		});
	});

	$http({
		url: CONFIG.BABITCH_WS_URL + '/games?per_page=100',
		method: 'GET'
	}).
	success(function(data) {
		$scope.gamesList = data;

		//Compute data
		data.forEach(function(games) {

			if(games.red_score == 10) {
				$scope.statsGoals[games.composition[0].player_id].victory ++;
				$scope.statsGoals[games.composition[2].player_id].victory ++;
				$scope.statsGoals[games.composition[1].player_id].loose ++;
				$scope.statsGoals[games.composition[3].player_id].loose ++;
			}
			else {
				$scope.statsGoals[games.composition[0].player_id].loose ++;
				$scope.statsGoals[games.composition[2].player_id].loose ++;
				$scope.statsGoals[games.composition[1].player_id].victory ++;
				$scope.statsGoals[games.composition[3].player_id].victory ++;
			}
			
			$scope.statsGoals[games.composition[0].player_id].gamePlayed ++;
			$scope.statsGoals[games.composition[2].player_id].gamePlayed ++;
			$scope.statsGoals[games.composition[1].player_id].gamePlayed ++;
			$scope.statsGoals[games.composition[3].player_id].gamePlayed ++;

			$scope.statsGoals[games.composition[0].player_id].teamGoalaverage += games.red_score;
			$scope.statsGoals[games.composition[2].player_id].teamGoalaverage += games.red_score;
			$scope.statsGoals[games.composition[1].player_id].teamGoalaverage += games.blue_score;
			$scope.statsGoals[games.composition[3].player_id].teamGoalaverage += games.blue_score;

			$scope.statsGoals[games.composition[0].player_id].teamGoalaverage -= games.blue_score;
			$scope.statsGoals[games.composition[2].player_id].teamGoalaverage -= games.blue_score;
			$scope.statsGoals[games.composition[1].player_id].teamGoalaverage -= games.red_score;
			$scope.statsGoals[games.composition[3].player_id].teamGoalaverage -= games.red_score;


			//Compute Goals
			games.goals.forEach(function(goal) {

				var stats = $scope.statsGoals[goal.player_id];
				if( goal.autogoal ) {
					stats.autogoal ++;
				}
				else {
					stats.goal ++;
					if (goal.position == "attack") {
						stats.goalAttack ++;
					}
					else if (goal.position == "defense") {
						stats.goalDefense ++;
					}
				}
			});
		});
	});
});
