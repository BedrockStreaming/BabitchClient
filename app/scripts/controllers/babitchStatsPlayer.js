'use strict';

babitchFrontendApp.controller("babitchStatsPlayerCtrl", function ($scope, $rootScope, $http, CONFIG, $routeParams) {

	$scope.gamesList = [];
	$scope.playersList = [];

	$scope.statsGoals = [];

	$scope.selectPlayerId = $routeParams.playerId;

	$scope.statsType = [
		'goal',
		'goalAttack',
		'goalDefense',
		'autogoal',
		'autogoalAttack',
		'autogoalDefense',
		'victory',
		'loose',
		'gamePlayed',
		'teamGoalaverage',
		'ballsPlayed'
		];
	
	//To deal with ng-repeat scope in stats-player.html views
	$rootScope.setPredicate = function(variable) {
		$rootScope.predicate = variable;
	};
	$rootScope.setReverse = function() {
		$rootScope.reverse =! $rootScope.reverse;
	};
	
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
					name: player.name,
					goal: 0,
					goalAttack: 0,
					goalDefense: 0,
					autogoal: 0,
					autogoalAttack: 0,
					autogoalDefense: 0,
					victory: 0,
					loose: 0,
					gamePlayed: 0,
					teamGoalaverage: 0,
					ballsPlayed: 0
				};
			}
		});
	});

	//Fetch Games
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

				$scope.statsGoals[games.composition[0].player_id].ballsPlayed ++;
				$scope.statsGoals[games.composition[2].player_id].ballsPlayed ++;
				$scope.statsGoals[games.composition[1].player_id].ballsPlayed ++;
				$scope.statsGoals[games.composition[3].player_id].ballsPlayed ++;

				var statsGoaler = $scope.statsGoals[goal.player_id];
	
				if( goal.autogoal ) {
					statsGoaler.autogoal ++;
					if (goal.position == "attack") {
						statsGoaler.autogoalAttack ++;
					}
					else if (goal.position == "defense") {
						statsGoaler.autogoalDefense ++;
					}
				}
				else {
					statsGoaler.goal ++;
					if (goal.position == "attack") {
						statsGoaler.goalAttack ++;
					}
					else if (goal.position == "defense") {
						statsGoaler.goalDefense ++;
					}
				}
			});
		});
	});
});
