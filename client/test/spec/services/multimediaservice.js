'use strict';

describe('Service: multimediaService', function () {

  // load the service's module
  beforeEach(module('synoteClient'));

  // instantiate service
  var multimediaService;
  beforeEach(inject(function (_multimediaService_) {
    multimediaService = _multimediaService_;
  }));

  it('should do something', function () {
    expect(!!multimediaService).toBe(true);
  });

});
