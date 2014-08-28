'use strict';

describe('Service: candyResource', function () {

  // load the service's module
  beforeEach(module('nasaraCandyBasketApp'));

  // instantiate service with mocked http backend
  var candyResource, candyResourceWs, mockedBackend;
  beforeEach(inject(function (_candyResource_, $httpBackend, config) {
    candyResource = _candyResource_;
    mockedBackend = $httpBackend;
    candyResourceWs = config.backendUrl;
  }));

  // cleanup
  afterEach(function() {
    mockedBackend.verifyNoOutstandingExpectation();
    mockedBackend.verifyNoOutstandingRequest();
  });

  it('should retrieve a list of candies by ID', function () {
    var mockedCandiesData = {
      'candies_by_id': [
        {
          '_id': '03c0b670e5c56bfb461a76dcf70091c7',
          'source': 'https://getsyme.com/#',
          'title': 'SYME - encrypted social network',
          'description': '<p>Kind of like Policy Circles, and soon to be open.</p>',
          'tags': [
            'social media',
            'internet',
            'surveillance',
            'security',
            'ict',
            'dan',
            'surprise'
          ],
          'date': '2013-11-30T22:51:41Z',
          'private': false
        },
        {
          '_id': '03c0b670e5c56bfb461a76dcf7009b61',
          'source': 'https://medium.com/the-physics-arxiv-blog/863c05238a41',
          'title': 'Capitalisation -not domestic spending- can get countries out of',
          'description': '<p>Note especially the strong link between healthy</p>',
          'tags': [
            'health',
            'economics',
            'poverty',
            'dan',
            'confirm'
          ],
          'date': '2013-11-30T23:02:40Z',
          'private': false
        },
        {
          '_id': '03c0b670e5c56bfb461a76dcf700a467',
          'source': 'http://thediplomat.com/2013/12/maritime-rules-of-the-road/',
          'title': 'Time for US and China to Establish Maritime Rules',
          'description': '<p>So far, there\'s been no repeat of the 2001 collision.</p>',
          'tags': [
            'confirm',
            'trevz',
            'geopolitics',
            'china',
            'usa'
          ],
          'date': '2013-12-04T19:53:45Z',
          'private': false
        },
        {
          '_id': '03c0b670e5c56bfb461a76dcf700a84d',
          'source': 'http://mashable.com/?utm_cid=mash-com-fb-main-link',
          'title': 'Hawaii Tops 10 Most-Searched Travel Destinations',
          'description': '<p>The full list of global travel destinations searched</p>',
          'tags': [
            'tourism',
            'pacific',
            'confirm',
            'matt',
            'ict'
          ],
          'date': '2013-12-08T18:03:31Z',
          'private': false
        },
        {
          '_id': '03c0b670e5c56bfb461a76dcf700af8f',
          'source': 'http://thediplomat.com/chinas-adiz-and-the-japan-us-response/',
          'title': 'Chinaâ€™s ADIZ and the Japan-US response',
          'description': '<p>Japan will need to carefully their response to China</p>',
          'tags': [
            'confirm',
            'geopolitics',
            'china',
            'usa',
            'japan',
            'trevz'
          ],
          'date': '2013-12-09T10:42:40Z',
          'private': false
        },
        {
          '_id': '03c0b670e5c56bfb461a76dcf700bafe',
          'source': 'http://paper.people.com.cn/rmrb/nw.D110000renmrb_20131210_5-21.htm',
          'title': 'Iran and the six countries to discuss the implementation details',
          'description': '<p>The Iran miniter says the country\'s military experts',
          'tags': [
            'confirm',
            'geopolitics',
            'security',
            'trevz'
          ],
          'date': '2013-12-10T15:20:10Z',
          'private': false
        }
      ]
    };

    // Expected (fake) backend response
    mockedBackend
      .expectGET(candyResourceWs+'/basket/candies')
      .respond(mockedCandiesData);

    // Call the actual service API
    var candyResourceList = candyResource.query();

    // Retrieve result from embedded promise
    var candies;
    candyResourceList.$promise.then(function(data) {
      candies = data;
    }, function(errorMessage){
      console.error('Error: ', errorMessage);
    });

    // Flush pending request
    mockedBackend.flush();

    // Zip items together so they can easily be tested, will look something like
    // [[candieResourceFromService,candieDataExpected],
    //  [candieResourceFromService,candieDataExpected],...]
    var candiesTuples = _.zip(candies, mockedCandiesData.candies_by_id);

    candiesTuples.forEach(function(candyTuple) {
      expect(candyTuple[0]._id).toEqual(candyTuple[1]._id);
      expect(candyTuple[0].source).toEqual(candyTuple[1].source);
      expect(candyTuple[0].description).toEqual(candyTuple[1].description);
      expect(candyTuple[0].title).toEqual(candyTuple[1].title);
      expect(candyTuple[0].date).toEqual(candyTuple[1].date);
      expect(candyTuple[0].tags).toEqual(candyTuple[1].tags);
    });

  });

  it('should retrieve a single candy from it\'s ID', function () {
    var mockedCandyData = {
      '_id':'03c0b670e5c56bfb461a76dcf70091c7',
      '_rev':'2-feb4c62a78cf16e4e320775fa1edbee4',
      'description':'<p>Kind of like Policy Circles, and soon to be open-sourced.',
      'title':'SYME - encrypted social network',
      'private':false,
      'source':'https://getsyme.com/#',
      'date':'2013-11-30T22:51:41Z',
      'tags':['social media','internet','surveillance','security','ict','dan','surprise']
    };

    // Expected (fake) backend response
    mockedBackend
      .expectGET(candyResourceWs+'/basket/candies/03c0b670e5c56bfb461a76dcf70091c7')
      .respond(mockedCandyData);


    // Call the actual service API
    var candyResourceObj = candyResource.read({'_id': '03c0b670e5c56bfb461a76dcf70091c7'});
 
    // Retrieve result from embedded promise
    var candy;
    candyResourceObj.$promise.then(function(data) {
      candy = data;
    });

    // Flush pending request
    mockedBackend.flush();

    expect(candy._id).toEqual(mockedCandyData._id);
    expect(candy.source).toEqual(mockedCandyData.source);
    expect(candy.description).toEqual(mockedCandyData.description);
    expect(candy.title).toEqual(mockedCandyData.title);
    expect(candy.date).toEqual(mockedCandyData.date);
    expect(candy.tags).toEqual(mockedCandyData.tags);
  });

  it('should create a new candy', function () {
    var mockedNewCandyData = {
      'description':'<p>Kind of like Policy Circles, and soon to be open-sourced.',
      'title':'SYME - encrypted social network',
      'private':false,
      'source':'https://getsyme.com/#',
      'date':'2013-11-30T22:51:41Z',
      'tags':['social media','internet','surveillance','security','ict','dan','surprise']
    };

    // Expected (fake) backend response
    mockedBackend
      .expectPOST(candyResourceWs+'/basket/candies', mockedNewCandyData)
      .respond(mockedNewCandyData);

    // Call the actual service API
    var candyResourceObj = new candyResource();

    // Manually feed candy data into the new Resource object
    candyResourceObj.source = mockedNewCandyData.source;
    candyResourceObj.title = mockedNewCandyData.title;
    candyResourceObj.description = mockedNewCandyData.description;
    candyResourceObj.private = mockedNewCandyData.private;
    candyResourceObj.date = mockedNewCandyData.date;
    candyResourceObj.tags = mockedNewCandyData.tags;

    expect(candyResourceObj).toBeDefined();

    var createdPromise = candyResourceObj.$create();

    // Get data from resolved promise
    var response = createdPromise.then(function(data){
      response = data;
    });

    // Flush pending request
    mockedBackend.flush();

    expect(response._id).toEqual(mockedNewCandyData._id);
    expect(response.source).toEqual(mockedNewCandyData.source);
    expect(response.description).toEqual(mockedNewCandyData.description);
    expect(response.title).toEqual(mockedNewCandyData.title);
    expect(response.date).toEqual(mockedNewCandyData.date);
    expect(response.tags).toEqual(mockedNewCandyData.tags);
  });

  // it('should update an existing candy', function () {
  //   var mockedExistingCandy = {
  //     '_id':'03c0b670e5c56bfb461a76dcf70091c7',
  //     '_rev':'2-feb4c62a78cf16e4e320775fa1edbee4',
  //     'description':'<p>Kind of like Policy Circles, and soon to be open-sourced.',
  //     'title':'SYME - encrypted social network',
  //     'private':false,
  //     'source':'https://getsyme.com/#',
  //     'date':'2013-11-30T22:51:41Z',
  //     'tags':['social media','internet','surveillance','security','ict','dan','surprise']
  //   };

  //   var updatedCandy = {
  //     'description':'<p>Updated Kind of like Policy Circles, and soon to be open.',
  //     'title':'Updated - SYME - encrypted social network',
  //     'private':false,
  //     'source':'https://getsyme.com/updated',
  //     'date':'2013-11-30T22:51:41Z',
  //     'tags':['social media','internet','surveillance','security','ict','dan','surprise']
  //   };

  //   // Expected (fake) backend response
  //   mockedBackend
  //     .expectGET(candyResourceWs+'/basket/candies/03c0b670e5c56bfb461a76dcf70091c7')
  //     .respond(mockedExistingCandy);

  //   // Call the actual service API
  //   var candyToUpdate = candyResource.read({'_id': '03c0b670e5c56bfb461a76dcf70091c7'});

  //   // Flush pending request
  //   mockedBackend.flush();

  //   mockedBackend
  //     .expectPUT(candyResourceWs+'/basket/candies/03c0b670e5c56bfb461a76dcf70091c7', 
  //                updatedCandy)
  //     .respond(updatedCandy);

  //   candyToUpdate.description = '<p>Updated Kind of like Policy Circles, and soon to be open.';
  //   candyToUpdate.title = 'Updated - SYME - encrypted social network';
  //   candyToUpdate.source = 'https://getsyme.com/updated';

  //   expect(candyToUpdate).toBeDefined();

  //   var updatedPromise = candyResource.update(
  //     {'_id': '03c0b670e5c56bfb461a76dcf70091c7'},
  //     updatedCandy);

  //   // Get data from resolved promise
  //   var response = updatedPromise.then(function(data){
  //     response = data;
  //   });

  //   // Flush pending request
  //   mockedBackend.flush();

  //   expect(response._id).toEqual(updatedCandy._id);
  //   expect(response.source).toEqual(updatedCandy.source);
  //   expect(response.description).toEqual(updatedCandy.description);
  //   expect(response.title).toEqual(updatedCandy.title);
  //   expect(response.date).toEqual(updatedCandy.date);
  //   expect(response.tags).toEqual(updatedCandy.tags);
  // });

});
