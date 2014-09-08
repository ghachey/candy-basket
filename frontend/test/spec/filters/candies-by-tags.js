'use strict';

describe('Filter: candiesByTags', function () {

  // TODO - When moving out sorting functionality from this filter
  // don't forget to change tests.

  var candiesSample = [
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
  ];

  var candiesConfirmedSample = [
    {
      '_id': '03c0b670e5c56bfb461a76dcf7009b61',
      'source': 'https://medium.com/the-physics-arxiv-blog/863c05238a41',
      'title': 'Capitalisation -not domestic spending- can get countries out of',
      'description': '<p>Note especially the strong link between healthy</p>',
      'tags': [
        'confirm',
        'dan',
        'economics',
        'health',
        'poverty'
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
        'china',
        'geopolitics',
        'trevz',
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
        'confirm',
        'ict',
        'matt',
        'pacific',
        'tourism'
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
        'china',
        'geopolitics',
        'japan',
        'trevz',
        'usa'
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
  ];

  var candiesConfirmedChinaSample = [
    {
      '_id': '03c0b670e5c56bfb461a76dcf700a467',
      'source': 'http://thediplomat.com/2013/12/maritime-rules-of-the-road/',
      'title': 'Time for US and China to Establish Maritime Rules',
      'description': '<p>So far, there\'s been no repeat of the 2001 collision.</p>',
      'tags': [
        'confirm',
        'china',
        'geopolitics',
        'trevz',
        'usa'
      ],
      'date': '2013-12-04T19:53:45Z',
      'private': false
    },
    {
      '_id': '03c0b670e5c56bfb461a76dcf700af8f',
      'source': 'http://thediplomat.com/chinas-adiz-and-the-japan-us-response/',
      'title': 'Chinaâ€™s ADIZ and the Japan-US response',
      'description': '<p>Japan will need to carefully their response to China</p>',
      'tags': [
        'confirm',
        'china',
        'geopolitics',
        'japan',
        'trevz',
        'usa'
      ],
      'date': '2013-12-09T10:42:40Z',
      'private': false
    }
  ];

  // load the filter's module
  beforeEach(module('nasaraCandyBasketApp'));

  // initialize a new instance of the filter before each test
  var candiesByTags;
  beforeEach(inject(function ($filter) {
    candiesByTags = $filter('candiesByTags');
  }));

  it('should reduce an array of candies to those containing search tags', function () {
    //var searchTags = ['confirm', 'china'];    
    expect(candiesByTags(candiesSample, ['confirm']))
      .toEqual(candiesConfirmedSample);
    expect(candiesByTags(candiesSample, ['confirm','china']))
      .toEqual(candiesConfirmedChinaSample);
    expect(candiesByTags(candiesSample, []))
      .toEqual(candiesSample);
  });

});
