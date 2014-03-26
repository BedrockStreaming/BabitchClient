'use strict';

var babitchServer = angular.module("babitchServer", [])
    .constant('CONFIG', {
        'BABITCH_WS_URL': "http://127.0.0.1:8081/app_dev.php/v1",
        'BABITCH_LIVE_FAYE_URL' :'http://faye-babitch.herokuapp.com/faye',
        'BABITCH_LIVE_FAYE_CHANNEL' :'/test-channel-to-replace',
        'BABITCH_STATS_MIN_GAME_PLAYED' : 2 //Players with Percent of gamePlayed lower than that are excluded from global stats
});
