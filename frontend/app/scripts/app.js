'use strict';

/**
 * @ngdoc overview
 * @name narasaCandyBasketApp
 * @description
 * # nasaraCandyBasketApp
 *
 * Main module of the application.
 */
angular
  .module('nasaraCandyBasketApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
