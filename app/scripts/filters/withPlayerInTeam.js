'use strict';

//Filter for showing only teams with this player
angular.module('babitchFrontendApp')
    .filter('withPlayerInTeam', function() {
        return function(input, withPlayer) {
            if( !withPlayer ) {
                return input;
            }
            var out = [];
            for (var i = 0; i < input.length; i++) {
                if (input[i]) {
                    if (input[i].playerId1 === withPlayer || input[i].playerId2 === withPlayer || input[i].redDefense === withPlayer || input[i].redAttack === withPlayer || input[i].blueDefense === withPlayer || input[i].blueAttack === withPlayer) {
                        out.push(input[i]);
                    }
                }
            }
            return out;
        };
    });