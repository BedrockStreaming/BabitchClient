describe('Controller: BabitchCtrl', function() {

    // load the controller's module
    beforeEach(module('babitchFrontendApp'));
    var theBabitchCtrl,
        scope,
        httpMock,
        JsonPlayer,
        defaultPlayer = [
            { team: 'red', position: 'defense', player_id: 6 },
            { team: 'blue', position: 'attack', player_id: 5 },
            { team: 'red', position: 'attack', player_id: 4 },
            { team: 'blue', position: 'defense', player_id: 3 }
        ],
        incompletePlayer = [
            { team: 'red', position: 'defense', player_id: 6 },
            { team: 'blue', position: 'attack', player_id: 5 },
            { team: 'red', position: 'attack', player_id: 4 },
            { team: 'blue', position: 'defense', player_id: null }
        ];

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope, $httpBackend) {
        scope = $rootScope.$new();
        httpMock = $httpBackend;

        JsonPlayer = [{
            "id": 6,
            "name": "Benjamin",
            "email": "",
            "_links": {
                "self": {
                    "href": "http:\/\/127.0.0.1:8081\/app_dev.php\/v1\/players\/6"
                }
            }
        }, {
            "id": 5,
            "name": "Marc",
            "email": "",
            "_links": {
                "self": {
                    "href": "http:\/\/127.0.0.1:8081\/app_dev.php\/v1\/players\/5"
                }
            }
        }, {
            "id": 4,
            "name": "Remi",
            "email": "",
            "_links": {
                "self": {
                    "href": "http:\/\/127.0.0.1:8081\/app_dev.php\/v1\/players\/4"
                }
            }
        }, {
            "id": 3,
            "name": "Nicolas",
            "email": "",
            "_links": {
                "self": {
                    "href": "http:\/\/127.0.0.1:8081\/app_dev.php\/v1\/players\/3"
                }
            }
        }, {
            "id": 2,
            "name": "Florent",
            "email": "",
            "_links": {
                "self": {
                    "href": "http:\/\/127.0.0.1:8081\/app_dev.php\/v1\/players\/2"
                }
            }
        }, {
            "id": 1,
            "name": "Kenny",
            "email": "",
            "_links": {
                "self": {
                    "href": "http:\/\/127.0.0.1:8081\/app_dev.php\/v1\/players\/1"
                }
            }
        }];

        httpMock.whenGET("http://127.0.0.1:8081/app_dev.php/v1/players").respond(JsonPlayer);

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
        scope.game.player = incompletePlayer;
        scope.startGame();
        expect(scope.gameStarted).toBe(false);
    });

    it('should begin a game with a valid team', function() {
        scope.game.player = defaultPlayer;
        scope.startGame();

        expect(scope.gameStarted).toBe(true);
        // And score to be 0-0
        expect(scope.game.red_score).toBe(0);
        expect(scope.game.blue_score).toBe(0);
    });

    it('should add normal goal for the right team', function() {
        scope.game.player = defaultPlayer;
        scope.startGame();

        //normal goal
        var player = defaultPlayer[0]; //red
        scope.goal(player);
        expect(scope.game.red_score).toBe(1);
        expect(scope.game.blue_score).toBe(0);

        player = defaultPlayer[1]; //blue
        scope.goal(player);
        expect(scope.game.red_score).toBe(1);
        expect(scope.game.blue_score).toBe(1);

        player = defaultPlayer[2]; //red
        scope.goal(player);
        expect(scope.game.red_score).toBe(2);
        expect(scope.game.blue_score).toBe(1);

        player = defaultPlayer[3]; //blue
        scope.goal(player);
        expect(scope.game.red_score).toBe(2);
        expect(scope.game.blue_score).toBe(2);
    });

    it('should cancel last goal', function() {
        scope.game.player = defaultPlayer;
        scope.startGame();

        //normal goal
        var player = defaultPlayer[0]; //red
        scope.goal(player);
        expect(scope.game.red_score).toBe(1);
        expect(scope.game.blue_score).toBe(0);

        scope.cancelGoal();
        expect(scope.game.red_score).toBe(0);
        expect(scope.game.blue_score).toBe(0);
    });

    it('should coach the team', function() {
        scope.game.player = defaultPlayer;
        scope.startGame();

        scope.coach('blue');
        expect(scope.getPlayerBySeat('blue','attack').player_id).toBe(3);
        expect(scope.getPlayerBySeat('blue','defense').player_id).toBe(5);

        scope.coach('red');
        expect(scope.getPlayerBySeat('red','attack').player_id).toBe(6);
        expect(scope.getPlayerBySeat('red','defense').player_id).toBe(4);  

        //Reorder player
        scope.coach('blue');
        scope.coach('red');
    });

    it('should add autogoal for the right team', function() {
        scope.game.player = defaultPlayer;
        scope.startGame();

        //normal goal
        var player = defaultPlayer[0]; //red
        scope.autogoal(player);
        expect(scope.game.red_score).toBe(0);
        expect(scope.game.blue_score).toBe(1);

        player = defaultPlayer[1]; //blue
        scope.autogoal(player);
        expect(scope.game.red_score).toBe(1);
        expect(scope.game.blue_score).toBe(1);

        player = defaultPlayer[2]; //red
        scope.autogoal(player);
        expect(scope.game.red_score).toBe(1);
        expect(scope.game.blue_score).toBe(2);

        player = defaultPlayer[3]; //blue
        scope.autogoal(player);
        expect(scope.game.red_score).toBe(2);
        expect(scope.game.blue_score).toBe(2);
    });


    it('should save game after 10 goal', function() {
        scope.game.player = defaultPlayer;
        scope.startGame();

        //normal goal
        var player = defaultPlayer[0]; //red
        scope.goal(player);
        expect(scope.game.red_score).toBe(1);
        for(var i=0;i<8;i++) {
            scope.goal(player);
        }
        expect(scope.game.red_score).toBe(9);        
        expect(scope.game.blue_score).toBe(0);
        scope.goal(player);
        expect(scope.game.red_score).toBe(10);
        httpMock.expectPOST('http://127.0.0.1:8081/app_dev.php/v1/games',
            {
                "red_score":10,
                "blue_score":0,
                "player":defaultPlayer,
                "goals":[
                    {"position":"defense","player_id":6,"conceder_id":3,"autogoal":false},
                    {"position":"defense","player_id":6,"conceder_id":3,"autogoal":false},
                    {"position":"defense","player_id":6,"conceder_id":3,"autogoal":false},
                    {"position":"defense","player_id":6,"conceder_id":3,"autogoal":false},
                    {"position":"defense","player_id":6,"conceder_id":3,"autogoal":false},
                    {"position":"defense","player_id":6,"conceder_id":3,"autogoal":false},
                    {"position":"defense","player_id":6,"conceder_id":3,"autogoal":false},
                    {"position":"defense","player_id":6,"conceder_id":3,"autogoal":false},
                    {"position":"defense","player_id":6,"conceder_id":3,"autogoal":false},
                    {"position":"defense","player_id":6,"conceder_id":3,"autogoal":false}
                ]
            }).respond(200, '');
        
        httpMock.flush();
    });

    it('should create new match when game is over', function() {
        scope.game.player = defaultPlayer;
        scope.startGame();

        //normal goal
        var player = defaultPlayer[0]; //red
        for(var i=0;i<10;i++) {
            scope.goal(player);
        }
        expect(scope.game.red_score).toBe(10);
        httpMock.expectPOST('http://127.0.0.1:8081/app_dev.php/v1/games',
            {
                "red_score":10,
                "blue_score":0,
                "player":defaultPlayer,
                "goals":[
                    {"position":"defense","player_id":6,"conceder_id":3,"autogoal":false},
                    {"position":"defense","player_id":6,"conceder_id":3,"autogoal":false},
                    {"position":"defense","player_id":6,"conceder_id":3,"autogoal":false},
                    {"position":"defense","player_id":6,"conceder_id":3,"autogoal":false},
                    {"position":"defense","player_id":6,"conceder_id":3,"autogoal":false},
                    {"position":"defense","player_id":6,"conceder_id":3,"autogoal":false},
                    {"position":"defense","player_id":6,"conceder_id":3,"autogoal":false},
                    {"position":"defense","player_id":6,"conceder_id":3,"autogoal":false},
                    {"position":"defense","player_id":6,"conceder_id":3,"autogoal":false},
                    {"position":"defense","player_id":6,"conceder_id":3,"autogoal":false}
                ]
            }).respond(200, '');
        httpMock.flush();
        //The game must be renew
        expect(scope.gameStarted).toBe(false);
        //No one has to be selected
        expect(scope.getPlayerBySeat('blue','attack').player_id).toBe(undefined);

    });
});