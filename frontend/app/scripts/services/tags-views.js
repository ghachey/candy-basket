'use strict';

/**
 * @ngdoc service
 * @name nasaraCandyBasketApp.tagsViews
 * @description
 * # tagsViews
 * Factory in the nasaraCandyBasketApp.
 */
angular.module('nasaraCandyBasketApp')
  .factory('tagsViews', function ($http, ENV) {
    var wsUrl = ENV.backendUrl;

    // Public API here
    return {
      getTags: function () {
        return $http.get(wsUrl + '/basket/candies/tags',
                         {
                           transformResponse: function (data) {
                             return angular.fromJson(data).tags;
                           },
                           isArray: false 
                         });
      },
      getTagsByCandies: function () {
        return $http.get(wsUrl + '/basket/candies/tags-by-candies',
                         {
                           transformResponse: function (data) {
                             return angular.fromJson(data).tagsByCandies;
                           },
                           isArray: false 
                         });
      }
    };
  });
