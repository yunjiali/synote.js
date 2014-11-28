'use strict';

describe('Service: playlistService', function () {

  // load the service's module
  beforeEach(module('synoteClientApp'));

  // instantiate service
  var playlistService;
  beforeEach(inject(function (_playlistService_) {
    playlistService = _playlistService_;
  }));

  it('should do something', function () {
    expect(!!playlistService).toBe(true);
  });

});
