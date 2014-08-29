'use strict';

/**
 * @ngdoc function
 * @name nasaraCandyBasketApp.controller:About
 * @description
 * # About
 * Controller of the nasaraCandyBasketApp
 */
angular.module('nasaraCandyBasketApp')
  .controller('About', function ($scope, $location, meta) {

    meta.getMeta().then(function(response){
      $scope.info = response.data;
    }, function(reason) {
      console.error('Error getting service meta data: ', reason);
    });

    $scope.getStarted = function () {
      $location.path('/candy-list-timeline');
    };

  });
