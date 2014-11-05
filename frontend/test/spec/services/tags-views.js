'use strict';

describe('Service: tagsViews', function () {

  // load the service's module
  beforeEach(module('nasaraCandyBasketApp'));

  // instantiate service with mocked http backend
  var tagsViews, wsUrl, mockedBackend;
  beforeEach(inject(function (_tagsViews_, $httpBackend, ENV) {
    tagsViews = _tagsViews_;
    mockedBackend = $httpBackend;
    wsUrl = ENV.backendUrl;
  }));

  // cleanup
  afterEach(function() {
    mockedBackend.verifyNoOutstandingExpectation();
    mockedBackend.verifyNoOutstandingRequest();
  });

  it('should provide a list of tags', function () {
    var mockedTagsData = {
      'tags' : {
        'tags': [
          'Ghislain',
          'Hachey',
          'Website',
          'challenge',
          'Dan',
          'McGarry',
          'surprise',
        ],
        'tagsCounts': [
          {
            'count': 1,
            'word': 'Ghislain'
          },
          {
            'count': 1,
            'word': 'Hachey'
          },
          {
            'count': 2,
            'word': 'Website'
          },
          {
            'count': 1,
            'word': 'challenge'
          },
          {
            'count': 1,
            'word': 'Dan'
          },
          {
            'count': 1,
            'word': 'McGarry'
          },
          {
            'count': 1,
            'word': 'surprise'
          }
        ]
      }
    };

    // Expected (fake) backend response
    mockedBackend
      .expectGET(wsUrl+'/basket/candies/tags')
      .respond(mockedTagsData);

    // Call the actual service API
    var tagsPromise = tagsViews.getTags();
    
    // Retrieve result from promise
    var tags;
    tagsPromise.then(function(response) {
      tags = response.data;
    });

    // Flush pending request
    mockedBackend.flush();

    expect(tags).toEqual(mockedTagsData.tags);
  });

  it('should provide a list of tags by candies', function () {
    var mockedTagsByCandiesData = {
      'tagsByCandies': {
        'tagsByCandies': [
          {
            'candy_id': 'bd79168f4137232c9714102a08000591',
            'date': '2013-10-09T11:59:57Z',
            'tag': ['Ghislain', 'Hachey', 'Website', 'challenge']
          },
          {
            'candy_id': 'bd79168f4137232c9714102a0800094d',
            'date': '2013-10-10T11:59:08Z',
            'tag': ['Dan', 'McGarry', 'Website', 'surprise']
          }
        ]}
    };

    // Expected (fake) backend response
    mockedBackend
      .expectGET(wsUrl+'/basket/candies/tags-by-candies')
      .respond(mockedTagsByCandiesData);

    // Call the actual service API
    var tagsByCandiesPromise = tagsViews.getTagsByCandies();
    
    // Retrieve result from promise
    var tagsByCandies;
    tagsByCandiesPromise.then(function(response) {
      tagsByCandies = response.data;
    });

    // Flush pending request
    mockedBackend.flush();

    expect(tagsByCandies).toEqual(mockedTagsByCandiesData.tagsByCandies);
  });

});
