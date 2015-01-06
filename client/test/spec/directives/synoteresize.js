'use strict';

describe('Directive: synoteResize', function () {

  // load the directive's module
  beforeEach(module('synoteClientApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<synote-resize></synote-resize>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the synoteResize directive');
  }));
});
