'use strict';

var babitchServer = angular.module("babitchServer", [])
    .constant('CONFIG', {
        'BABITCH_WS_URL': "http://baby.cytron.fr/v1"
});
