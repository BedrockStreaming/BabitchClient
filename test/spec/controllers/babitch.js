describe('Controller: BabitchCtrl', function() {

    // load the controller's module
    beforeEach(module('babitchFrontendApp'));



    var theBabitchCtrl,
        scope,
        httpMock,
        JsonPlayer;

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

    it('should begin with 0-0 score', function() {
        expect(scope.game.team[0].score).toBe(0);
        expect(scope.game.team[1].score).toBe(0);
    });
});