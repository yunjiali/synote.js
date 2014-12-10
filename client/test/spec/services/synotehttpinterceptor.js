'use strict';

describe('Service: synoteHTTPInterceptor', function () {

  // load the service's module
  beforeEach(module('synoteClientApp'));

  // instantiate service
  var synoteHTTPInterceptor;
  beforeEach(inject(function (_synoteHTTPInterceptor_) {
    synoteHTTPInterceptor = _synoteHTTPInterceptor_;
  }));

  it('should do something', function () {
    expect(!!synoteHTTPInterceptor).toBe(true);
  });

});
