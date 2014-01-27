'use strict';

angular.module('babitchFrontendApp')
	.factory('babitchService', function babitchService(CONFIG, Restangular) {

		var _playerService = Restangular.all('players');
		var _gameService = Restangular.all('games');

		var playersList = [];
		var statsGoals = [];
		var gamesList = [];

		var statsType = [
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


		return {
			getPlayersRest: function() {
				return _playerService.getList();
			},
			getGamesRest: function() {
				return _gameService.getList();
			},
			getPlayersList: function() {
				return playersList;
			},
			getStatsGoals: function() {
				return statsGoals;
			},
			getGamesList: function() {
				return gamesList;
			},
			getStatsType: function() {
				return statsType;
			},
			computeStats: function() {
				
				//Don't compute stats again
				if (statsGoals.length > 1) {
					return statsGoals;
				}
				
				//Fetch players
				_playerService.getList()
					.then(function(data) {
						data.forEach(function(player) {
							playersList[player.id] = player;

							//Init Stats
							if (!statsGoals[player.id]) {
								statsGoals[player.id] = {
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
				_gameService.getList()
					.then(function(data) {
						angular.copy(data,gamesList);
						//Compute data
						data.forEach(function(games) {

							if (games.red_score == 10) {
								statsGoals[games.composition[0].player_id].victory++;
								statsGoals[games.composition[2].player_id].victory++;
								statsGoals[games.composition[1].player_id].loose++;
								statsGoals[games.composition[3].player_id].loose++;
							} else {
								statsGoals[games.composition[0].player_id].loose++;
								statsGoals[games.composition[2].player_id].loose++;
								statsGoals[games.composition[1].player_id].victory++;
								statsGoals[games.composition[3].player_id].victory++;
							}

							statsGoals[games.composition[0].player_id].gamePlayed++;
							statsGoals[games.composition[2].player_id].gamePlayed++;
							statsGoals[games.composition[1].player_id].gamePlayed++;
							statsGoals[games.composition[3].player_id].gamePlayed++;

							statsGoals[games.composition[0].player_id].teamGoalaverage += games.red_score;
							statsGoals[games.composition[2].player_id].teamGoalaverage += games.red_score;
							statsGoals[games.composition[1].player_id].teamGoalaverage += games.blue_score;
							statsGoals[games.composition[3].player_id].teamGoalaverage += games.blue_score;

							statsGoals[games.composition[0].player_id].teamGoalaverage -= games.blue_score;
							statsGoals[games.composition[2].player_id].teamGoalaverage -= games.blue_score;
							statsGoals[games.composition[1].player_id].teamGoalaverage -= games.red_score;
							statsGoals[games.composition[3].player_id].teamGoalaverage -= games.red_score;

							//Compute Goals
							games.goals.forEach(function(goal) {

								statsGoals[games.composition[0].player_id].ballsPlayed++;
								statsGoals[games.composition[2].player_id].ballsPlayed++;
								statsGoals[games.composition[1].player_id].ballsPlayed++;
								statsGoals[games.composition[3].player_id].ballsPlayed++;

								if (goal.autogoal) {
									statsGoals[goal.player_id].autogoal++;
									if (goal.position == "attack") {
										statsGoals[goal.player_id].autogoalAttack++;
									} else if (goal.position == "defense") {
										statsGoals[goal.player_id].autogoalDefense++;
									}
								} else {
									statsGoals[goal.player_id].goal++;
									if (goal.position == "attack") {
										statsGoals[goal.player_id].goalAttack++;
									} else if (goal.position == "defense") {
										statsGoals[goal.player_id].goalDefense++;
									}
								}
							});
						});
					});
				return statsGoals;
			}
		};

	});