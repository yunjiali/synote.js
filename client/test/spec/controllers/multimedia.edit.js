'use strict';

describe('Controller: MultimediaEditCtrl', function () {

  // load the controller's module
  beforeEach(module('synoteClientApp'));

  var MultimediaEditCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MultimediaEditCtrl = $controller('MultimediaEditCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
