'use strict';

babitchFrontendApp.controller("babitchCtrl", function ($scope, $http, CONFIG) {       

    $scope.gameStarted = false;
    $scope.playersList = [];

    // Model Game object ready to be sent to the API
    var game = {
        team: [
            { color: 'red', score: 0},
            { color: 'blue', score: 0}
        ],
        player: [
            { team: 'red', position: 'defense' },
            { team: 'blue', position: 'attack' },
            { team: 'red', position: 'attack' },
            { team: 'blue', position: 'defense' },
        ],
        goals: []
    };

    $scope.initGame = function () {
        $scope.gameStarted = false;
        $scope.game        = angular.copy(game);
        $scope.loadPlayer();
    };

    $scope.getPlayerBySeat = function (team, position) {
        var found;
        $scope.game.player.forEach(function(player) {
            if (player.team === team && player.position === position) {
                found = player;
            }
        });
        return found;
    };

    $scope.loadPlayer = function () {
        $http({
            url: CONFIG.BABITCH_WS_URL + '/players',
            method: 'GET'
        }).
        success(function(data) {
            $scope.playersList = data;
        });
    };

    $scope.startGame = function () {
        var valid = true;
        var playerAlreadySelect = [];

        $scope.game.player.forEach(function (player) {
            if (player.player_id == null || playerAlreadySelect.indexOf(player.player_id) > -1) {
                valid = false;
            }
            
            playerAlreadySelect.push(player.player_id);
        });

        if (valid) {
            $scope.gameStarted = true;
        }

    };

    $scope.coach = function (team) {
        var attack  = $scope.getPlayerBySeat(team, 'attack');
        var defense = $scope.getPlayerBySeat(team, 'defense');

        var tmpId = attack.player_id;
        attack.player_id = defense.player_id;
        defense.player_id = tmpId;
    };

    $scope.goal = function (player) {
        if ($scope.gameStarted) {
            $scope.game.goals.push({
                position: player.position,
                player_id: player.player_id,
                conceder_id: $scope.getPlayerBySeat(player.team === 'red' ? 'blue' : 'red', 'defense').player_id,
                autogoal: false
            });
            $scope.addGoalForTeam(player.team);
        }
    };

    $scope.addGoalForTeam = function (teamColor) {
        $scope.game.team.forEach(function (team) {
            if (team.color === teamColor) {
                team.score ++;
                return;
            }
        });
    };

    $scope.removeGoalForTeam = function (teamColor) {
        $scope.game.team.forEach(function (team) {
            if (team.color === teamColor) {
                team.score --;
                return;
            }
        });
    };    

    $scope.autogoal = function (player) {
        if ($scope.gameStarted) {
            $scope.game.goals.push({
                position: player.position,
                player_id: player.player_id,
                conceder_id: $scope.getPlayerBySeat(player.team, 'defense').player_id,
                autogoal: true
            });
            if ($scope.getPlayerBySeat(player.team, 'defense').team == 'red') {
                $scope.addGoalForTeam('blue');
            } else {
                $scope.addGoalForTeam('red');
            }
        }
    };

    $scope.cancelGoal = function () {
        var lastGoal = $scope.game.goals.pop();
        var conceder = $scope.game.player.filter(function (p) {return p.player_id == lastGoal.conceder_id})[0];
        if (conceder.team == 'red') {
            $scope.removeGoalForTeam('blue');
        } else {
            $scope.removeGoalForTeam('red');
        }
    };

    $scope.cancelGame = function () {
        $scope.gameStarted = false;
    };

    $scope.saveGame = function () {
        $http({
            url: CONFIG.BABITCH_WS_URL + '/games',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: $scope.game
        }).
        success(function(data, status) {
            $scope.initGame();
        }).
        error(function (data, status) {
            if (status == 0) {
                setTimeout(function () {$scope.saveGame();}, 1000);
            }
        });
    };

    $scope.reverseTable = function() {
        $scope.game.player.reverse();
        $scope.game.team.reverse();
    };

    $scope.$watch('game.team[0].score', function() {
        if ($scope.game.team[0].score == 10) {
            $scope.saveGame();
        }
     });

     $scope.$watch('game.team[1].score', function() {
        if ($scope.game.team[1].score == 10) {
            $scope.saveGame();
        }
     });

     // Init Game
     $scope.initGame();
    })
  ;
