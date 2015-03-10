'use strict';

describe('Service: CueService', function () {

  // load the service's module
  beforeEach(module('synoteClientApp'));

  // instantiate service
  var CueService;
  beforeEach(inject(function (_CueService_) {
    CueService = _CueService_;
  }));

  it('should do something', function () {
    expect(!!CueService).toBe(true);
  });

});
