describe('Controller: BabitchLiveCtrl', function() {

    // load the controller's module
    beforeEach(module('babitchFrontendApp'));

    var theBabitchLiveCtrl,
        scope,
        httpMock,
        mockFayeClient,
        JsonPlayer,
        fayeMessage;
    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope, $httpBackend, fayeClient) {
        scope = $rootScope.$new();
        httpMock = $httpBackend;

        JsonPlayer = [{
            "id": 1,
            "name": "Remi",
            "email": "",
            "_links": {
                "self": {
                    "href": "http:\/\/127.0.0.1:8081\/app_dev.php\/v1\/players\/4"
                }
            }
        }, {
            "id": 2,
            "name": "Nicolas",
            "email": "",
            "_links": {
                "self": {
                    "href": "http:\/\/127.0.0.1:8081\/app_dev.php\/v1\/players\/3"
                }
            }
        }, {
            "id": 3,
            "name": "Florent",
            "email": "",
            "_links": {
                "self": {
                    "href": "http:\/\/127.0.0.1:8081\/app_dev.php\/v1\/players\/2"
                }
            }
        }, {
            "id": 4,
            "name": "Kenny",
            "email": "",
            "_links": {
                "self": {
                    "href": "http:\/\/127.0.0.1:8081\/app_dev.php\/v1\/players\/1"
                }
            }
        }];

        var players = [
            { position: 'attack', team: 'blue',  player_id: 4 },
            { position: 'defense', team: 'blue',  player_id: 3 },
            { position: 'defense', team: 'red', player_id: 2 },
            { position: 'attack', team: 'red',  player_id: 1 },

        ];

        fayeMessage = {
            goal1: {
                type: 'goal',
                gameId: 123,
                game: { player: players },
                red_score: 0,
                blue_score: 1,
                goals: []
            },
            goal2: {
                type: 'goal',
                gameId: 123,
                game: { player: players },
                red_score: 0,
                blue_score: 2,
                goals: []
            },
            goalOtherGame: {
                type: 'goal',
                gameId: 456,
                game: { player: players },
                red_score: 1,
                blue_score: 0,
                goals: []
            }
        };

        httpMock.whenGET("http://127.0.0.1:8081/app_dev.php/v1/players").respond(JsonPlayer);
        $httpBackend.whenGET(/v1\/players\/[0-9]/).respond(function(method, url) {
            var regEx = /v1\/players\/([0-9])/;
            var id = regEx.exec(url)[1];

            return [200, JsonPlayer[id - 1]];
        });

        mockFayeClient = {
            publish: function(channel, message) {},
            sendData: function(data) {
                var _this = this;
                scope.$apply(function() {
                     _this.callback(data);
                });
            },
            subscribe: function(channel, callback) {
                this.callback = callback;
            }
        };

        theBabitchLiveCtrl = $controller('babitchLiveCtrl', {
            $scope:     scope,
            fayeClient: mockFayeClient
        });

    }));

    afterEach(function() {
        httpMock.verifyNoOutstandingExpectation();
        httpMock.verifyNoOutstandingRequest();
    });

    it('should begin with a game not started yet', function() {
        expect(scope.game).toBe(null);
    });

    it('should display game if no current game', function() {
        mockFayeClient.sendData(fayeMessage.goal1);
        httpMock.flush();
        expect(scope.game).toBe(fayeMessage.goal1.game);
        expect(scope.redAttacker.name).toEqual('Remi');
        expect(scope.redDefender.name).toEqual('Nicolas');
        expect(scope.blueAttacker.name).toEqual('Kenny');
        expect(scope.blueDefender.name).toEqual('Florent');
    });

    it('should display game if is current game', function() {
        mockFayeClient.sendData(fayeMessage.goal1);
        httpMock.flush();
        mockFayeClient.sendData(fayeMessage.goal2);
        httpMock.flush();
        expect(scope.game).toBe(fayeMessage.goal2.game);
    });

    it('should display not game if is another game', function() {
        mockFayeClient.sendData(fayeMessage.goal1);
        httpMock.flush();
        mockFayeClient.sendData(fayeMessage.goalOtherGame);
        expect(scope.game).not.toBe(fayeMessage.goalOtherGame.game);
    });

});