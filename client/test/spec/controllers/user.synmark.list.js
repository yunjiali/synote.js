'use strict';

describe('Controller: UserSynmarkListCtrl', function () {

  // load the controller's module
  beforeEach(module('synoteClientApp'));

  var UserSynmarkListCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UserSynmarkListCtrl = $controller('UserSynmarkListCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
