'use strict';

describe('Service: utilities', function () {

  // load the service's module
  beforeEach(module('nasaraCandyBasketApp'));

  // instantiate service
  var utilities;
  beforeEach(inject(function (_utilities_) {
    utilities = _utilities_;
  }));

  it('should remove trailing empty tags if any', function () {
    var tags1 = ['tag1','tag2',''];
    var tags2 = ['tag1','tag2'];
    expect(utilities.removeTrailingEmpty(tags1)).toEqual(['tag1','tag2']);
    expect(utilities.removeTrailingEmpty(tags2)).toEqual(['tag1','tag2']);
  });

  it('should mashup tags counts', function () {
    var tagsByCandies = {'tags_by_candies': [
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
    ]};
    var tagsCounts = {
      'tags': [
        'Ghislain',
        'Hachey',
        'Website',
        'challenge',
        'Dan',
        'McGarry',
        'surprise',
      ],
      'tags_counts': [
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
    };
    expect(utilities.getTagsData(tagsByCandies.tags_by_candies)).toEqual(tagsCounts);
  });

  it('should check if string ends with other string', function () {
    expect(utilities.endsWith('Some string ending with', 'with')).toBe(true);
    expect(utilities.endsWith('Some string ending with', 'with ')).toBe(false);
    expect(utilities.endsWith('Some string ending with', 'h with')).toBe(false);
  });

  it('should check if string contains substring', function () {
    expect(utilities.contains('Some string containing', 'Some')).toBe(true);
    expect(utilities.contains('Some string containing', 'some')).toBe(false);
    expect(utilities.contains('Some string containing', 'oing c')).toBe(false);
    expect(utilities.contains('Some string containing', 'ing c')).toBe(true);
  });     

  it('should compare object date fields returning -1, 0 or 1', function () {
    var obj1 = {'title': 'Some title', 'date': new Date("1995-12-17T03:24:01")};
    var obj2 = {'title': 'Some title', 'date': new Date("1995-12-17T03:24:00")};
    var obj3 = {'title': 'Some title', 'date': new Date("1996-12-17T03:24:00")};
    var obj4 = {'title': 'Some title', 'date': new Date("1997-12-17T03:24:00")};
    var obj5 = {'title': 'Some title', 'date': new Date("1995-12-17T03:23:01")};
    expect(utilities.compareByDates(obj1, obj2)).toBe(1);
    expect(utilities.compareByDates(obj2, obj3)).toBe(-1);
    expect(utilities.compareByDates(obj2, obj2)).toBe(0);
    expect(utilities.compareByDates(obj4, obj5)).toBe(1);
    expect(utilities.compareByDates(obj5, obj4)).toBe(-1);
    expect(utilities.compareByDates(obj2, obj5)).toBe(1);
    expect(utilities.compareByDates(obj5, obj2)).toBe(-1);
  });

});
