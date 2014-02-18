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

	$scope.stats = {
		playersList: [],
		teamList: [],
		gamesList: [],
		statsPlayers: [],
		statsTeams: [],
		statsType: [{
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
		]
	}

	$scope._redTeamId;
	$scope._blueTeamId;

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
			$scope.stats.statsPlayers[$scope.stats.statsTeams[$scope._redTeamId].player_id1].victory++;
			$scope.stats.statsPlayers[$scope.stats.statsTeams[$scope._redTeamId].player_id2].victory++;
			$scope.stats.statsPlayers[$scope.stats.statsTeams[$scope._blueTeamId].player_id1].loose++;
			$scope.stats.statsPlayers[$scope.stats.statsTeams[$scope._blueTeamId].player_id2].loose++;

			$scope.stats.statsTeams[$scope._redTeamId].victory++;
			$scope.stats.statsTeams[$scope._blueTeamId].loose++;

			$scope.stats.statsPlayers[$scope.stats.statsTeams[$scope._redTeamId].player_id1].gameSeries.push('W');
			$scope.stats.statsPlayers[$scope.stats.statsTeams[$scope._redTeamId].player_id2].gameSeries.push('W');
			$scope.stats.statsPlayers[$scope.stats.statsTeams[$scope._blueTeamId].player_id1].gameSeries.push('L');
			$scope.stats.statsPlayers[$scope.stats.statsTeams[$scope._blueTeamId].player_id2].gameSeries.push('L');
		} else {
			$scope.stats.statsPlayers[$scope.stats.statsTeams[$scope._redTeamId].player_id1].loose++;
			$scope.stats.statsPlayers[$scope.stats.statsTeams[$scope._redTeamId].player_id2].loose++;
			$scope.stats.statsPlayers[$scope.stats.statsTeams[$scope._blueTeamId].player_id1].victory++;
			$scope.stats.statsPlayers[$scope.stats.statsTeams[$scope._blueTeamId].player_id2].victory++;

			$scope.stats.statsTeams[$scope._redTeamId].loose++;
			$scope.stats.statsTeams[$scope._blueTeamId].victory++;

			$scope.stats.statsPlayers[$scope.stats.statsTeams[$scope._redTeamId].player_id1].gameSeries.push('L');
			$scope.stats.statsPlayers[$scope.stats.statsTeams[$scope._redTeamId].player_id2].gameSeries.push('L');
			$scope.stats.statsPlayers[$scope.stats.statsTeams[$scope._blueTeamId].player_id1].gameSeries.push('W');
			$scope.stats.statsPlayers[$scope.stats.statsTeams[$scope._blueTeamId].player_id2].gameSeries.push('W');
		}
	};
	
	$scope._setStatsPercentVictoryLoose = function(type, id) {
		$scope.stats["stats" + type][id].percentVictory = +($scope.stats["stats" + type][id].victory / $scope.stats["stats" + type][id].gamePlayed * 100).toFixed(1);
		$scope.stats["stats" + type][id].percentLoose = +($scope.stats["stats" + type][id].loose / $scope.stats["stats" + type][id].gamePlayed * 100).toFixed(1);
	};

	$scope._setStatsPercentGoal = function(type, id) {
		$scope.stats["stats" + type][id].percentGoalPerBall = +($scope.stats["stats" + type][id].goal / $scope.stats["stats" + type][id].ballsPlayed * 100).toFixed(1);
		$scope.stats["stats" + type][id].avgGoalPerGame = +($scope.stats["stats" + type][id].goal / ($scope.stats["stats" + type][id].gamePlayed * 10) * 10).toFixed(1);
	};
	
	$scope._setStatsGamePlayed = function(game) {
		game.composition.forEach(function(compo) {
			$scope.stats.statsPlayers[compo.player_id].gamePlayed++;
		});
		$scope.stats.statsTeams[$scope._redTeamId].gamePlayed++;
		$scope.stats.statsTeams[$scope._blueTeamId].gamePlayed++;
	};

	$scope._setStatsTeamGoalaverage = function(game) {
		game.composition.forEach(function(compo) {
			if (compo.team == "red") {
				$scope.stats.statsPlayers[compo.player_id].teamGoalaverage += game.red_score;
				$scope.stats.statsPlayers[compo.player_id].teamGoalaverage -= game.blue_score;
			} else {
				$scope.stats.statsPlayers[compo.player_id].teamGoalaverage += game.blue_score;
				$scope.stats.statsPlayers[compo.player_id].teamGoalaverage -= game.red_score;
			}
		});

		$scope.stats.statsTeams[$scope._redTeamId].teamGoalaverage += game.red_score;
		$scope.stats.statsTeams[$scope._redTeamId].teamGoalaverage -= game.blue_score;
		$scope.stats.statsTeams[$scope._blueTeamId].teamGoalaverage -= game.red_score;
		$scope.stats.statsTeams[$scope._blueTeamId].teamGoalaverage += game.blue_score;
	};

	$scope._setStatsBallsPlayed = function(game) {
		game.composition.forEach(function(compo) {
			$scope.stats.statsPlayers[compo.player_id].ballsPlayed++;
		});
		$scope.stats.statsTeams[$scope._redTeamId].ballsPlayed++;
		$scope.stats.statsTeams[$scope._blueTeamId].ballsPlayed++;
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
				$scope.stats.statsTeams[$scope._redTeamId].owngoal++;
			} else {
				$scope.stats.statsTeams[$scope._blueTeamId].owngoal++;
			}
			$scope.stats.statsPlayers[goal.player_id].owngoal++;
			if (goal.position == "attack") {
				$scope.stats.statsPlayers[goal.player_id].owngoalAttack++;
			} else if (goal.position == "defense") {
				$scope.stats.statsPlayers[goal.player_id].owngoalDefense++;
			}
		} else {
			if (goal.team == 'red') {
				$scope.stats.statsTeams[$scope._redTeamId].goal++;
			} else {
				$scope.stats.statsTeams[$scope._blueTeamId].goal++;
			}
			$scope.stats.statsPlayers[goal.player_id].goal++;
			if (goal.position == "attack") {
				$scope.stats.statsPlayers[goal.player_id].goalAttack++;
			} else if (goal.position == "defense") {
				$scope.stats.statsPlayers[goal.player_id].goalDefense++;
			}
		}
		$scope.stats.statsPlayers[goal.conceder_id].goalConcede++;

	};
	$scope._initPlayers = function() {
		//Fetch players
		Restangular.all('players').getList()
			.then(function(data) {
				data.forEach(function(player) {
					$scope.stats.playersList[player.id] = player;

					//Init Stats of all numerical values
					if (!$scope.stats.statsPlayers[player.id]) {
						$scope.stats.statsPlayers[player.id] = {
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

	$scope._addToGamesList = function(games) {
		//angular.copy(games, $scope.stats.gamesList);
    	$scope.stats.gamesList.push(games);
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

		if (_.indexOf($scope.stats.teamList, redTeamString) < 0) {
			$scope.stats.teamList.push(redTeamString);
		}
		$scope._redTeamId = _.indexOf($scope.stats.teamList, redTeamString);

		if (_.indexOf($scope.stats.teamList, blueTeamString) < 0) {
			$scope.stats.teamList.push(blueTeamString);
		}
		$scope._blueTeamId = _.indexOf($scope.stats.teamList, blueTeamString);

		//Init Red and Blue Team
		if (!$scope.stats.statsTeams[$scope._redTeamId]) {
			$scope.stats.statsTeams[$scope._redTeamId] = {
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

		if (!$scope.stats.statsTeams[$scope._blueTeamId]) {
			$scope.stats.statsTeams[$scope._blueTeamId] = {
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
		$scope._initPlayers();

		//Fetch Games
		Restangular.all('games').getList({
			per_page: 100
		})
			.then(function(data) {

				//For each games
				data.forEach(function(games) {
					$scope._addToGamesList(games);

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
				$scope.stats.playersList.forEach(function(player) {
					$scope._setStatsPercentVictoryLoose('Players', player.id);
					$scope._setStatsPercentGoal('Players', player.id);

					//Generate GameSeries
					$scope.stats.statsPlayers[player.id].gameSeries = $scope.stats.statsPlayers[player.id].gameSeries.slice(0,5);
					$scope.stats.statsPlayers[player.id].gameSeries.reverse();

					if($scope.stats.statsPlayers[player.id].gamePlayed) {
						$scope.stats.statsPlayers[player.id].teamGoalaverage = +($scope.stats.statsPlayers[player.id].teamGoalaverage / $scope.stats.statsPlayers[player.id].gamePlayed).toFixed(1);
					}
				});

				//Compute percentage on each team
				$scope.stats.statsTeams.forEach(function(team) {
					$scope._setStatsPercentVictoryLoose('Teams', team.id);
					$scope._setStatsPercentGoal('Teams', team.id);

					if($scope.stats.statsTeams[team.id].gamePlayed) {
						$scope.stats.statsTeams[team.id].teamGoalaverage = +($scope.stats.statsTeams[team.id].teamGoalaverage / $scope.stats.statsTeams[team.id].gamePlayed).toFixed(1);
					}

				});

			});

	};

	$scope.computeStats();



});