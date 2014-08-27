'use strict';

/* Services via the Module API */

var services = angular.module('nasaraCandyBasketApp');

services.factory('CandyResourceFactory', function ($resource, config) {
  var candyResource = config.backendUrl + '/basket/candies/:_id';

  /* Return a resource ready for CRUD ops */
  return $resource(candyResource, {}, {

    // Angular comes with default methods on Resource objects, but
    // I opted to explicitly defined mine here for clarity. I also
    // had to override default behavior in some places.
    'query': { method: "GET", isArray: true,
	       transformResponse: function (data) {
                 return angular.fromJson(data).candies_by_id;
	       }
	     },
    'create': { method: "POST" },
    'read': { method: 'GET', params: { _id: "@_id" } },
    'update': { method: 'PUT', params: { _id: "@_id" } },
    'remove': { method: 'DELETE', params: { _id: "@_id" } }
  });

});

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
