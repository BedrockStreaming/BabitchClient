'use strict';

describe('Filter: prettyTime', function() {

    // load the filter's module
    beforeEach(module('babitchFrontendApp'));

    // initialize a new instance of the filter before each test
    var prettyTime;
    beforeEach(inject(function($filter) {
        prettyTime = $filter('prettyTime');
    }));

    it('should return the input prefixed with "prettyTime filter:"', function() {
        var time = 100;
        expect(prettyTime(time)).toBe('01 : 40');
    });

});