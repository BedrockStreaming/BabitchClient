'use strict';

babitchFrontendApp.controller("babitchStatsCtrl", function($scope, $rootScope, Restangular) {

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

	$scope.playersList = [];
	$scope.teamList = [];
	$scope.gamesList = [];

	$scope._redTeamId;
	$scope._blueTeamId;

	$scope.statsPlayers = [];
	$scope.statsTeams = [];

	$scope.statsType = [{
			name: 'percentGoalPerBall',
			text: '%Goal',
			addSuffix: '%'
		}, // percent of goal per ball played
		{
			name: 'avgGoalPerGame',
			text: 'Goal/Game'
		}, // avg of goal the player made by game
		{
			name: 'percentVictory',
			text: '%Victory',
			addSuffix: '%'
		}, // percentage of victory
		{
			name: 'percentLoose',
			text: '%Loose',
			addSuffix: '%'
		}, // percentage of loose
		{
			name: 'gamePlayed'
		}, // number of game played
		{
			name: 'teamGoalaverage'
		}, // goal of his team - goal concede
		{
			name: 'ballsPlayed'
		} // total number of balls played
	];

	$scope._setGameComposition = function(game) {
		game.composition.forEach(function(compo) {
			if (compo.team == "red") {
				if (compo.position == "attack") {
					game.redAttack = compo.player_id;
				} else {
					game.redDefense = compo.player_id;
				}
			} else {
				if (compo.position == "attack") {
					game.blueAttack = compo.player_id;
				} else {
					game.blueDefense = compo.player_id;
				}
			}
		});

	};
	
	$scope._setStatsVictoryLoose = function(game) {
		if (game.red_score == 10) {
			$scope.statsPlayers[$scope.statsTeams[$scope._redTeamId].player_id1].victory++;
			$scope.statsPlayers[$scope.statsTeams[$scope._redTeamId].player_id2].victory++;
			$scope.statsPlayers[$scope.statsTeams[$scope._blueTeamId].player_id1].loose++;
			$scope.statsPlayers[$scope.statsTeams[$scope._blueTeamId].player_id2].loose++;

			$scope.statsTeams[$scope._redTeamId].victory++;
			$scope.statsTeams[$scope._blueTeamId].loose++;

			$scope.statsPlayers[$scope.statsTeams[$scope._redTeamId].player_id1].gameSeries.push('V');
			$scope.statsPlayers[$scope.statsTeams[$scope._redTeamId].player_id2].gameSeries.push('V');
			$scope.statsPlayers[$scope.statsTeams[$scope._blueTeamId].player_id1].gameSeries.push('L');
			$scope.statsPlayers[$scope.statsTeams[$scope._blueTeamId].player_id2].gameSeries.push('L');
		} else {
			$scope.statsPlayers[$scope.statsTeams[$scope._redTeamId].player_id1].loose++;
			$scope.statsPlayers[$scope.statsTeams[$scope._redTeamId].player_id2].loose++;
			$scope.statsPlayers[$scope.statsTeams[$scope._blueTeamId].player_id1].victory++;
			$scope.statsPlayers[$scope.statsTeams[$scope._blueTeamId].player_id2].victory++;

			$scope.statsTeams[$scope._redTeamId].loose++;
			$scope.statsTeams[$scope._blueTeamId].victory++;

			$scope.statsPlayers[$scope.statsTeams[$scope._redTeamId].player_id1].gameSeries.push('L');
			$scope.statsPlayers[$scope.statsTeams[$scope._redTeamId].player_id2].gameSeries.push('L');
			$scope.statsPlayers[$scope.statsTeams[$scope._blueTeamId].player_id1].gameSeries.push('V');
			$scope.statsPlayers[$scope.statsTeams[$scope._blueTeamId].player_id2].gameSeries.push('V');
		}
	};
	
	$scope._setStatsPercentVictoryLoose = function(type, id) {
		$scope["stats" + type][id].percentVictory = +($scope["stats" + type][id].victory / $scope["stats" + type][id].gamePlayed * 100).toFixed(1);
		$scope["stats" + type][id].percentLoose = +($scope["stats" + type][id].loose / $scope["stats" + type][id].gamePlayed * 100).toFixed(1);
	};

	$scope._setStatsPercentGoal = function(type, id) {
		$scope["stats" + type][id].percentGoalPerBall = +($scope["stats" + type][id].goal / $scope["stats" + type][id].ballsPlayed * 100).toFixed(1);
		$scope["stats" + type][id].avgGoalPerGame = +($scope["stats" + type][id].goal / ($scope["stats" + type][id].gamePlayed * 10) * 10).toFixed(1);
	};
	
	$scope._setStatsGamePlayed = function(game) {
		game.composition.forEach(function(compo) {
			$scope.statsPlayers[compo.player_id].gamePlayed++;
		});
		$scope.statsTeams[$scope._redTeamId].gamePlayed++;
		$scope.statsTeams[$scope._blueTeamId].gamePlayed++;
	};

	$scope._setStatsTeamGoalaverage = function(game) {
		game.composition.forEach(function(compo) {
			if (compo.team == "red") {
				$scope.statsPlayers[compo.player_id].teamGoalaverage += game.red_score;
				$scope.statsPlayers[compo.player_id].teamGoalaverage -= game.blue_score;

				$scope.statsTeams[$scope._redTeamId].teamGoalaverage += game.red_score;
				$scope.statsTeams[$scope._redTeamId].teamGoalaverage -= game.blue_score;

			} else {
				$scope.statsPlayers[compo.player_id].teamGoalaverage += game.blue_score;
				$scope.statsPlayers[compo.player_id].teamGoalaverage -= game.red_score;

				$scope.statsTeams[$scope._blueTeamId].teamGoalaverage -= game.red_score;
				$scope.statsTeams[$scope._blueTeamId].teamGoalaverage += game.blue_score;
			}
		});
	};

	$scope._setStatsBallsPlayed = function(game) {
		game.composition.forEach(function(compo) {
			$scope.statsPlayers[compo.player_id].ballsPlayed++;
		});
		$scope.statsTeams[$scope._redTeamId].ballsPlayed++;
		$scope.statsTeams[$scope._blueTeamId].ballsPlayed++;
	};

	//Define which team color have goaled
	$scope._setTeamGoal = function(game, goal) {
		switch (goal.player_id) {
			case game.redDefense:
			case game.redAttack:
				goal.team = 'red';
				break;
			case game.blueDefense:
			case game.blueAttack:
				goal.team = 'blue';
				break;
		};
	};

	//Add goal and owngoal for team and players
	$scope._setStatsGoalOwnGoal = function(goal) {

		if (goal.autogoal) {
			if (goal.team == 'red') {
				$scope.statsTeams[$scope._redTeamId].owngoal++;
			} else {
				$scope.statsTeams[$scope._blueTeamId].owngoal++;
			}
			$scope.statsPlayers[goal.player_id].owngoal++;
			if (goal.position == "attack") {
				$scope.statsPlayers[goal.player_id].owngoalAttack++;
			} else if (goal.position == "defense") {
				$scope.statsPlayers[goal.player_id].owngoalDefense++;
			}
		} else {
			if (goal.team == 'red') {
				$scope.statsTeams[$scope._redTeamId].goal++;
			} else {
				$scope.statsTeams[$scope._blueTeamId].goal++;
			}
			$scope.statsPlayers[goal.player_id].goal++;
			if (goal.position == "attack") {
				$scope.statsPlayers[goal.player_id].goalAttack++;
			} else if (goal.position == "defense") {
				$scope.statsPlayers[goal.player_id].goalDefense++;
			}
		}
		$scope.statsPlayers[goal.conceder_id].goalConcede++;

	};
	$scope._initPlayers = function() {
		//Fetch players
		Restangular.all('players').getList()
			.then(function(data) {
				data.forEach(function(player) {
					$scope.playersList[player.id] = player;

					//Init Stats of all numerical values
					if (!$scope.statsPlayers[player.id]) {
						$scope.statsPlayers[player.id] = {
							name: player.name,
							id: player.id,
							goal: 0,
							goalAttack: 0,
							goalDefense: 0,
							owngoal: 0,
							owngoalAttack: 0,
							owngoalDefense: 0,
							victory: 0,
							loose: 0,
							gamePlayed: 0,
							teamGoalaverage: 0,
							ballsPlayed: 0,
							goalConcede: 0,
							gameSeries: []
						};
					}
				});


			});
	};

	$scope._setGamesList = function(games) {
		angular.copy(games, $scope.gamesList);
	};

	//Get/set Team Id based on composition
	$scope._initTeam = function(games) {
		var redTeam = [];
		var blueTeam = [];
		
		//generate unique id for each team of the current game
		games.composition.forEach(function(compo) {
			if (compo.team == 'red') {
				redTeam.push(compo.player_id);
			} else {
				blueTeam.push(compo.player_id);
			}
		});

		redTeam.sort();
		var redTeamString = redTeam.join('-');
		blueTeam.sort()
		var blueTeamString = blueTeam.join('-');

		if (_.indexOf($scope.teamList, redTeamString) < 0) {
			$scope.teamList.push(redTeamString);
		}
		$scope._redTeamId = _.indexOf($scope.teamList, redTeamString);

		if (_.indexOf($scope.teamList, blueTeamString) < 0) {
			$scope.teamList.push(blueTeamString);
		}
		$scope._blueTeamId = _.indexOf($scope.teamList, blueTeamString);

		//Init Red and Blue Team
		if (!$scope.statsTeams[$scope._redTeamId]) {
			$scope.statsTeams[$scope._redTeamId] = {
				id: $scope._redTeamId,
				player_id1: redTeam[0],
				player_id2: redTeam[1],
				victory: 0,
				loose: 0,
				teamGoalaverage: 0,
				ballsPlayed: 0,
				goal: 0,
				owngoal: 0,
				gamePlayed: 0
			};
		}

		if (!$scope.statsTeams[$scope._blueTeamId]) {
			$scope.statsTeams[$scope._blueTeamId] = {
				id: $scope._blueTeamId,
				player_id1: blueTeam[0],
				player_id2: blueTeam[1],
				victory: 0,
				loose: 0,
				teamGoalaverage: 0,
				ballsPlayed: 0,
				goal: 0,
				owngoal: 0,
				gamePlayed: 0
			};
		}
	};

	$scope.computeStats = function() {
		//Don't compute stats again
		if ($scope.statsPlayers.length > 1) {
			return $scope.statsPlayers;
		}

		$scope._initPlayers();

		//Fetch Games
		Restangular.all('games').getList({
			per_page: 100
		})
			.then(function(data) {
				$scope._setGamesList(data);

				//For each games
				$scope.gamesList.forEach(function(games) {
					$scope._setGameComposition(games);

					$scope._initTeam(games);

					$scope._setStatsVictoryLoose(games);
					$scope._setStatsGamePlayed(games);
					$scope._setStatsTeamGoalaverage(games);

					//For each Goals
					games.goals.forEach(function(goal) {
						$scope._setTeamGoal(games, goal);
						$scope._setStatsBallsPlayed(games);
						$scope._setStatsGoalOwnGoal(goal);
					});
				});

				//Compute percentage on each player
				$scope.playersList.forEach(function(player) {
					$scope._setStatsPercentVictoryLoose('Players', player.id);
					$scope._setStatsPercentGoal('Players', player.id);

					//Generate GameSeries
					$scope.statsPlayers[player.id].gameSeries = $scope.statsPlayers[player.id].gameSeries.slice(0,5);
					$scope.statsPlayers[player.id].gameSeries.reverse();
				});

				//Compute percentage on each team
				$scope.statsTeams.forEach(function(team) {
					$scope._setStatsPercentVictoryLoose('Teams', team.id);
					$scope._setStatsPercentGoal('Teams', team.id);
				});

			});

	};

	$scope.computeStats();



});