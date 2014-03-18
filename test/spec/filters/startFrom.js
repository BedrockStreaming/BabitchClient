'use strict';

describe('Filter: startFrom', function() {

    // load the filter's module
    beforeEach(module('babitchFrontendApp'));

    // initialize a new instance of the filter before each test
    var startFrom;
    beforeEach(inject(function($filter) {
        startFrom = $filter('startFrom');
    }));

    it('should start array from the correct position"', function() {

        expect(startFrom([1,2,3,4], 0).length).toBe(4);
        expect(startFrom([1,2,3,4], 1).length).toBe(3);
        expect(startFrom([1,2,3,4], 2).length).toBe(2);
    });

    it('should not crash with an incorrect position"', function() {
        expect(startFrom([1,2,3,4], 5).length).toBe(0);
    });

    it('should not crash with an empty table"', function() {
        var emptyArray = [];
        expect(startFrom(emptyArray, 2).length).toBe(0);
    });

});