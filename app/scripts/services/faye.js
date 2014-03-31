/* global Faye */
'use strict';

(function() {
    angular.module('faye', []).factory('fayeClient', ['$rootScope', 'CONFIG', function($rootScope, CONFIG) {
        var client, scope;
        scope = $rootScope;

        if (CONFIG.BABITCH_LIVE_FAYE_URL && CONFIG.BABITCH_LIVE_FAYE_URL !== 'undefined') {
            client = new Faye.Client(CONFIG.BABITCH_LIVE_FAYE_URL);
            client.disable('websocket');
        } else {
            client = {
                publish: function() {},
                subscribe: function() {}
            };
        }
        return {
            client: client,
            publish: function(channel, data) {
                return this.client.publish(channel, data);
            },
            subscribe: function(channel, callback) {
                return this.client.subscribe(channel, function(data) {
                    return scope.$apply(function() {
                        return callback(data);
                    });
                });
            }
        };
    }]);

})();
