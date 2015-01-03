'use strict';

describe('Controller: PlaylistCreateCtrl', function () {

  // load the controller's module
  beforeEach(module('synoteClientApp'));

  var PlaylistCreateCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PlaylistCreateCtrl = $controller('PlaylistCreateCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
