describe('Controller: BabitchCtrl', function() {

    // load the controller's module
    beforeEach(module('babitchFrontendApp'));

    var theBabitchCtrl,
        scope,
        httpMock;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope, $httpBackend, CONFIG) {
        scope = $rootScope.$new();
        httpMock = $httpBackend;
        config = CONFIG;

        var JsonPlayer = [{
            "id": 1,
            "name": "Benjamin",
            "email": ""
        }, {
            "id": 2,
            "name": "Marc",
            "email": ""
        }, {
            "id": 3,
            "name": "Remi",
            "email": ""
        }, {
            "id": 4,
            "name": "Nicolas",
            "email": ""
        }, {
            "id": 5,
            "name": "Florent",
            "email": ""
        }, {
            "id": 6,
            "name": "Kenny",
            "email": ""
        }];

        httpMock.whenGET(config.BABITCH_WS_URL + "/players").respond(JsonPlayer);

        theBabitchCtrl = $controller('babitchCtrl', {
            $scope: scope
        });

        //Flush the .query
        httpMock.flush();

    }));

    afterEach(function() {
        httpMock.verifyNoOutstandingExpectation();
        httpMock.verifyNoOutstandingRequest();
    });


    var helper = {
        choosePlayer: function (playerId, team, place) {
            var playerIndex = playerId-1;
            var sideIndex = (team == 'red' ? 0 : 1);
            var seatIndex = (place == 'attack' ? 0 : 1);

            var side = scope.table.sides[sideIndex];
            var seat = side.seats[seatIndex];
            var player = scope.playersList[playerIndex];

            scope.focusSeat(seat, side);
            scope.choosePlayer(player);
        },

        chooseAllPlayers: function () {
            helper.choosePlayer(1, 'red', 'attack');
            helper.choosePlayer(2, 'red', 'defense');
            helper.choosePlayer(3, 'blue', 'attack');
            helper.choosePlayer(4, 'blue', 'defense');
        },

        focusPlayer: function(team, place) {
            var sideIndex = (team == 'red' ? 0 : 1);
            var seatIndex = (place == 'attack' ? 0 : 1);

            var side = scope.table.sides[sideIndex];
            var seat = side.seats[seatIndex];

            scope.focusSeat(seat, side);
        },

        playerScoreAnyGoals: function(team, place, howMuch) {
            howMuch = howMuch || 1;

            for(var i = 0; i < howMuch; i++) {
                helper.focusPlayer(team, place);
                scope.goal();
            }
        },

        playerScoreAnyAutogoals: function(team, place, howMuch) {
            howMuch = howMuch || 1;

            for(var i = 0; i < howMuch; i++) {
                helper.focusPlayer(team, place);
                scope.autogoal();
            }
        },

        getRedScore: function () {
            return scope.table.sides[0].score;
        },

        getBlueScore: function () {
            return scope.table.sides[1].score;
        }
    }

    it('should begin with a game not started yet', function() {
        expect(scope.gameStarted).toBe(false);
    });

    it('should fetch the player list', function() {
        expect(scope.playersList.length).toBe(6);
    });

    it('should not begin a game with a incomplete team', function() {
        //Init player
        expect(scope.nbPlayers).toBe(0);
        helper.choosePlayer(1, 'red', 'attack');
        expect(scope.nbPlayers).toBe(1);
        helper.choosePlayer(2, 'red', 'defense');
        expect(scope.nbPlayers).toBe(2);
        helper.choosePlayer(3, 'blue', 'attack');
        expect(scope.nbPlayers).toBe(3);
        expect(scope.gameStarted).toBe(false);

        scope.startGame();

        expect(scope.gameStarted).toBe(false);
    });

    it('should begin a game with a valid team', function() {
        expect(scope.nbPlayers).toBe(0);

        helper.chooseAllPlayers();

        expect(scope.nbPlayers).toBe(4);
        expect(scope.gameStarted).toBe(false);

        scope.startGame();

        expect(scope.gameStarted).toBe(true);
        // And score to be 0-0
        expect(helper.getRedScore()).toBe(0);
        expect(helper.getBlueScore()).toBe(0);
    });


    it('should add normal goal for the right team', function() {
        helper.chooseAllPlayers();
        scope.startGame();

        //normal goal
        helper.playerScoreAnyGoals('red', 'defense');
        expect(helper.getRedScore()).toBe(1);
        expect(helper.getBlueScore()).toBe(0);

        helper.playerScoreAnyGoals('blue', 'defense');
        expect(helper.getRedScore()).toBe(1);
        expect(helper.getBlueScore()).toBe(1);

        helper.playerScoreAnyGoals('red', 'attack');
        expect(helper.getRedScore()).toBe(2);
        expect(helper.getBlueScore()).toBe(1);

        helper.playerScoreAnyGoals('blue', 'defense');
        expect(helper.getRedScore()).toBe(2);
        expect(helper.getBlueScore()).toBe(2);
    });

    it('should cancel last goal', function() {
        helper.chooseAllPlayers();
        scope.startGame();

        //normal goal
        helper.playerScoreAnyGoals('red', 'defense');
        expect(helper.getRedScore()).toBe(1);
        expect(helper.getBlueScore()).toBe(0);

        scope.cancelGoal();
        expect(helper.getRedScore()).toBe(0);
        expect(helper.getBlueScore()).toBe(0);
    });


    it('should coach the team', function() {
        helper.chooseAllPlayers();
        scope.startGame();

        //Red coaching
        expect(scope.table.sides[0].seats[0].player_id).toBe(scope.playersList[0].player_id);
        expect(scope.table.sides[0].seats[1].player_id).toBe(scope.playersList[1].player_id);
        scope.coach(scope.table.sides[0]);
        expect(scope.table.sides[0].seats[0].player_id).toBe(scope.playersList[1].player_id);
        expect(scope.table.sides[0].seats[1].player_id).toBe(scope.playersList[0].player_id);

        //blue coaching
        expect(scope.table.sides[1].seats[0].player_id).toBe(scope.playersList[2].player_id);
        expect(scope.table.sides[1].seats[1].player_id).toBe(scope.playersList[3].player_id);
        scope.coach(scope.table.sides[1]);
        expect(scope.table.sides[1].seats[0].player_id).toBe(scope.playersList[3].player_id);
        expect(scope.table.sides[1].seats[1].player_id).toBe(scope.playersList[2].player_id);

        //Reorder player
        scope.coach(scope.table.sides[0]);
        scope.coach(scope.table.sides[1]);
    });


    it('should add autogoal for the right team', function() {
        helper.chooseAllPlayers();
        scope.startGame();

        //autogoal
        helper.playerScoreAnyAutogoals('red', 'defense');
        expect(helper.getRedScore()).toBe(0);
        expect(helper.getBlueScore()).toBe(1);

        helper.playerScoreAnyAutogoals('blue', 'defense');
        expect(helper.getRedScore()).toBe(1);
        expect(helper.getBlueScore()).toBe(1);

        helper.playerScoreAnyAutogoals('red', 'attack');
        expect(helper.getRedScore()).toBe(1);
        expect(helper.getBlueScore()).toBe(2);

        helper.playerScoreAnyAutogoals('blue', 'defense');
        expect(helper.getRedScore()).toBe(2);
        expect(helper.getBlueScore()).toBe(2);
    });


    it('should save game after 10 goals', function() {
        helper.chooseAllPlayers();
        scope.startGame();
        
        helper.playerScoreAnyGoals('red', 'defense', 9);
        expect(helper.getRedScore()).toBe(9);
        expect(helper.getBlueScore()).toBe(0);
        
        helper.playerScoreAnyGoals('red', 'defense');
        expect(helper.getRedScore()).toBe(10);
        expect(helper.getBlueScore()).toBe(0);

        expect(scope.gameEnded).toBe(true);

        var goals = [];

        for (var i = 0; i < 10; i++) {
            goals.push({
                position: 'defense',
                player_id: 2,
                conceder_id: 4,
                autogoal: false
            });
        }

        httpMock.expectPOST(config.BABITCH_WS_URL + '/games', {
            red_score: 10,
            blue_score: 0,
            player: [
                { team: 'red',  position: 'attack',  player_id: 1 },
                { team: 'red',  position: 'defense', player_id: 2 },
                { team: 'blue', position: 'attack',  player_id: 3 },
                { team: 'blue', position: 'defense', player_id: 4 },
            ],
            goals: goals
        }).respond(200, '');

        httpMock.flush();
    });
});