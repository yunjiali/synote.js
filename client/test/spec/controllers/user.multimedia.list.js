'use strict';

describe('Controller: UserMultimediaListCtrl', function () {

  // load the controller's module
  beforeEach(module('synoteClientApp'));

  var UserMultimediaListCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UserMultimediaListCtrl = $controller('UserMultimediaListCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
