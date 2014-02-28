'use strict';

babitchFrontendApp.controller('babitchLiveCtrl', function ($scope, BabitchTable) {

    var client = BabitchTable().client();
    var server = BabitchTable().server();

    $scope.table = client.table;
    $scope.history = [];

    client.on('goal', function (data) {
        // Do anything
    });

    window.server = server;
});