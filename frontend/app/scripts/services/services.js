'use strict';

/* Services via the Module API */

var services = angular.module('nasaraCandyBasketApp');

services.factory('StateTracker', function ($resource) {
  // This service can be used to share state across various controllers
  // variables that need to be changes can simply be added to state.
  // this service can then be injected where the variables are needed
  var state = {
    timelineValues: {
      index: 0, // i.e. current_slide index
      modal_open: false
    }
  };
  return {
    state: state
  };
});
