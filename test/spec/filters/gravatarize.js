'use strict';

describe('Filter: gravatarize', function() {

    // load the filter's module
    beforeEach(module('babitchFrontendApp'));

    // initialize a new instance of the filter before each test
    var gravatarize;
    beforeEach(inject(function($filter) {
        gravatarize = $filter('gravatarize');
    }));

    it('should return a gravatarurl"', function() {
        expect(gravatarize('test@test.fr')).toMatch('gravatar.com');
    });

    it('should return a gravatarurl even without email', function() {
        expect(gravatarize('')).toMatch('gravatar.com');
    });

});