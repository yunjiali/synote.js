'use strict';

describe('Service: policyService', function () {

  // load the service's module
  beforeEach(module('synoteClientApp'));

  // instantiate service
  var policyService;
  beforeEach(inject(function (_policyService_) {
    policyService = _policyService_;
  }));

  it('should do something', function () {
    expect(!!policyService).toBe(true);
  });

});
