'use strict';

angular.module('babitchFrontendApp')
    .service('babitchStats', function babitchStats(Restangular, $q) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        var stats = {
            playersList: [],
            teamList: [],
            gamesList: [],
            statsPlayers: [],
            statsPlayersFiltered: [],
            statsTeams: [],
            statsTeamsFiltered: [],
            statsType: [{
                    name: 'eloRanking'
                }, //Elo Ranking
                {
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
        };

        var _redTeamId;
        var _blueTeamId;

        var _setGameComposition = function(game) {
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

        var _setStatsVictoryLoose = function(game) {
            if (game.red_score == 10) {
                stats.statsPlayers[game.redAttack].victory++;
                stats.statsPlayers[game.redDefense].victory++;
                stats.statsPlayers[game.blueAttack].loose++;
                stats.statsPlayers[game.blueDefense].loose++;

                stats.statsTeams[_redTeamId].victory++;
                stats.statsTeams[_blueTeamId].loose++;

                stats.statsPlayers[game.redAttack].gameSeries.push('W');
                stats.statsPlayers[game.redDefense].gameSeries.push('W');
                stats.statsPlayers[game.blueAttack].gameSeries.push('L');
                stats.statsPlayers[game.blueDefense].gameSeries.push('L');
            } else {
                stats.statsPlayers[game.redAttack].loose++;
                stats.statsPlayers[game.redDefense].loose++;
                stats.statsPlayers[game.blueAttack].victory++;
                stats.statsPlayers[game.blueDefense].victory++;

                stats.statsTeams[_redTeamId].loose++;
                stats.statsTeams[_blueTeamId].victory++;

                stats.statsPlayers[game.redAttack].gameSeries.push('L');
                stats.statsPlayers[game.redDefense].gameSeries.push('L');
                stats.statsPlayers[game.blueAttack].gameSeries.push('W');
                stats.statsPlayers[game.blueDefense].gameSeries.push('W');
            }
        };

        var _setStatsPercentVictoryLoose = function(type, id) {
            if(stats["stats" + type][id].gamePlayed) {
                stats["stats" + type][id].percentVictory = +(stats["stats" + type][id].victory / stats["stats" + type][id].gamePlayed * 100).toFixed(1);
                stats["stats" + type][id].percentLoose = +(stats["stats" + type][id].loose / stats["stats" + type][id].gamePlayed * 100).toFixed(1);
            }
        };

        var _setStatsEloRanking = function(game) {
            var redWins, blueWins;
            if(game.red_score === 10) {
                redWins = 1;
                blueWins = 0;
            }
            else {
                redWins = 0;
                blueWins = 1;
            }

            stats.statsTeams[_redTeamId].eloRanking = (stats.statsPlayers[game.redAttack].eloRanking + stats.statsPlayers[game.redDefense].eloRanking) / 2;
            stats.statsTeams[_blueTeamId].eloRanking = (stats.statsPlayers[game.blueAttack].eloRanking + stats.statsPlayers[game.blueDefense].eloRanking) / 2;

            //Diff in ranking between blue and redteam
            var redDiff = (stats.statsTeams[_blueTeamId].eloRanking - stats.statsTeams[_redTeamId].eloRanking);

            //Calculate Red and Blue Win Expectancy
            var RedWe = +(1 / ( Math.pow(10, ( redDiff / 1000)) + 1 )).toFixed(2);
            var BlueWe = +(1 - RedWe).toFixed(2);

            var KFactor = 50;

            var redNewEloRanking = stats.statsTeams[_redTeamId].eloRanking + (KFactor * ( redWins - RedWe));
            var redRanking = +(redNewEloRanking - stats.statsTeams[_redTeamId].eloRanking).toFixed(0);
            stats.statsTeams[_redTeamId].eloRanking = redNewEloRanking;

            stats.statsPlayers[game.redAttack].eloRanking += redRanking;
            stats.statsPlayers[game.redDefense].eloRanking += redRanking;

            var blueNewEloRanking = stats.statsTeams[_blueTeamId].eloRanking + (KFactor * ( blueWins - BlueWe));
            var blueRanking = +(blueNewEloRanking - stats.statsTeams[_blueTeamId].eloRanking).toFixed(0);
            stats.statsTeams[_blueTeamId].eloRanking = blueNewEloRanking;

            stats.statsPlayers[game.blueAttack].eloRanking += blueRanking;
            stats.statsPlayers[game.blueDefense].eloRanking += blueRanking;

        };

        var _setStatsPercentGoal = function(type, id) {
            if(stats["stats" + type][id].ballsPlayed) {
                stats["stats" + type][id].percentGoalPerBall = +(stats["stats" + type][id].goal / stats["stats" + type][id].ballsPlayed * 100).toFixed(1);
            }
            if(stats["stats" + type][id].gamePlayed) {
                stats["stats" + type][id].avgGoalPerGame = +(stats["stats" + type][id].goal / (stats["stats" + type][id].gamePlayed * 10) * 10).toFixed(1);
            }
        };

        var _setStatsGamePlayed = function(game) {
            stats.statsPlayers[game.redAttack].gamePlayed++;
            stats.statsPlayers[game.redDefense].gamePlayed++;
            stats.statsPlayers[game.blueAttack].gamePlayed++;
            stats.statsPlayers[game.blueDefense].gamePlayed++;

            stats.statsTeams[_redTeamId].gamePlayed++;
            stats.statsTeams[_blueTeamId].gamePlayed++;
        };

        var _setStatsTeamGoalaverage = function(game) {
            stats.statsPlayers[game.redAttack].teamGoalaverage += game.red_score;
            stats.statsPlayers[game.redAttack].teamGoalaverage -= game.blue_score;
            stats.statsPlayers[game.redDefense].teamGoalaverage += game.red_score;
            stats.statsPlayers[game.redDefense].teamGoalaverage -= game.blue_score;

            stats.statsPlayers[game.blueAttack].teamGoalaverage += game.blue_score;
            stats.statsPlayers[game.blueAttack].teamGoalaverage -= game.red_score;
            stats.statsPlayers[game.blueDefense].teamGoalaverage += game.blue_score;
            stats.statsPlayers[game.blueDefense].teamGoalaverage -= game.red_score;

            stats.statsTeams[_redTeamId].teamGoalaverage += game.red_score;
            stats.statsTeams[_redTeamId].teamGoalaverage -= game.blue_score;
            stats.statsTeams[_blueTeamId].teamGoalaverage -= game.red_score;
            stats.statsTeams[_blueTeamId].teamGoalaverage += game.blue_score;
        };

        var _setStatsBallsPlayed = function(game) {
            stats.statsPlayers[game.redAttack].ballsPlayed++;
            stats.statsPlayers[game.redDefense].ballsPlayed++;
            stats.statsPlayers[game.blueAttack].ballsPlayed++;
            stats.statsPlayers[game.blueDefense].ballsPlayed++;

            stats.statsTeams[_redTeamId].ballsPlayed++;
            stats.statsTeams[_blueTeamId].ballsPlayed++;
        };

        //Define which team color have goaled
        var _setTeamGoal = function(game, goal) {
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
        var _setStatsGoalOwnGoal = function(goal) {
            if (goal.autogoal) {
                if (goal.team == 'red') {
                    stats.statsTeams[_redTeamId].owngoal++;
                } else {
                    stats.statsTeams[_blueTeamId].owngoal++;
                }
                stats.statsPlayers[goal.player_id].owngoal++;
                if (goal.position == "attack") {
                    stats.statsPlayers[goal.player_id].owngoalAttack++;
                } else if (goal.position == "defense") {
                    stats.statsPlayers[goal.player_id].owngoalDefense++;
                }
            } else {
                if (goal.team == 'red') {
                    stats.statsTeams[_redTeamId].goal++;
                } else {
                    stats.statsTeams[_blueTeamId].goal++;
                }
                stats.statsPlayers[goal.player_id].goal++;
                if (goal.position == "attack") {
                    stats.statsPlayers[goal.player_id].goalAttack++;
                } else if (goal.position == "defense") {
                    stats.statsPlayers[goal.player_id].goalDefense++;
                }
            }
            stats.statsPlayers[goal.conceder_id].goalConcede++;

        };
        var _initPlayers = function() {
            //Fetch players
            Restangular.all('players').getList()
                .then(function(data) {
                    var i = 0;
                    data.forEach(function(player) {
                        stats.playersList[player.id] = player;

                        //Init Stats of all numerical values
                        if (!stats.statsPlayers[player.id]) {
                            stats.statsPlayers[player.id] = {
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
                                eloRanking : 1500,
                                gameSeries: [],
                                percentGoalPerBall: 0,
                                avgGoalPerGame: 0,
                                percentVictory: 0,
                                percentLoose: 0
                            };
                        }
                    });


                });
        };

        var _addToGamesList = function(games) {
            //angular.copy(games, stats.gamesList);
            stats.gamesList.push(games);
        };

        //Get/set Team Id based on composition
        var _initTeam = function(games) {
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

            if (_.indexOf(stats.teamList, redTeamString) < 0) {
                stats.teamList.push(redTeamString);
            }
            _redTeamId = _.indexOf(stats.teamList, redTeamString);

            if (_.indexOf(stats.teamList, blueTeamString) < 0) {
                stats.teamList.push(blueTeamString);
            }
            _blueTeamId = _.indexOf(stats.teamList, blueTeamString);

            //Init Red and Blue Team
            if (!stats.statsTeams[_redTeamId]) {
                stats.statsTeams[_redTeamId] = {
                    id: _redTeamId,
                    player_id1: redTeam[0],
                    player_id2: redTeam[1],
                    email1: stats.playersList[redTeam[0]].email,
                    email2: stats.playersList[redTeam[1]].email,
                    victory: 0,
                    loose: 0,
                    teamGoalaverage: 0,
                    ballsPlayed: 0,
                    goal: 0,
                    owngoal: 0,
                    gamePlayed: 0
                };
            }

            if (!stats.statsTeams[_blueTeamId]) {
                stats.statsTeams[_blueTeamId] = {
                    id: _blueTeamId,
                    player_id1: blueTeam[0],
                    player_id2: blueTeam[1],
                    email1: stats.playersList[blueTeam[0]].email,
                    email2: stats.playersList[blueTeam[1]].email,
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

        this.getStats = function() {
            return stats;
        };

        this.getStatsPlayersFilterBy = function(statType, minGamePlayed) {
            var oneOrderedStat = [];
            stats.statsPlayers.forEach(function(data) {
                if(data.gamePlayed >= minGamePlayed) {
                    oneOrderedStat.push({
                        name: stats.playersList[data.id].name,
                        id: data.id,
                        email: stats.playersList[data.id].email,
                        stat: data[statType]
                    });
                }
            });
            stats.statsPlayersFiltered = oneOrderedStat.sort(this.dynamicSort("-stat"));
            return stats.statsPlayersFiltered;
        };

        this.getStatsTeamsFilterBy = function(statType, minGamePlayed, withPlayer) {
            var oneOrderedStat = [];
            stats.statsTeams.forEach(function(data) {
                if(data.gamePlayed >= minGamePlayed) {
                    if(!withPlayer || withPlayer == data.player_id1 || withPlayer == data.player_id2) {
                        oneOrderedStat.push({
                            name1: stats.playersList[data.player_id1].name,
                            name2: stats.playersList[data.player_id2].name,
                            id1: data.player_id1,
                            id2: data.player_id2,
                            email1: stats.playersList[data.player_id1].email,
                            email2: stats.playersList[data.player_id2].email,
                            stat: data[statType]
                        });
                    }
                }
            });
            stats.statsTeamsFiltered = oneOrderedStat.sort(this.dynamicSort("-stat"));
            return stats.statsTeamsFiltered;
        };

        this.dynamicSort = function (property) {
            var sortOrder = 1;
            if(property[0] === "-") {
                sortOrder = -1;
                property = property.substr(1);
            }
            return function (a,b) {
                var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                return result * sortOrder;
            }
        };

        this.computeStats = function() {
            _initPlayers();

            var gamePagination = {
                getAllPage: function(maxPage) {
                    var deferred = $q.defer();

                    var page = 1;
                    this._getNextPageOrReturn(null, page, maxPage, deferred);

                    return deferred.promise;
                },
                _getNextPageOrReturn: function(data, page, maxPage, deferred) {
                    if (!data) {
                        page = 1;
                        data = [];
                    }

                    var _this = this;
                    Restangular.all('games').getList({
                        page: page,
                        per_page: 100
                    }).then(function(newData) {
                        data = data.concat(newData);

                        if (newData.length < 100 || page == maxPage) {

                            return deferred.resolve(data);
                        }

                        _this._getNextPageOrReturn(data, ++page, maxPage, deferred);
                    });
                }
            };

            var _this = this;
            //Fetch Games
            gamePagination.getAllPage(3)
                .then(function(data) {
                    //Reverse data :
                    data.reverse();

                    //For each games
                    data.forEach(function(games) {
                        _addToGamesList(games);

                        _setGameComposition(games);

                        _initTeam(games);

                        _setStatsVictoryLoose(games);
                        _setStatsGamePlayed(games);
                        _setStatsTeamGoalaverage(games);
                        _setStatsEloRanking(games);

                        //For each Goals
                        games.goals.forEach(function(goal) {
                            _setTeamGoal(games, goal);
                            _setStatsBallsPlayed(games);
                            _setStatsGoalOwnGoal(goal);
                        });
                    });

                    //Compute percentage on each player
                    stats.playersList.forEach(function(player) {
                        _setStatsPercentVictoryLoose('Players', player.id);
                        _setStatsPercentGoal('Players', player.id);

                        //Generate GameSeries
                        stats.statsPlayers[player.id].gameSeries = stats.statsPlayers[player.id].gameSeries.slice(0, 5);
                        stats.statsPlayers[player.id].gameSeries.reverse();

                        if (stats.statsPlayers[player.id].gamePlayed) {
                            stats.statsPlayers[player.id].teamGoalaverage = +(stats.statsPlayers[player.id].teamGoalaverage / stats.statsPlayers[player.id].gamePlayed).toFixed(1);
                        }
                    });

                    //Compute percentage on each team
                    stats.statsTeams.forEach(function(team) {
                        _setStatsPercentVictoryLoose('Teams', team.id);
                        _setStatsPercentGoal('Teams', team.id);

                        if (stats.statsTeams[team.id].gamePlayed) {
                            stats.statsTeams[team.id].teamGoalaverage = +(stats.statsTeams[team.id].teamGoalaverage / stats.statsTeams[team.id].gamePlayed).toFixed(1);
                        }

                        //Round Team Elo Ranking
                        stats.statsTeams[team.id].eloRanking = +(stats.statsTeams[team.id].eloRanking).toFixed(0);

                    });

                    //Reverse order of gameslist
                    stats.gamesList.reverse();

                });

            return stats;
        };

        this.computeStats();
    });
