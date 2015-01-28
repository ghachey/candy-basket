'use strict';

/**
 * @ngdoc service
 * @name nasaraCandyBasketApp.stateTracker
 * @description # stateTracker Factory in the
 * nasaraCandyBasketApp. This service can be used to share state
 * across various controllers' variables. It was born mainly because
 * of the large impedance mismatch between Angular and TimelineJS
 * which are hard to get to work nice together in an Angular way. If
 * this grows significantly overall design must be revised. It's also
 * useful to carry state information across controllers
 */
angular.module('nasaraCandyBasketApp')
  .factory('stateTracker', function () {
    var timelineValues = {
        index: 0, // i.e. current_slide index in TimelineJS
        /* jshint ignore:start */
        modal_open: false // this must go against convention...for now.
        /* jshint ignore:end */
      };

    // Public API
    return {
      timelineValues: timelineValues,
      switcherView: 'candy-list-timeline'
    };
  });
