'use strict';

module.exports = function() {
    angular.module('babitchServer', [])
	.constant('CONFIG', {
	    'BABITCH_WS_URL': 'http://127.0.0.1:8081/app_dev.php/v1',
	    'BABITCH_LIVE_FAYE_URL' :'http://localhost:9003/faye',
	    'BABITCH_LIVE_FAYE_CHANNEL' :'/test-channeldfdfd-to-replace'
	});
};
