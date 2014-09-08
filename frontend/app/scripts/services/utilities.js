/* global _ */

'use strict';

/**
 * @ngdoc service
 * @name nasaraCandyBasketApp.utilities
 * @description
 * # utilities
 * Factory in the nasaraCandyBasketApp.
 */
var utilities = angular.module('nasaraCandyBasketApp');

utilities.factory('utilities', function () {

  /**
   * @name removeTrailingEmpty
   * @description
   * Removes any trailing empty tags
   * 
   * @param {Array} arr of tags
   * @return {Array} arr of tags without trailing empty tag
   */
  var removeTrailingEmpty = function(arr) {
    if (arr.indexOf('') > -1) {
      arr.splice(arr.indexOf(''), 1);
    }
    return arr;
  };

  /**
   * @name getTagsData
   * @description
   * Function that takes as input tags by candies and returns a
   * objects with a tag list and tags with their respective
   * counts. See unit tests for details.
   * 
   * TODO - This should not include a cutoff here as it mixes two
   * functionalities and become less general. The cutoff operation
   * should be chained as separate function
   * 
   * @param {Object} data an object containing a list of candy IDs
   * with their respective tags
   * @return {Object} result object containing a list of tags along
   * with a list of tags with their respective counts.
   */
  var getTagsData = function(data, cutoff) {
    var tags        = [];
    var tagsCounts = [];
    var start       = {'tags': tags, 'tagsCounts': tagsCounts};
    var subset      = [];

    cutoff  = typeof cutoff  !== 'undefined' ? cutoff  : 0;

    var incWordCount = function(tagsCounts, tag) {
      tagsCounts.forEach(function(elem) {
        if (_.isEqual(elem.word, tag)) {
	  elem.count++;
	  return;
        }
      });
    };

    data.forEach(function(item){
      var compDate = new Date(Date.parse(item.date));
      if (compDate >= cutoff){
        subset.push(item);
      }
    });

    if (subset.length < 1){
      // console.debug ('Nothing here...');
      return start;
    }

    /**
     Reduce from input data to desired output.
     */
    var result = _.reduce(subset, function(memory, object) {

      var candyTags = object.tag;
      var processed  = {};

      // Go through array of tags of current object being reduced
      candyTags.forEach(function(tag) {
        // Add tag if not present
        if (!_.contains(memory.tags, tag)) {
	  tags.push(tag);
	  tagsCounts.push({'count': 1, 'word': tag});
	  processed = {
	    'tags': tags,
	    'tagsCounts': tagsCounts
	  };
        } else { // Update its count if present
	  incWordCount(tagsCounts,tag);
	  processed =  {
	    'tags': tags,
	    'tagsCounts': tagsCounts
	  };
        }
      });
      return processed;
    }, start);

    return result;
  };

  /**
   * TODO - Remove in favour of JS'  Array.isArray()
   * 
   * But do all tests on functions that depend on this first
   * Utility to check whether an object is an array or not
   */
  var isArray = function(obj) {
    if( Object.prototype.toString.call( obj ) === '[object Array]' ) {
      return true;
    }
    return false;
  };

  /**
   * Keep this around until ECMASCRIPT 6
   */
  var endsWith = function (str, sub) {
    return str.length >= sub.length && str.substr(str.length - sub.length) === sub;
  };

  /**
   * Keep this around until ECMASCRIPT 6
   */
  var contains = function(str, sub) {
    return str.indexOf(sub) !== -1;
  };

  var updateStatusCount = function(tagData){

    var ccsTagStatus = [
      {'value':0, 'type':'success'},
      {'value':0, 'type':'danger'},
      {'value':0, 'type':'warning'}
    ];

    var confirm = 0, challenge = 0, surprise = 0;
    var tagsCounts = typeof tagData.tagsCounts !== undefined ? 
          tagData.tagsCounts : [];

    tagsCounts.forEach(function(thisCount){
      switch (thisCount.word){
      case 'confirm':
        confirm+=thisCount.count;
        break;
      case 'challenge':
        challenge+=thisCount.count;
        break;
      case 'surprise':
        surprise+=thisCount.count;
        break;
      default:
        break;
      }
    });

    var total = confirm + challenge + surprise;
    var precision = 1;
    var aggr = 0;

    if (total){
      ccsTagStatus.forEach(function(thisStatus){
        var num = 0;
        switch (thisStatus.type){
        case 'success':
	  num = confirm/total;
	  thisStatus.value = num.toPrecision(precision) * 100;
	  break;
        case 'danger':
	  num = challenge/total;
	  thisStatus.value = num.toPrecision(precision) * 100;
	  break;
        case 'warning':
	  num = surprise/total;
	  thisStatus.value = num.toPrecision(precision) * 100;
	  break;
        }

        aggr += num.toPrecision(precision) * 100;

      });

      if (aggr > 100){
        ccsTagStatus[0].value -= (aggr - 100);
      }
      if (aggr < 100){
        ccsTagStatus[0].value += (100 - aggr);
      }

    }

    return ccsTagStatus;
  };

  var pluralise =  function(s, pl){
    var n= parseFloat(s);
    if(isNaN(n) || Math.abs(n)=== 1) {return s;}
    if(!pl) {return s+'s';}
    return s.replace(/\S+(\s*)$/, pl+'$1');
  };

  /**
   * @name compareByDates
   * @description Function to be used in a Array.sort methods to
   * sort a list of object containing a date property used in the
   * comparison
   * 
   * @param {Object} a an object containing date property with a
   * Date objects or valid Date String which can be used to
   * instantiate a new Date object
   * @param {Object} b same as a
   * @return {Number} -1 if a is smaller than b, 1 if a is larger
   * than b, 0 if both are equal
   */
  var compareByDates = function (a, b) {
    if (a.date < b.date) {
      return -1;
    }
    if (a.date > b.date) {
      return 1;
    }
    return 0;
  };

  /**
   * @name processTimeline
   * @description   
   *
   * A function whose sole purpose is to take a list of candies and
   * transform this into an object ready to pass to a TimelineJS
   * instance. See {@link
   * https://github.com/ghachey/angular-timelinejs} and {@link
   * https://github.com/ghachey/TimelineJS}.
   * 
   * @param {Object} candies a list of candies objects
   * @return {Object} timelineData an object ready for a TimelineJS instance
   */
  var processTimeline = function(candies) {
    var timelineItems = [];
    var minDate   = new Date();
    var maxDate   = new Date(1990); // ensure we get a real maximum from the set

    candies.forEach(function(thisCandy){
      var compDate  = new Date(Date.parse(thisCandy.date));
      var tag       = _.find(thisCandy.tags, function(i) {
        return i === 'confirm' || i === 'challenge' || i === 'surprise';
      });
      var candyTags = thisCandy.tags;

      minDate       = minDate < compDate ? minDate : compDate;
      maxDate       = maxDate < compDate ? compDate : maxDate;

      timelineItems.push(
        {
          '_id'      : thisCandy._id,
          'startDate': thisCandy.date,
          'headline' : thisCandy.title,
          'text'     : candyTags + '|ENDTAGS|' + thisCandy.description,
          'tag'      : tag,
          'asset'    : {'media': thisCandy.source}
        }
      );
    });

    var numCandies = pluralise(candies.length.toString() + ' candy', 'candies');

    var timelineData = {
      'timeline':
      {
        'headline'       : numCandies + ' in this basket ',
        'type'           : 'default',
        'text'           : '<p>Here is a timeline of your results...</p>',
        'date'           : timelineItems,
        'era': [
          {
            'startDate': minDate,
            'endDate': maxDate,
            'headline': 'Story duration',
            'text': '<p>hmmm</p>'
          }
        ]
      }
    };
    
    return timelineData;
  };


  // Public API here
  return {
    removeTrailingEmpty: removeTrailingEmpty,
    getTagsData: getTagsData,
    isArray: isArray,
    endsWith: endsWith,
    contains: contains,
    updateStatusCount: updateStatusCount,
    pluralise: pluralise,
    compareByDates: compareByDates,
    processTimeline: processTimeline
  };

});
