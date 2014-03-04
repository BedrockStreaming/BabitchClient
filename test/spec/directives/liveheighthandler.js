'use strict';

describe('Directive: liveHeightHandler', function () {

  // load the directive's module
  beforeEach(module('babitchFrontendApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<live-height-handler></live-height-handler>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the liveHeightHandler directive');
  }));
});
