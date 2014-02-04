'use strict';

angular.module('babitchFrontendApp')
	.factory('babitchService', function babitchService(CONFIG, Restangular) {

		var _playerService = Restangular.all('players');
		var _gameService = Restangular.all('games');

		var playersList = [];
		var statsGoals = [];
		var gamesList = [];
		var gamesCompo = [];

		var statsType = [
			{name: 'goal', show: false}, //total goal the player made 
 			{name: 'percentGoalPerBall', show: true, text: '%Goal', addSuffix: '%'}, // percent of goal per ball played
 			{name: 'avgGoalPerGame', show: true, text: 'Goal/Game'}, // avg of goal the player made by game
 			{name: 'goalAttack', show: false}, // total goal the player made in attack position
 			{name: 'goalDefense', show: false}, // total goal the player made in defense position
 			{name: 'owngoal', show: false}, // total owngoal the player made
 			{name: 'owngoalAttack', show: false}, // total owngoal the player made in attack position
 			{name: 'owngoalDefense', show: false}, // total owngoal the player made in defense position
 			{name: 'goalConcede', show: false}, // total goal the player concede being in defense
 			{name: 'victory', show: false}, // total victory
 			{name: 'percentVictory', show: true, text: '%Victory', addSuffix: '%'}, // percentage of victory
 			{name: 'loose', show: false}, // total loose
 			{name: 'percentLoose', show: true, text: '%Loose', addSuffix: '%'}, // percentage of loose
 			{name: 'gamePlayed', show: true}, // number of game played
 			{name: 'teamGoalaverage', show: true}, // goal of his team - goal concede
 			{name: 'ballsPlayed', show: true} // total number of balls played
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
			_setGameComposition: function(game) {
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

			},
			_setStatsVictoryLoose: function(game) {
				game.composition.forEach(function(compo) {
					if (compo.team == "red") {
						if (game.red_score == 10) {
							statsGoals[compo.player_id].victory++;
						} else {
							statsGoals[compo.player_id].loose++;
						}
					} else {
						if (game.blue_score == 10) {
							statsGoals[compo.player_id].victory++;
						} else {
							statsGoals[compo.player_id].loose++;
						}
					}
				});
			},
			_setStatsPercentVictoryLoose: function(player) {
				statsGoals[player.id].percentVictory = Math.round(statsGoals[player.id].victory / statsGoals[player.id].gamePlayed * 100);
				statsGoals[player.id].percentLoose = Math.round(statsGoals[player.id].loose / statsGoals[player.id].gamePlayed * 100)
			},
			_setStatsPercentGoal: function(player) {
				statsGoals[player.id].percentGoalPerBall = Math.round(statsGoals[player.id].goal / statsGoals[player.id].ballsPlayed * 100);
				statsGoals[player.id].avgGoalPerGame = Math.round(statsGoals[player.id].goal / (statsGoals[player.id].gamePlayed * 10) * 10);
			},
			_setStatsGamePlayed: function(game) {
				statsGoals[game.composition[0].player_id].gamePlayed++;
				statsGoals[game.composition[2].player_id].gamePlayed++;
				statsGoals[game.composition[1].player_id].gamePlayed++;
				statsGoals[game.composition[3].player_id].gamePlayed++;
			},
			_setStatsTeamGoalaverage: function(game) {
				game.composition.forEach(function(compo) {
					if (compo.team == "red") {
						statsGoals[compo.player_id].teamGoalaverage += game.red_score;
						statsGoals[compo.player_id].teamGoalaverage -= game.blue_score;
					} else {
						statsGoals[compo.player_id].teamGoalaverage += game.blue_score;
						statsGoals[compo.player_id].teamGoalaverage -= game.red_score;
					}
				});
			},
			_setStatsBallsPlayed: function(game) {
				statsGoals[game.composition[0].player_id].ballsPlayed++;
				statsGoals[game.composition[2].player_id].ballsPlayed++;
				statsGoals[game.composition[1].player_id].ballsPlayed++;
				statsGoals[game.composition[3].player_id].ballsPlayed++;
			},
			_setStatsGoalOwnGoal: function(goal) {
				if (goal.autogoal) {
					statsGoals[goal.player_id].owngoal++;
					if (goal.position == "attack") {
						statsGoals[goal.player_id].owngoalAttack++;
					} else if (goal.position == "defense") {
						statsGoals[goal.player_id].owngoalDefense++;
					}
				} else {
					statsGoals[goal.player_id].goal++;
					if (goal.position == "attack") {
						statsGoals[goal.player_id].goalAttack++;
					} else if (goal.position == "defense") {
						statsGoals[goal.player_id].goalDefense++;
					}
				}
				statsGoals[goal.conceder_id].goalConcede++;

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
									goalConcede: 0
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

						gamesList.forEach(function(game) {
							_this._setGameComposition(game);
						});

						//For each games
						data.forEach(function(games) {
							_this._setStatsVictoryLoose(games);
							_this._setStatsGamePlayed(games);
							_this._setStatsTeamGoalaverage(games);

							//For each Goals
							games.goals.forEach(function(goal) {
								_this._setStatsBallsPlayed(games);
								_this._setStatsGoalOwnGoal(goal);
							});
						});

						playersList.forEach(function(player) {
							_this._setStatsPercentVictoryLoose(player);
							_this._setStatsPercentGoal(player);
						});
					});
			}
		};

	});