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
			_setStatsVictoryLoose: function(game) {
				if (game.red_score == 10) {
					statsGoals[game.composition[0].player_id].victory++;
					statsGoals[game.composition[2].player_id].victory++;
					statsGoals[game.composition[1].player_id].loose++;
					statsGoals[game.composition[3].player_id].loose++;
				} else {
					statsGoals[game.composition[0].player_id].loose++;
					statsGoals[game.composition[2].player_id].loose++;
					statsGoals[game.composition[1].player_id].victory++;
					statsGoals[game.composition[3].player_id].victory++;
				}

			},
			_setStatsGamePlayed: function(game) {
				statsGoals[game.composition[0].player_id].gamePlayed++;
				statsGoals[game.composition[2].player_id].gamePlayed++;
				statsGoals[game.composition[1].player_id].gamePlayed++;
				statsGoals[game.composition[3].player_id].gamePlayed++;
			},
			_setStatsTeamGoalaverage: function(game) {
				statsGoals[game.composition[0].player_id].teamGoalaverage += game.red_score;
				statsGoals[game.composition[2].player_id].teamGoalaverage += game.red_score;
				statsGoals[game.composition[1].player_id].teamGoalaverage += game.blue_score;
				statsGoals[game.composition[3].player_id].teamGoalaverage += game.blue_score;

				statsGoals[game.composition[0].player_id].teamGoalaverage -= game.blue_score;
				statsGoals[game.composition[2].player_id].teamGoalaverage -= game.blue_score;
				statsGoals[game.composition[1].player_id].teamGoalaverage -= game.red_score;
				statsGoals[game.composition[3].player_id].teamGoalaverage -= game.red_score;
			},
			_setStatsBallsPlayed: function(game) {
				statsGoals[game.composition[0].player_id].ballsPlayed++;
				statsGoals[game.composition[2].player_id].ballsPlayed++;
				statsGoals[game.composition[1].player_id].ballsPlayed++;
				statsGoals[game.composition[3].player_id].ballsPlayed++;
			},
			_setStatsAutogoal: function(goal) {
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
			},
			_setPlayersList: function() {
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
			},
			_setGamesList: function(games) {
				angular.copy(games, gamesList);
			},
			computeStats: function() {

				//Don't compute stats again
				if (statsGoals.length > 1) {
					return statsGoals;
				}

				var _this = this;

				_this._setPlayersList();

				//Fetch Games
				_gameService.getList()
					.then(function(data) {
						_this._setGamesList(data);

						//For each games
						data.forEach(function(games) {
							_this._setStatsVictoryLoose(games);
							_this._setStatsGamePlayed(games);
							_this._setStatsTeamGoalaverage(games);

							//For each Goals
							games.goals.forEach(function(goal) {
								_this._setStatsBallsPlayed(games);
								_this._setStatsAutogoal(goal);
							});
						});
					});
				return statsGoals;
			}
		};

	});