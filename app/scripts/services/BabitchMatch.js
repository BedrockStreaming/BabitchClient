'use strict';

angular.module('babitchFrontendApp')
    .factory('BabitchMatch', function (CONFIG, $rootScope, fayeClient, Restangular) {

        var fayeChannel = CONFIG.BABITCH_LIVE_FAYE_CHANNEL;

        return function () {

            var infos = {
                nbPlayers: 0,
                started: false,
                ended: false,
                startedAt: null,
                endedAt: null,
            }

            var goals = [];

            var table = {
                sides: [{
                    name: 'red',
                    score: 0,
                    seats: [{
                        name: 'attack',
                        player: null
                    }, {
                        name: 'defense',
                        player: null
                    }]
                }, {
                    name: 'blue',
                    score: 0,
                    seats: [{
                        name: 'attack',
                        player: null
                    }, {
                        name: 'defense',
                        player: null
                    }]
                }]
            };

            var apply = function () {
                if(!$rootScope.$$phase) {
                    $rootScope.$apply();
                }
            };

            var getSideByName = function (name) {
                var sideIndex = (name == 'red' ? 0 : 1);
                return table.sides[sideIndex];
            };

            var getSeatByName = function (name, sideName) {
                var seatIndex = (name == 'attack' ? 0 : 1);
                return getSideByName(sideName).seats[seatIndex];
            };

            var getSideAndSeatByPlayerId = function (playerId) {
                for (var i in [0,1]) {
                    var side = table.sides[i];

                    for (var j in [0,1]) {
                        if(side.seats[j].player && side.seats[j].player.id == playerId) {
                            return {
                                side: side,
                                seat: side.seats[j]
                            };
                        }
                    }
                }

                return null;
            };

            var getSideByPlayerId = function (playerId) {
                var sideAndSeat = getSideAndSeatByPlayerId(playerId);

                if (null !== sideAndSeat) {
                    return sideAndSeat.side;
                }

                return null;
            };

            var getSeatByPlayerId = function (playerId) {
                var sideAndSeat = getSideAndSeatByPlayerId(playerId);

                if (null !== sideAndSeat) {
                    return sideAndSeat.seat;
                }

                return null;
            };

            var getOppositeSide = function (side) {
                return table.sides[side.name == 'red' ? 1 : 0];
            };

            var reset = function () {
                resetScore();
                resetPlayers();
            };

            var resetScore = function () {
                table.sides[0].score = 0;
                table.sides[1].score = 0;
            };

            var resetPlayers = function () {
                table.sides[0].seats[0].player = null;
                table.sides[0].seats[1].player = null;
                table.sides[0].seats[0].player = null;
                table.sides[0].seats[1].player = null;

                infos.nbPlayers = 0;
            };

            var selectPlayer = function (sideName, seatName, playerId) {
                return Restangular.one('players', playerId).get()
                    .then(function (player) {
                        var seat = getSeatByName(seatName, sideName)

                        if (seat.player === null) {
                            infos.nbPlayers++;
                        }

                        seat.player = player;
                    });
            };

            var resetPlayer = function (sideName, seatName) {
                var seat = getSeatByName(seatName, sideName);

                if (seat.player !== null) {
                    seat.player = null;
                    infos.nbPlayers--;
                }
            };

            var goal = function (playerId) {
                var sideAndSeat = getSideAndSeatByPlayerId(playerId);

                if(null !== sideAndSeat) {
                    sideAndSeat.side.score++;

                    goals.push({
                        position:       sideAndSeat.seat.name,
                        player_id:      sideAndSeat.seat.player.id,
                        conceder_id:    getOppositeSide(sideAndSeat.side).seats[1].player.id,
                        autogoal:       false
                    });
                }

                checkScore();
            };

            var owngoal = function (playerId) {
                var sideAndSeat = getSideAndSeatByPlayerId(playerId);

                if(null !== sideAndSeat) {
                    getOppositeSide(sideAndSeat.side).score++;

                    goals.push({
                        position:       sideAndSeat.seat.name,
                        player_id:      sideAndSeat.seat.player.id,
                        conceder_id:    sideAndSeat.side.seats[1].player.id,
                        autogoal:       true
                    });
                }

                checkScore();
            };

            var checkScore = function () {
                if (table.sides[0].score == 10 || table.sides[1].score == 10) {
                    infos.ended = true;
                }
            };

            var coach = function (sideName) {
                var side = getSideByName(sideName);
                var tmp = side.seats[0].player;
                side.seats[0].player = side.seats[1].player;
                side.seats[1].player = tmp;
            };

            var cancelLastGoal = function () {
                infos.ended = false;

                var lastGoal = goals.pop();
                var sideAndSeat = getSideAndSeatByPlayerId(lastGoal.player_id);

                if(lastGoal.autogoal) {
                    getOppositeSide(sideAndSeat.side).score--;
                } else {
                    sideAndSeat.side.score--;
                }
            };

            var getSerializableTable = function () {
                var tableSerializable = {};
                angular.copy(table, tableSerializable);

                for (var i in [0,1]) {
                    var side = tableSerializable.sides[i];

                    for (var j in [0,1]) {
                        var seat = side.seats[j];

                        if(seat.player) {
                            seat.player = seat.player.id;
                        }
                    }
                }

                return tableSerializable;
            };

            var start = function () {
                if (infos.started) {
                    return;
                }

                infos.startedAt = new Date();
                infos.started = true;
            };

            var notify = function (eventName, data) {
                data = data || {};
                data.table = getSerializableTable();

                fayeClient.publish(fayeChannel, {
                    type: eventName,
                    data: data
                });
            };

            // var getGameData = function () {
            //     var table = $scope.table;

            //     var game = {
            //         red_score: table.sides[0].score,
            //         blue_score: table.sides[1].score,
            //         player: [
            //             { team: 'red',  position: 'attack',  player_id: table.sides[0].seats[0].player.id },
            //             { team: 'red',  position: 'defense', player_id: table.sides[0].seats[1].player.id },
            //             { team: 'blue', position: 'attack',  player_id: table.sides[1].seats[0].player.id },
            //             { team: 'blue', position: 'defense', player_id: table.sides[1].seats[1].player.id },
            //         ],
            //         goals: goals
            //     };

            //     return game;
            // };


            // var saveGame = function () {
            //     Restangular.all("games").post($scope.getGameData()).then(function() {
            //         //Game Saved
            //     }, function() {
            //         setTimeout(function () {
            //             saveGame();
            //         }, 1000);
            //     });
            // };

            return {

                client: function () {
                    var self = this;
                    var events = {};

                    // Faye events
                    fayeClient.subscribe(fayeChannel, function(send) {

                        send.data.table.sides.forEach(function (side) {
                            getSideByName(side.name).score = side.score;

                            side.seats.forEach(function (seat) {
                                selectPlayer(side.name, seat.name, seat.player);
                            });
                        });

                        delete send.data.table;

                        if (typeof events[send.type] !== 'undefined') {
                            events[send.type].call(self, send.data);
                        }

                    });

                    // Request for the current table
                    fayeClient.publish(fayeChannel, { type: 'table' });

                    return {
                        table: table,

                        on: function (eventName, callback) {
                            events[eventName] = callback;
                        }
                    };
                },

                server: function () {

                    // Faye events
                    fayeClient.subscribe(fayeChannel, function (send) {

                        // Send the current table
                        if (send.type === 'table') {
                            notify('table');
                        }
                    });

                    return {
                        table: table,
                        infos: infos,
                        goals: goals,

                        selectPlayer: function (side, seat, playerId) {
                            selectPlayer(side, seat, playerId).then(function () {
                                notify('selectPlayer', {
                                    side     : side, 
                                    seat     : seat, 
                                    playerId : playerId
                                });
                            });
                        },
                        goal: function (playerId) {
                            goal(playerId);

                            notify('goal', {
                                playerId: playerId
                            });
                        },
                        owngoal: function (playerId) {
                            owngoal(playerId);

                            notify('owngoal', {
                                playerId: playerId
                            });
                        },
                        coach: function (side) {
                            coach(side);

                            notify('coach', {
                                side: side
                            });
                        },
                        reset: function () {
                            reset();

                            notify('reset');
                        },
                        resetScore: function () {
                            resetScore();

                            notify('resetScore');
                        },
                        resetPlayer: function (sideName, seatName) {
                            resetPlayer(sideName, seatName);

                            notify('resetPlayer', {
                                side: sideName,
                                seat: seatName
                            });
                        },
                        resetPlayers: function () {
                            resetPlayers();

                            notify('resetPlayers');
                        },
                        start: function () {
                            start();

                            notify('start');
                        },
                        isStarted: function () {
                            return infos.started;
                        },
                        isEnded: function () {
                            return infos.ended;
                        },
                        getDuration: function () {
                            if (!infos.started) {
                                return 0;
                            }

                            var endedAt = new Date();

                            if (infos.ended) {
                                endedAt = infos.endedAt;
                            }

                            var now = new Date();
                            var diff = endedAt-infos.startedAt;
                            return Math.floor(diff/1000);
                        },
                        cancelLastGoal: function () {
                            cancelLastGoal();
                            
                            notify('cancle');
                        }
                    };
                }
            }
        };

    });