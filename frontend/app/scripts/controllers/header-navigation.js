'use strict';

/**
 * @ngdoc function
 * @name nasaraCandyBasketApp.controller:HeaderNavigation
 * @description HeaderNavigation's currently sole purpose is to
 * activate and deactivate the navigation menu items CSS.
 */
angular.module('nasaraCandyBasketApp')
  .controller('HeaderNavigation', function ($scope, $location) {

    $scope.isActive = function (viewLocation) { 
      return viewLocation === $location.path();
    };

  });
