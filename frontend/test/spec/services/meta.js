'use strict';

describe('Service: meta', function () {

  // load the service's module
  beforeEach(module('nasaraCandyBasketApp'));

  // instantiate service with a mocked HTTP backend
  var meta, wsUrl, mockedBackend;
  beforeEach(inject(function (_meta_, $httpBackend, ENV) {
    meta = _meta_;
    mockedBackend = $httpBackend;
    wsUrl = ENV.backendUrl;
  }));

  // cleanup
  afterEach(function() {
    mockedBackend.verifyNoOutstandingExpectation();
    mockedBackend.verifyNoOutstandingRequest();
  });

  it('should have a method to return meta data about the service', function () {
    var mockedMetaData = {'name': 'Candy Basket', 'version': 0.3};

    // Expected (fake) backend response
    mockedBackend
      .expectGET(wsUrl)
      .respond(mockedMetaData);

    // Call the actual service API
    var metaDataPromise = meta.getMeta();
    
    // Retrieve result from promise
    var result;
    metaDataPromise.then(function(response) {
      result = response.data;
    });

    // Flush pending request
    mockedBackend.flush();

    expect(result).toEqual(mockedMetaData);
  });

});
