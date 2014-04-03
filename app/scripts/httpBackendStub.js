/* global Fixtures */
'use strict';

(function(angular) {
    if (!document.URL.match(/\?nobackend/i)) {
        return;
    }

    console.log(' ===== USING STUBBED BACKEND ======');

    angular.module('babitchFrontendApp')
        .config(function($provide) {
            $provide.decorator('$httpBackend', angular.mock.e2e.$httpBackendDecorator);
        })
        .run(function($httpBackend, CONFIG) {
            //Define responses for requests here as usual
            $httpBackend.whenGET(/views\/.*/).passThrough();

            $httpBackend.whenPOST(CONFIG.BABITCH_WS_URL + '/games').respond({});

            $httpBackend.whenGET(CONFIG.BABITCH_WS_URL + '/games?page=1&per_page=100').respond(Fixtures.games);

            $httpBackend.whenGET(CONFIG.BABITCH_WS_URL + '/players').respond(Fixtures.players);

            $httpBackend.whenGET(/v1\/players\/[0-9]*/).respond(function(method, url) {
                var regEx = /v1\/players\/([0-9]*)/;
                var id = regEx.exec(url)[1];
                return [200, Fixtures.players[id - 1]];
            });
        });
})(angular);
