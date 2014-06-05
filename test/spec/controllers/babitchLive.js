/* global Fixtures */
/* jshint camelcase: false */
'use strict';

describe('Controller: BabitchLiveCtrl', function() {

    // load the controller's module
    beforeEach(module('babitchFrontendApp'));
    beforeEach(module('stateMock'));

    var theBabitchLiveCtrl,
        scope,
        httpMock,
        mockFayeClient,
        fayeMessage;
        
    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope, $httpBackend, fayeClient, CONFIG) {
        scope = $rootScope.$new();
        httpMock = $httpBackend;

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

        httpMock.whenGET(CONFIG.BABITCH_WS_URL + '/players').respond(Fixtures.players);
        $httpBackend.whenGET(/v1\/players\/[0-9]/).respond(function(method, url) {
            var regEx = /v1\/players\/([0-9])/;
            var id = regEx.exec(url)[1];

            return [200, Fixtures.players[id - 1]];
        });

        mockFayeClient = {
            publish: function() {},
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
        expect(scope.redAttacker.name).toEqual('Adrien');
        expect(scope.redDefender.name).toEqual('Denis');
        expect(scope.blueAttacker.name).toEqual('Morgan');
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