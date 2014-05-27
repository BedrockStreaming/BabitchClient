'use strict';

describe('Controller: BabitchAdminPlayerCtrl', function() {

    // load the controller's module
    beforeEach(module('babitchFrontendApp'));
    beforeEach(module('stateMock'));

    var theBabitchAdminPlayerCtrl,
        scope,
        httpMock,
        config;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope, $httpBackend, CONFIG) {
        scope = $rootScope.$new();
        httpMock = $httpBackend;
        config = CONFIG;

        theBabitchAdminPlayerCtrl = $controller('babitchAdminPlayerCtrl', {
            $scope: scope
        });

    }));

    afterEach(function() {
        httpMock.verifyNoOutstandingExpectation();
        httpMock.verifyNoOutstandingRequest();
    });

    it('should send modification on a valid form', function() {

        // mock angular form
        scope.playerForm = {};

        // valid form
        scope.playerForm.$dirty = true;
        scope.playerForm.$valid = true;
        expect(scope.submitForm()).toBe(true);

        //Just testing that a put request is made
        httpMock.expectPOST(config.BABITCH_WS_URL + '/players').respond(200, '');
        httpMock.flush();
    });

    it('should not send modification on a invalid form', function() {

        // mock angular form
        scope.playerForm = {};

        // non-valid form
        scope.playerForm.$dirty = true;
        scope.playerForm.$valid = false;
        expect(scope.submitForm()).toBe(false);
    });
});