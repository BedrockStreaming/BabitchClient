/* global Fixtures */
'use strict';

describe('Controller: BabitchAdminPlayerEditCtrl', function() {

    // load the controller's module
    beforeEach(module('babitchFrontendApp'));


    var theBabitchAdminPlayerEditCtrl,
        scope,
        httpMock,
        config,
        stateParams;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope, $httpBackend, CONFIG) {
        scope = $rootScope.$new();
        httpMock = $httpBackend;
        config = CONFIG;

        httpMock.whenGET(config.BABITCH_WS_URL + '/players/1').respond(Fixtures.players[0]);

        stateParams = {
            id: 1
        };

        theBabitchAdminPlayerEditCtrl = $controller('babitchAdminPlayerEditCtrl', {
            $scope: scope,
            $stateParams: stateParams
        });

        //Flush the .query
        httpMock.flush();
    }));

    afterEach(function() {
        httpMock.verifyNoOutstandingExpectation();
        httpMock.verifyNoOutstandingRequest();
    });

    it('should load the player', function() {
        expect(scope.player.name).toBe('Adrien');
    });

    it('should put modification on a valid form', function() {

        // mock angular form
        scope.playerForm = {};

        // valid form
        scope.playerForm.$dirty = true;
        scope.playerForm.$valid = true;
        expect(scope.submitForm()).toBe(true);

        //Just testing that a put request is made
        httpMock.expectPUT(config.BABITCH_WS_URL + '/players/1').respond(200, '');
        httpMock.flush();
    });

    it('should not put modification on a invalid form', function() {

        // mock angular form
        scope.playerForm = {};

        // non-valid form
        scope.playerForm.$dirty = true;
        scope.playerForm.$valid = false;
        expect(scope.submitForm()).toBe(false);
    });
});