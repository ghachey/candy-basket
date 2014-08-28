'use strict';

/**
 * @ngdoc service
 * @name nasaraCandyBasketApp.stateTracker
 * @description 
 * # stateTracker 
 * Factory in the nasaraCandyBasketApp. This service can be used to share state
 * across various controllers' variables. It was born mainly because of the 
 * large impedance mismatch between Angular and TimelineJS which are hard to
 * get to work nice together in an Angular way. If this grows significantly 
 * overall design must be revised.
 */
angular.module('nasaraCandyBasketApp')
  .factory('stateTracker', function () {
    var state = {
      timelineValues: {
        index: 0, // i.e. current_slide index
        modal_open: false
      }
    };

    // Public API
    return {
      state: state
    };
  });
