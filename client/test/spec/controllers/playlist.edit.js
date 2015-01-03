'use strict';

describe('Controller: PlaylistEditCtrl', function () {

  // load the controller's module
  beforeEach(module('synoteClientApp'));

  var PlaylistEditCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PlaylistEditCtrl = $controller('PlaylistEditCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
