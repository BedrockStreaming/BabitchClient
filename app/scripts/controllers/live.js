'use strict';

babitchFrontendApp.controller('BabitchLiveCtrl', function ($scope, BabitchMatch) {

    var match = BabitchMatch().client();

    $scope.table = match.table;
    $scope.history = [];

    match.on('goal', function (data) {
        // Do anything
    });
});