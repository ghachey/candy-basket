'use strict';

/* Services via the Module API */

var services = angular.module('nasaraCandyBasketApp');

//var wsUrl = 'https://candy.pacificpolicy.org';
var wsUrl = 'http://localhost\\:3003'; // for dev, don't commit
//var wsUrl = 'https://candy-restapi-v1.pacificpolicy.org.vu';

services.factory('MetaFactory', function ($resource) {
  return $resource(wsUrl, {}, {
    query: { method: 'GET',
             transformResponse: function (data) {
               console.log('META: ', data);
               return angular.fromJson(data).meta;
             },
             isArray: false }
  });
});

services.factory('CandyResourceFactory', function ($resource) {
  var candyResource = wsUrl + '/basket/candies/:_id';

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

services.factory('TagsResourceFactory', function ($resource) {
  return $resource(wsUrl + '/basket/candies/tags', {}, {
    query: { method: 'GET',
             transformResponse: function (data) {
               return angular.fromJson(data).tags;
             },
             isArray: false }
  });
});

services.factory('TagsByCandiesResourceFactory', function ($resource) {
  return $resource(wsUrl + '/basket/candies/tags-by-candies', {}, {
    query: { method: 'GET',
             transformResponse: function (data) {
               return angular.fromJson(data).tags_by_candies;
             },
             isArray: false }
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
    state: state,
  };
});
