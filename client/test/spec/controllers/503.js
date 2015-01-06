'use strict';

describe('Controller: 503Ctrl', function () {

  // load the controller's module
  beforeEach(module('synoteClientApp'));

  var 503Ctrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    503Ctrl = $controller('503Ctrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
