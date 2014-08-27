'use strict';

/**
 * @ngdoc service
 * @name nasaraCandyBasketApp.metaFactory
 * @description
 * # metaFactory
 * Factory in the nasaraCandyBasketApp.
 */
angular.module('nasaraCandyBasketApp')
  .factory('metaFactory', function ($http, config) {
    var wsUrl = config.backendUrl;

    // Public API here
    return {
      getMeta: function() {
        return $http.get(wsUrl);
      }
    };
  });
