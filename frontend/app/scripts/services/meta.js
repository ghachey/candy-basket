'use strict';

/**
 * @ngdoc service
 * @name nasaraCandyBasketApp.meta
 * @description
 * # meta
 * Factory in the nasaraCandyBasketApp.
 */
angular.module('nasaraCandyBasketApp')
  .factory('meta', function ($http, ENV) {
    var wsUrl = ENV.backendUrl;

    // Public API here
    return {
      getMeta: function() {
        return $http.get(wsUrl);
      }
    };
  });
