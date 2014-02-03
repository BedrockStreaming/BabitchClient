'use strict';

babitchFrontendApp.controller("babitchCtrl", function ($scope, $http, CONFIG, fayeClient, $interval) {
    $scope.gameId = null;
    $scope.gameStarted = false;
    $scope.gameEnded = false;
    $scope.focusedSeat = null;
    $scope.focusedSide = null;
    $scope.playerListShawn = false;
    $scope.goalTypeShawn = false;
    $scope.playersList = [];
    $scope.nbPlayers = 0;
    $scope.duration = 0; // seconds

    var goals = [];

    $scope.table = {
        sides: [{
            name: 'red',
            position: 'left',
            score: 0,
            seats: [{
                position: 'bottom',
                place: 'attack',
                focused: false,
                player: null
            }, {
                position: 'top',
                place: 'defense',
                focused: false,
                player: null
            }]
        }, {
            name: 'blue',
            position: 'right',
            score: 0,
            seats: [{
                position: 'top',
                place: 'attack',
                focused: false,
                player: null
            }, {
                position: 'bottom',
                place: 'defense',
                focused: false,
                player: null
            }]
        }]
    };

    $scope.table.sides[0].oppositeSide = $scope.table.sides[1];
    $scope.table.sides[1].oppositeSide = $scope.table.sides[0];


    fayeClient.subscribe(CONFIG.BABITCH_LIVE_FAYE_CHANNEL, function(data) {
        if (data.type == 'requestCurrentGame') {
            notify('currentGame');
        }
    });


    var init = function () {
        loadPlayers();
    };

    var resetGame = function () {
        $scope.gameStarted = false;
        $scope.gameEnded = false;

        resetPlayers();
        resetScore();
    };

    var resetPlayers = function () {
        $scope.table.sides[0].seats[0].player = null;
        $scope.table.sides[0].seats[1].player = null;
        $scope.table.sides[1].seats[0].player = null;
        $scope.table.sides[1].seats[1].player = null;

        $scope.nbPlayers = 0;
    };

    var resetScore = function () {
        $scope.table.sides[0].score = 0;
        $scope.table.sides[1].score = 0;
    }

    // Timer
    var startTime = null;


    var timer = null;
    var startTimer = function () {
        if (timer) {
            return;
        }

        timer = $interval(function() {
            if($scope.gameStarted && !$scope.gameEnded) {
                var now = new Date();
                var diff = now-startTime;
                $scope.duration = Math.floor(diff/1000);
            }
        }, 500);
    };

    var loadPlayers = function () {
        $http({
            url: CONFIG.BABITCH_WS_URL + '/players',
            method: 'GET'
        }).
        success(function(data) {
            $scope.playersList = data;
        });
    };


    $scope.focusSeat = function (seat, side) {
        if($scope.focusedSeat) {
            $scope.resetFocus();
            return;
        }

        $scope.focusedSeat = seat;
        $scope.focusedSeat.focused = true;
        $scope.focusedSide = side;

        if($scope.gameStarted) {
            $scope.goalTypeShawn = true;
        } else {
            $scope.showPlayerSelector();
        }
    };

    $scope.resetFocus = function () {
        if($scope.focusedSeat) {
            $scope.focusedSeat.focused = false;
            $scope.focusedSeat = null;
        }

        $scope.focusedSide = null;
        $scope.playerListShawn = false;
        $scope.goalTypeShawn = false;
    };

    $scope.showPlayerSelector = function () {
        $scope.playerListShawn = true;
    };

    $scope.choosePlayer = function (player) {
        if($scope.focusedSeat.player == null) {
            $scope.nbPlayers++;
        }

        if($scope.focusedSeat.player) {
            $scope.focusedSeat.player.alreadySelected = false;
        }

        $scope.focusedSeat.player = player;
        $scope.focusedSeat.player.alreadySelected = true;
        $scope.resetFocus();
    };

    $scope.switchSidesOnView = function () {

        $scope.table.sides.forEach(function (side) {

            side.position = (side.position == 'left' ? 'right' : 'left');

            side.seats[0].position = (side.seats[0].position == 'top' ? 'bottom' : 'top');
            side.seats[1].position = (side.seats[1].position == 'top' ? 'bottom' : 'top');
        });
    }

    $scope.startGame = function () {
        if($scope.nbPlayers != 4) {
            console.log("Error, not enough player selected : need 4");
            return;
        }

        startTime = new Date();

        resetScore();

        $scope.gameId = Date.now();
        $scope.gameStarted = true;
        $scope.gameEnded = false;
        goals = [];

        notify('start');
    };

    /**
     * Make a goal
     *
     * @return void
     */
    $scope.goal = function () {
        if ($scope.gameStarted && $scope.focusedSeat && $scope.focusedSide) {

            goals.push({
                position:       $scope.focusedSeat.place,
                player_id:      $scope.focusedSeat.player.id,
                conceder_id:    $scope.focusedSide.oppositeSide.seats[1].player.id,
                autogoal:       false
            });

            $scope.focusedSide.score++;
            $scope.resetFocus();

            notify('goal');
            checkScore();
        }
    };

    /**
     * Make an autogoal
     *
     * @return void
     */
    $scope.autogoal = function () {
        if ($scope.gameStarted && $scope.focusedSeat && $scope.focusedSide) {

            goals.push({
                position:       $scope.focusedSeat.place,
                player_id:      $scope.focusedSeat.player.id,
                conceder_id:    $scope.focusedSide.seats[1].player.id,
                autogoal:       true
            });

            $scope.focusedSide.oppositeSide.score++;
            $scope.resetFocus();

            notify('autogoal');
            checkScore();
        }
    };

    var checkScore = function () {
        if ($scope.table.sides[0].score == 10 || $scope.table.sides[1].score == 10) {
            endGame();
        }
    }

    /**
     * Coach two players for a side
     *
     * @param  {Object} side Side with players to coach
     *
     * @return {void}
     */
    $scope.coach = function (side) {
        var tmp = side.seats[0].player;
        side.seats[0].player = side.seats[1].player;
        side.seats[1].player = tmp;

        notify('coach');
    };

    /**
     * Cancel last goal
     *
     * @return {void}
     */
    $scope.cancelGoal = function () {
        $scope.gameEnded = false;

        var lastGoal = goals.pop();

        // For each side's table
        $scope.table.sides.forEach(function (side) {

            // For each seat's side
            side.seats.forEach(function (seat) {

                if(seat.player.id != lastGoal.player_id) {
                    return;
                }

                if(lastGoal.autogoal) {
                    side.oppositeSide.score--;
                } else {
                    side.score--;
                }
            });
        });

        notify('cancel');
    };

    /**
     * Cancel game
     *
     * @return {void}
     */
    $scope.cancelGame = function () {
        $scope.gameStarted = false;
    };

    /**
     * End the game
     *
     * @return {void}
     */
    var endGame = function () {
        notify('end');

        $scope.gameEnded = true;
        saveGame();
    };

    $scope.restartGame = function () {
        $scope.gameStarted = false;
        $scope.startGame();
        notify('restart');
    }

    $scope.startNewGame = function() {
        resetGame();
        notify('new');
    };

    $scope.getGameData = function () {
        var table = $scope.table;

        var game = {
            red_score: table.sides[0].score,
            blue_score: table.sides[1].score,
            player: [
                { team: 'red',  position: 'attack',  player_id: table.sides[0].seats[0].player.id },
                { team: 'red',  position: 'defense', player_id: table.sides[0].seats[1].player.id },
                { team: 'blue', position: 'attack',  player_id: table.sides[1].seats[0].player.id },
                { team: 'blue', position: 'defense', player_id: table.sides[1].seats[1].player.id },
            ],
            goals: goals
        };

        return game;
    };

    var saveGame = function () {
        $http({
            url: CONFIG.BABITCH_WS_URL + '/games',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: $scope.getGameData()
        }).
        error(function (data, status) {
            if (status == 0) {
                setTimeout(function () {
                    $scope.saveGame();
                }, 1000);
            }
        });
    };

    /**
     * Send an event notification to faye channel
     *
     * @param  {string} eventName Event's name
     *
     * @return {void}
     */
    var notify = function (eventName) {
        if (!$scope.gameEnded) {
            fayeClient.publish(CONFIG.BABITCH_LIVE_FAYE_CHANNEL, {
                type:   eventName,
                gameId: $scope.gameId,
                game:   $scope.getGameData()
            });
        }
    };

    $scope.$watch('gameStarted', function(started) {
        if(started) {
            startTimer();
        }
    });

    $scope.$watch('gameEnded', function(ended) {
        if(!ended && $scope.gameStarted) {
            startTimer();
        }
    });

    init();
});
