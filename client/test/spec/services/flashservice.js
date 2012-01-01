'use strict';

describe('Service: flashService', function () {

  // load the service's module
  beforeEach(module('synoteClient'));

  // instantiate service
  var flashservice;
  beforeEach(inject(function (_flashservice_) {
    flashservice = _flashservice_;
  }));

  it('should do something', function () {
    expect(!!flashservice).toBe(true);
  });

});
