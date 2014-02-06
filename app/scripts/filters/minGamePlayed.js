'use strict';

//Filter for showing only players with <X> minimum game played
angular.module('babitchFrontendApp')
	.filter('minGamePlayed', function() {
		return function(input, gamePlayedMin) {
			var out = [];
			for (var i = 0; i < input.length; i++) {
				if (input[i]) {
					if (input[i].gamePlayed >= gamePlayedMin) {
						out.push(input[i]);
					}
				}
			}
			return out;
		};
	});