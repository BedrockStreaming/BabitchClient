'use strict';

babitchFrontendApp.controller("babitchLiveCtrl", function ($scope, fayeClient, CONFIG) {
    fayeClient.subscribe(CONFIG.BABITCH_LIVE_FAYE_CHANNEL, function(data) {
        console.log(data);
    });
});
