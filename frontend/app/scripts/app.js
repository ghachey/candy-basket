'use strict';

// TODO - Change namespacing of modules and properly re-organize

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
    /* Angular modules */
    'ngAnimate', 
    'ngRoute', 
    'ngResource', 
    'ngSanitize',
    /* Third party modules */
    'ui.bootstrap', 
    'ui.tinymce', 
    'ui.slider', 
    /* Our own reusable modules */
    'pippTimelineDirectives'
  ])
  .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
    $routeProvider
      .when('/test', {templateUrl: 'views/main.html',
		      controller: 'MainCtrl'})
      .when('/about', {templateUrl: 'views/about.html'})
      .when('/contact', {templateUrl: 'views/contact.html'})
      .when('/about-candy-service', {templateUrl: 'views/about-candy-service.html',
			       controller: 'About'})
      .when('/candy-list', {templateUrl: 'views/candy-list.html',
			    controller: 'CandyListController'})
      .when('/candy-list-timeline', {templateUrl: 'views/candy-list-timeline.html',
				     controller: 'ResultsTimelineCtrl'})
      .otherwise({redirectTo: '/candy-list-timeline'});

    // http://stackoverflow.com/questions/17289195/angularjs-post-data-to-external-rest-api
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    // Default is application/json which is not handled by the Flask
    // form validation framework out-of-the-box
    //$httpProvider.defaults.headers.post  = {'Content-Type': 'application/x-www-form-urlencoded'};

  }]);
