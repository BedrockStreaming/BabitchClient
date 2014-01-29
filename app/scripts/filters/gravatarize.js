'use strict';

angular.module('babitchFrontendApp')
	.filter('gravatarize', function(gravatarService) {
		return function(email, size) {
			if (!email) {
				return gravatarService.url('', {
					default: 'mm',
					size: size
				});
			}

			return gravatarService.url(email, {
				default: 'wavatar',
				size: size
			});
		};
	});