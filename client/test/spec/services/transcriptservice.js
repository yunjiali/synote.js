'use strict';

describe('Service: TranscriptService', function () {

  // load the service's module
  beforeEach(module('synoteClientApp'));

  // instantiate service
  var TranscriptService;
  beforeEach(inject(function (_TranscriptService_) {
    TranscriptService = _TranscriptService_;
  }));

  it('should do something', function () {
    expect(!!TranscriptService).toBe(true);
  });

});
