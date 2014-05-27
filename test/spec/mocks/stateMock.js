'use strict';
angular.module('stateMock', []);
angular.module('stateMock').service('$state', function($q){
    this.expectedTransitions = [];
    this.transitionTo = function(stateName){

        console.log('Mock transition to: ' + stateName);
        var deferred = $q.defer();
        var promise = deferred.promise;
        deferred.resolve();

        return promise;
    };
    this.go = this.transitionTo;
});