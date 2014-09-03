'use strict';

/**
 * @ngdoc service
 * @name nasaraCandyBasketApp.CandyResource
 * @description
 * # CandyResource
 * Factory in the nasaraCandyBasketApp.
 */
angular.module('nasaraCandyBasketApp')
  .factory('CandyResource', function ($resource, config) {
    var candyResourceWs = config.backendUrl + '/basket/candies/:_id';

    /* Return a resource ready for RESTful CRUD operations */
    return $resource(candyResourceWs, {}, {

      // Angular comes with default methods on Resource objects, but
      // I opted to explicitly define ours here for clarity. Default behavior was
      // overridden for the query method.
      'query': { method: 'GET', isArray: true, // after transformation
	         transformResponse: function (data) {
                   return angular.fromJson(data).candiesById;
	         }
	       },
      'create': { method: 'POST' },
      'read': { method: 'GET', params: { _id: '@_id' } },
      'update': { method: 'PUT', params: { _id: '@_id' } },
      'remove': { method: 'DELETE', params: { _id: '@_id' } }
    });

  });
