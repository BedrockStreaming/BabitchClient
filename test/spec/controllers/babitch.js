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
            "id": 6,
            "name": "Benjamin",
            "email": ""
        }, {
            "id": 5,
            "name": "Marc",
            "email": ""
        }, {
            "id": 4,
            "name": "Remi",
            "email": ""
        }, {
            "id": 3,
            "name": "Nicolas",
            "email": ""
        }, {
            "id": 2,
            "name": "Florent",
            "email": ""
        }, {
            "id": 1,
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

    it('should begin with a game not started yet', function() {
        expect(scope.gameStarted).toBe(false);
    });

    it('should fetch the player list', function() {
        expect(scope.playersList.length).toBe(6);
    });

    it('should not begin a game with a incomplete team', function() {
        //Init player
        expect(scope.nbPlayers).toBe(0);

        scope.focusSeat(scope.table.sides[0].seats[0], scope.table.sides[0]);
        scope.choosePlayer(scope.playersList[0]);

        expect(scope.nbPlayers).toBe(1);

        scope.focusSeat(scope.table.sides[0].seats[1], scope.table.sides[0]);
        scope.choosePlayer(scope.playersList[1]);
        expect(scope.nbPlayers).toBe(2);

        scope.focusSeat(scope.table.sides[1].seats[0], scope.table.sides[1]);
        scope.choosePlayer(scope.playersList[2]);

        expect(scope.nbPlayers).toBe(3);
        expect(scope.gameStarted).toBe(false);

        scope.startGame();

        expect(scope.gameStarted).toBe(false);
    });

    it('should begin a game with a valid team', function() {
        expect(scope.nbPlayers).toBe(0);

        scope.focusSeat(scope.table.sides[0].seats[0], scope.table.sides[0]);
        scope.choosePlayer(scope.playersList[0]);
        scope.focusSeat(scope.table.sides[0].seats[1], scope.table.sides[0]);
        scope.choosePlayer(scope.playersList[1]);
        scope.focusSeat(scope.table.sides[1].seats[0], scope.table.sides[1]);
        scope.choosePlayer(scope.playersList[2]);
        scope.focusSeat(scope.table.sides[1].seats[1], scope.table.sides[1]);
        scope.choosePlayer(scope.playersList[3]);

        expect(scope.nbPlayers).toBe(4);
        expect(scope.gameStarted).toBe(false);

        scope.startGame();

        expect(scope.gameStarted).toBe(true);
        // And score to be 0-0
        expect(scope.table.sides[0].score).toBe(0);
        expect(scope.table.sides[1].score).toBe(0);
    });


    it('should add normal goal for the right team', function() {
        scope.focusSeat(scope.table.sides[0].seats[0], scope.table.sides[0]);
        scope.choosePlayer(scope.playersList[0]);
        scope.focusSeat(scope.table.sides[0].seats[1], scope.table.sides[0]);
        scope.choosePlayer(scope.playersList[1]);
        scope.focusSeat(scope.table.sides[1].seats[0], scope.table.sides[1]);
        scope.choosePlayer(scope.playersList[2]);
        scope.focusSeat(scope.table.sides[1].seats[1], scope.table.sides[1]);
        scope.choosePlayer(scope.playersList[3]);
        scope.startGame();

        //normal goal
        scope.focusedSide = scope.table.sides[0]; //red
        scope.focusedSeat = scope.table.sides[0].seats[0]; //defense
        scope.goal();
        expect(scope.table.sides[0].score).toBe(1);
        expect(scope.table.sides[1].score).toBe(0);

        scope.focusedSide = scope.table.sides[1]; //blue
        scope.focusedSeat = scope.table.sides[1].seats[0]; //defense
        scope.goal();
        expect(scope.table.sides[0].score).toBe(1);
        expect(scope.table.sides[1].score).toBe(1);

        scope.focusedSide = scope.table.sides[0]; //red
        scope.focusedSeat = scope.table.sides[0].seats[1]; //attack
        scope.goal();
        expect(scope.table.sides[0].score).toBe(2);
        expect(scope.table.sides[1].score).toBe(1);

        scope.focusedSide = scope.table.sides[1]; //blue
        scope.focusedSeat = scope.table.sides[1].seats[1]; //attack
        scope.goal();
        expect(scope.table.sides[0].score).toBe(2);
        expect(scope.table.sides[1].score).toBe(2);
    });

    it('should cancel last goal', function() {
        scope.focusSeat(scope.table.sides[0].seats[0], scope.table.sides[0]);
        scope.choosePlayer(scope.playersList[0]);
        scope.focusSeat(scope.table.sides[0].seats[1], scope.table.sides[0]);
        scope.choosePlayer(scope.playersList[1]);
        scope.focusSeat(scope.table.sides[1].seats[0], scope.table.sides[1]);
        scope.choosePlayer(scope.playersList[2]);
        scope.focusSeat(scope.table.sides[1].seats[1], scope.table.sides[1]);
        scope.choosePlayer(scope.playersList[3]);
        scope.startGame();

        //normal goal
        scope.focusedSide = scope.table.sides[0]; //red
        scope.focusedSeat = scope.table.sides[0].seats[0]; //defense
        scope.goal();
        expect(scope.table.sides[0].score).toBe(1);
        expect(scope.table.sides[1].score).toBe(0);

        scope.cancelGoal();
        expect(scope.table.sides[0].score).toBe(0);
        expect(scope.table.sides[1].score).toBe(0);
    });


    it('should coach the team', function() {
        scope.focusSeat(scope.table.sides[0].seats[0], scope.table.sides[0]);
        scope.choosePlayer(scope.playersList[0]);
        scope.focusSeat(scope.table.sides[0].seats[1], scope.table.sides[0]);
        scope.choosePlayer(scope.playersList[1]);
        scope.focusSeat(scope.table.sides[1].seats[0], scope.table.sides[1]);
        scope.choosePlayer(scope.playersList[2]);
        scope.focusSeat(scope.table.sides[1].seats[1], scope.table.sides[1]);
        scope.choosePlayer(scope.playersList[3]);
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
        scope.focusSeat(scope.table.sides[0].seats[0], scope.table.sides[0]);
        scope.choosePlayer(scope.playersList[0]);
        scope.focusSeat(scope.table.sides[0].seats[1], scope.table.sides[0]);
        scope.choosePlayer(scope.playersList[1]);
        scope.focusSeat(scope.table.sides[1].seats[0], scope.table.sides[1]);
        scope.choosePlayer(scope.playersList[2]);
        scope.focusSeat(scope.table.sides[1].seats[1], scope.table.sides[1]);
        scope.choosePlayer(scope.playersList[3]);
        scope.startGame();

        //autogoal
        scope.focusedSide = scope.table.sides[0]; //red
        scope.focusedSeat = scope.table.sides[0].seats[0]; //defense
        scope.autogoal();
        expect(scope.table.sides[0].score).toBe(0);
        expect(scope.table.sides[1].score).toBe(1);

        scope.focusedSide = scope.table.sides[1]; //blue
        scope.focusedSeat = scope.table.sides[1].seats[0]; //defense
        scope.autogoal();
        expect(scope.table.sides[0].score).toBe(1);
        expect(scope.table.sides[1].score).toBe(1);

        scope.focusedSide = scope.table.sides[0]; //red
        scope.focusedSeat = scope.table.sides[0].seats[1]; //attack
        scope.autogoal();
        expect(scope.table.sides[0].score).toBe(1);
        expect(scope.table.sides[1].score).toBe(2);

        scope.focusedSide = scope.table.sides[1]; //blue
        scope.focusedSeat = scope.table.sides[1].seats[1]; //attack
        scope.autogoal();
        expect(scope.table.sides[0].score).toBe(2);
        expect(scope.table.sides[1].score).toBe(2);
    });

/*
    it('should save game after 10 goal', function() {
        scope.focusSeat(scope.table.sides[0].seats[0], scope.table.sides[0]);
        scope.choosePlayer(scope.playersList[0]);
        scope.focusSeat(scope.table.sides[0].seats[1], scope.table.sides[0]);
        scope.choosePlayer(scope.playersList[1]);
        scope.focusSeat(scope.table.sides[1].seats[0], scope.table.sides[1]);
        scope.choosePlayer(scope.playersList[2]);
        scope.focusSeat(scope.table.sides[1].seats[1], scope.table.sides[1]);
        scope.choosePlayer(scope.playersList[3]);
        scope.startGame();

        //normal goal

        
        for (var i = 0; i < 9; i++) {
            scope.focusedSide = scope.table.sides[0]; //red
            scope.focusedSeat = scope.table.sides[0].seats[0]; //defense
            scope.goal();
        }

        expect(scope.table.sides[0].score).toBe(9);
        expect(scope.table.sides[1].score).toBe(0);
        
        scope.focusedSide = scope.table.sides[0]; //red
        scope.focusedSeat = scope.table.sides[0].seats[0]; //defense
        scope.goal();

        expect(scope.table.sides[0].score).toBe(10);
        expect(scope.gameEnded).toBe(true);

        httpMock.expectPOST(config.BABITCH_WS_URL + '/games', {
            "red_score": 10,
            "blue_score": 0,
            "player": scope.playersList,
            "goals": [{
                "position": "defense",
                "player_id": 6,
                "conceder_id": 3,
                "autogoal": false
            }, {
                "position": "defense",
                "player_id": 6,
                "conceder_id": 3,
                "autogoal": false
            }, {
                "position": "defense",
                "player_id": 6,
                "conceder_id": 3,
                "autogoal": false
            }, {
                "position": "defense",
                "player_id": 6,
                "conceder_id": 3,
                "autogoal": false
            }, {
                "position": "defense",
                "player_id": 6,
                "conceder_id": 3,
                "autogoal": false
            }, {
                "position": "defense",
                "player_id": 6,
                "conceder_id": 3,
                "autogoal": false
            }, {
                "position": "defense",
                "player_id": 6,
                "conceder_id": 3,
                "autogoal": false
            }, {
                "position": "defense",
                "player_id": 6,
                "conceder_id": 3,
                "autogoal": false
            }, {
                "position": "defense",
                "player_id": 6,
                "conceder_id": 3,
                "autogoal": false
            }, {
                "position": "defense",
                "player_id": 6,
                "conceder_id": 3,
                "autogoal": false
            }]
        }).respond(200, '');

        httpMock.flush();
    });
    
        it('should create new match when game is over', function() {
            scope.focusSeat(scope.table.sides[0].seats[0], scope.table.sides[0]);
        scope.choosePlayer(scope.playersList[0]);
        scope.focusSeat(scope.table.sides[0].seats[1], scope.table.sides[0]);
        scope.choosePlayer(scope.playersList[1]);
        scope.focusSeat(scope.table.sides[1].seats[0], scope.table.sides[1]);
        scope.choosePlayer(scope.playersList[2]);
        scope.focusSeat(scope.table.sides[1].seats[1], scope.table.sides[1]);
        scope.choosePlayer(scope.playersList[3]);
        scope.startGame();

        //normal goal
        
        for (var i = 0; i < 9; i++) {
            scope.focusedSide = scope.table.sides[0]; //red
            scope.focusedSeat = scope.table.sides[0].seats[0]; //defense
            scope.goal();
        }
        
        scope.focusedSide = scope.table.sides[0]; //red
        scope.focusedSeat = scope.table.sides[0].seats[0]; //defense
        scope.goal();

        expect(scope.table.sides[0].score).toBe(10);
        expect(scope.gameEnded).toBe(true);
            httpMock.expectPOST(config.BABITCH_WS_URL + '/games', {
                "red_score": 10,
                "blue_score": 0,
                "player": defaultPlayer,
                "goals": [{
                    "position": "defense",
                    "player_id": 6,
                    "conceder_id": 3,
                    "autogoal": false
                }, {
                    "position": "defense",
                    "player_id": 6,
                    "conceder_id": 3,
                    "autogoal": false
                }, {
                    "position": "defense",
                    "player_id": 6,
                    "conceder_id": 3,
                    "autogoal": false
                }, {
                    "position": "defense",
                    "player_id": 6,
                    "conceder_id": 3,
                    "autogoal": false
                }, {
                    "position": "defense",
                    "player_id": 6,
                    "conceder_id": 3,
                    "autogoal": false
                }, {
                    "position": "defense",
                    "player_id": 6,
                    "conceder_id": 3,
                    "autogoal": false
                }, {
                    "position": "defense",
                    "player_id": 6,
                    "conceder_id": 3,
                    "autogoal": false
                }, {
                    "position": "defense",
                    "player_id": 6,
                    "conceder_id": 3,
                    "autogoal": false
                }, {
                    "position": "defense",
                    "player_id": 6,
                    "conceder_id": 3,
                    "autogoal": false
                }, {
                    "position": "defense",
                    "player_id": 6,
                    "conceder_id": 3,
                    "autogoal": false
                }]
            }).respond(200, '');
            httpMock.flush();
            //The game must be renew
            expect(scope.gameStarted).toBe(false);
        }); */
});