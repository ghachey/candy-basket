'use strict';

var assert = require('assert');
var utils = require('../../app/utils');

describe('A collection of utilities', function(){

  describe('getParentDocs', function(){
    it('should, from a url list, get all parent urls', function(){
      var sampleUrl = 'base.software.general.en-GB';
      var expectedUrls = [
        'base.en-GB',
        'base.software.en-GB',
        'base.software.general.en-GB'
      ];
      assert.deepEqual(utils.getParentDocs(sampleUrl), expectedUrls);
    });
  });

  describe('mergeObjects', function(){
    it('should merge child and parent objects into a single object', function(){
      var sampleDocs = [
        { // grand-parent
          'title': 'Base title',
          'description': 'Some base description content'},
        { // parent
          'title': 'Second title',
          'subtitle1': 'Sub title1',
          'subtitle2': 'Sub title2'
        },
        { // child
          'title': 'Third title',
          'subtitle1': 'Third Sub title1',
          'link': '/some-link'
        }
      ];
      var expected1 = {
          'description': 'Some base description content',
          'subtitle2': 'Sub title2',
          'title': 'Third title',
          'subtitle1': 'Third Sub title1',
          'link': '/some-link'
      };
      var expected2 = {
          'title': 'Second title',
          'description': 'Some base description content',
          'subtitle1': 'Sub title1',
          'subtitle2': 'Sub title2'
      };
      assert.deepEqual(utils.mergeObjects(sampleDocs), expected1);
      sampleDocs.pop(); 
      assert.deepEqual(utils.mergeObjects(sampleDocs), expected2);
    });
  });

});
