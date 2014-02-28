'use strict';

angular.module('babitchFrontendApp')
    .factory('BabitchTable', function (CONFIG, $rootScope, fayeClient, Restangular) {

        var fayeChannel = CONFIG.BABITCH_LIVE_FAYE_CHANNEL;

        return function() {

            var table = {
                startedAt: null,
                endedAt: null,

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

            var getSideByPlayerId = function (playerId) {
                for (var i in [0,1]) {
                    var side = table.sides[i];

                    for (var j in [0,1]) {
                        if(side.seats[j].player && side.seats[j].player.id == playerId) {
                            return side;
                        }
                    }
                }

                return null;
            };

            var selectPlayer = function (sideName, seatName, playerId) {
                return Restangular.one('players', playerId).get()
                    .then(function (player) {
                        getSeatByName(seatName, sideName).player = player;
                    });
            };

            var goal = function (playerId) {
                var side = getSideByPlayerId(playerId);

                if(null !== side) {
                    side.score++;
                }
            };

            var owngoal = function (playerId) {
                var side = getSideByPlayerId(playerId);

                if(null !== side) {
                    side = getSideByName(side.name == 'red' ? 'blue' : 'red');
                    side.score++;
                }
            };

            var coach = function (sideName) {
                var side = getSideByName(sideName);
                var tmp = side.seats[0].player;
                side.seats[0].player = side.seats[1].player;
                side.seats[1].player = tmp;
            }

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
            }

            var notify = function (eventName, data) {
                data.table = getSerializableTable();

                fayeClient.publish(fayeChannel, {
                    type: eventName,
                    data: data
                });
            };

            return {

                client: function () {
                    var self = this;
                    var events = {};

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

                    return {
                        table: table,

                        on: function (eventName, callback) {
                            events[eventName] = callback;
                        }
                    };
                },

                server: function () {
                    return {
                        table: table,

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
                        }
                    };
                }
            }
        };

    });