'use strict';

describe('Filter: minGamePlayed', function() {

    // load the filter's module
    beforeEach(module('babitchFrontendApp'));

    // initialize a new instance of the filter before each test
    var minGamePlayed;
    beforeEach(inject(function($filter) {
        minGamePlayed = $filter('minGamePlayed');
    }));

    it('should filter player without enough game played"', function() {
        var player = [
            {gamePlayed: 1,name: 'John Doe'},
            {gamePlayed: 10,name: 'Jane Doe'}
        ];

        expect(minGamePlayed(player,0).length).toBe(2);

        expect(minGamePlayed(player,5).length).toBe(1);
        expect(minGamePlayed(player,5)[0].name).toBe('Jane Doe');

        expect(minGamePlayed(player,10).length).toBe(1);
        expect(minGamePlayed(player,10)[0].name).toBe('Jane Doe');

        expect(minGamePlayed(player,11).length).toBe(0);

    });

});