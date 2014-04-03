'use strict';

angular.module('babitchFrontendApp')
    .filter('prettyTime', function() {
    return function(time) {
        var minutes = Math.floor(time / 60);
        var seconds = time % 60;

        minutes = (minutes < 10 ? '0' + minutes : minutes);
        seconds = (seconds < 10 ? '0' + seconds : seconds);

        return minutes + ' : ' + seconds;
    };
});
