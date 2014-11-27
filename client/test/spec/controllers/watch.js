'use strict';

describe('Controller: WatchCtrl', function () {

  // load the controller's module
  beforeEach(module('synoteClientApp'));

  var WatchCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WatchCtrl = $controller('WatchCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
