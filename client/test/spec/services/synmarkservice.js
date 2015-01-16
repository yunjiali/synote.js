'use strict';

describe('Service: synmarkService', function () {

  // load the service's module
  beforeEach(module('synoteClient'));

  // instantiate service
  var synmarkService;
  beforeEach(inject(function (_synmarkService_) {
    synmarkService = _synmarkService_;
  }));

  it('should do something', function () {
    expect(!!synmarkService).toBe(true);
  });

});
