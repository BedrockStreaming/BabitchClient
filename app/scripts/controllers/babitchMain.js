'use strict';

babitchFrontendApp.controller('BabitchMainCtrl', function ($scope, CONFIG, fayeClient, $interval, Restangular, BabitchMatch) {
    $scope.focusedSeat = null;
    $scope.focusedSide = null;
    $scope.playerListShawn = false;
    $scope.goalTypeShawn = false;
    $scope.playersList = [];
    $scope.duration = 0; // seconds

    var match = BabitchMatch().server();

    $scope.match = match;
    $scope.table = match.table;

    // Set positions
    $scope.table.sides[0].position = 'left';
    $scope.table.sides[0].seats[0].position = 'bottom';
    $scope.table.sides[0].seats[1].position = 'top';
    $scope.table.sides[1].position = 'right';
    $scope.table.sides[1].seats[0].position = 'top';
    $scope.table.sides[1].seats[1].position = 'bottom';


    var init = function () {
        loadPlayers();
    };

    var loadPlayers = function () {
        Restangular.all('players').getList().then(function(data) {
            $scope.playersList = data;
        });
    };

    var resetGame = function () {
        $scope.gameStarted = false;
        $scope.gameEnded = false;

        resetPlayers();
        resetScore();
    };

    var resetPlayers = function () {
        match.resetPlayers();

        for (var i in $scope.playersList) {
            $scope.playersList[i].alreadySelected = false;
        }
    };

    var resetScore = function () {
        match.resetScore();
    };

    // Timer
    var timer = null;

    var startTimer = function () {
        if (timer) {
            return;
        }

        timer = $interval(function() {
            $scope.duration = match.getDuration();
        }, 500);
    };

    $scope.focusSeat = function (seat, side) {
        if($scope.focusedSeat) {
            $scope.resetFocus();
            return;
        }

        $scope.focusedSeat = seat;
        $scope.focusedSeat.focused = true;
        $scope.focusedSide = side;

        if(match.infos.started) {
            $scope.showGoalTypeSelector();
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

    $scope.showGoalTypeSelector = function () {
        $scope.goalTypeShawn = true;
    };

    $scope.choosePlayer = function (player) {
        match.selectPlayer($scope.focusedSide.name, $scope.focusedSeat.name, player.id);
        player.alreadySelected = true;
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
        if(match.infos.nbPlayers != 4) {
            console.log("Error, not enough player selected : need 4");
            return;
        }

        match.start();
    };

    /**
     * Make a goal
     *
     * @return void
     */
    $scope.goal = function () {
        if ($scope.focusedSeat && $scope.focusedSide) {
            match.goal($scope.focusedSeat.player.id);
            $scope.resetFocus();
        }
    };

    /**
     * Make an autogoal
     *
     * @return void
     */
    $scope.autogoal = function () {
        if ($scope.focusedSeat && $scope.focusedSide) {
            match.owngoal($scope.focusedSeat.player.id);
            $scope.resetFocus();
        }
    };

    /**
     * Coach two players for a side
     *
     * @param  {Object} side Side with players to coach
     *
     * @return {void}
     */
    $scope.coach = function (side) {
        match.coach(side.name);
    };

    /**
     * Cancel last goal
     *
     * @return {void}
     */
    $scope.cancelGoal = function () {
        match.cancelLastGoal();
    };

    /**
     * Cancel game
     *
     * @return {void}
     */
    $scope.cancelGame = function () {
    };

    /**
     * End the game
     *
     * @return {void}
     */
    var endGame = function () {
    };

    $scope.restartGame = function () {
    }

    $scope.startNewGame = function() {
    };

    $scope.$watch('match.infos.started', function(started) {
        if(started) {
            startTimer();
        }
    });

    $scope.$watch('match.infos.ended', function(ended) {
        if(!ended && match.infos.started) {
            startTimer();
        }
    });

    init();
});
