'use strict';

describe('Service: config', function () {

  // load the service's module
  beforeEach(module('nasaraCandyBasketApp'));

  // instantiate service
  var config;
  beforeEach(inject(function (_config_) {
    config = _config_;
  }));

  it('should contain the backendUrl value', function () {
    expect(config.backendUrl).toEqual('https://localhost:3003');
  });

});
