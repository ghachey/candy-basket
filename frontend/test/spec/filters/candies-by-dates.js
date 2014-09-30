/* global moment */

'use strict';

describe('Filter: candiesByDates', function () {

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

  // load the filter's module
  beforeEach(module('nasaraCandyBasketApp'));

  // initialize a new instance of the filter before each test
  var candiesByDates;
  beforeEach(inject(function ($filter) {
    candiesByDates = $filter('candiesByDates');
  }));

  it('should return only candies between start and end dates', function () {
    var start1 = moment('2013-11-30T23:02:40Z').unix();
    var start2 = moment('2013-12-04T19:53:45Z').unix();
    var end1 = moment('2013-12-09T10:42:40Z').unix();
    var end2 = moment('2013-12-08T18:03:31Z').unix();

    expect(candiesByDates(candiesSample, start1, end1))
      .toEqual(candiesSample.slice(1,candiesSample.length-1));
    expect(candiesByDates(candiesSample, start2, end2))
      .toEqual(candiesSample.slice(2,candiesSample.length-2));
  });

  it('should return all candies when no start/end dates provided', function () {
    expect(candiesByDates(candiesSample, undefined, undefined))
      .toEqual(candiesSample);
  });

});
