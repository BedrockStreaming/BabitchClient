'use strict';

describe('Filter: withPlayerInTeam', function() {

    // load the filter's module
    beforeEach(module('babitchFrontendApp'));

    // initialize a new instance of the filter before each test
    var withPlayerInTeam;
    beforeEach(inject(function($filter) {
        withPlayerInTeam = $filter('withPlayerInTeam');
    }));

    it('should filter team without the good player"', function() {
        var team = [
            {playerId1: 1},
            {playerId1: 10}
        ];

        expect(withPlayerInTeam(team,0).length).toBe(2);
        expect(withPlayerInTeam(team,5).length).toBe(0);
        expect(withPlayerInTeam(team,1).length).toBe(1);
        expect(withPlayerInTeam(team,10).length).toBe(1);
    });

});