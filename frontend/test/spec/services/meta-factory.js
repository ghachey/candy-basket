'use strict';

describe('Service: metaFactory', function () {

  // load the service's module
  beforeEach(module('nasaraCandyBasketApp'));

  // instantiate service with a mocked HTTP backend
  var metaFactory, wsUrl, mockedBackend;
  beforeEach(inject(function (_metaFactory_, $httpBackend, config) {
    metaFactory = _metaFactory_;
    mockedBackend = $httpBackend;
    wsUrl = config.backendUrl;
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
    var metaDataPromise = metaFactory.getMeta();
    
    // Retrieve result from promise
    var meta;
    metaDataPromise.then(function(response) {
      meta = response.data;
    });

    // Flush pending request
    mockedBackend.flush();

    expect(meta).toEqual(mockedMetaData);
  });

});
