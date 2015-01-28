'use strict';

/**
 * @ngdoc overview
 * @name narasaCandyBasketApp
 * @description
 *
 * Main module of the application. Here is where frontend routes are
 * defined along with some configuration global to the application. It
 * is also where all the dependencies and declared and
 * injected. Services, filters, controllers and directives are added
 * to this very module in their own respective files for
 * organizational purposes only.
 */
angular
  .module('nasaraCandyBasketApp', [
    /* Angular modules */
    'ngAnimate',
    'ngCookies',
    'ngResource', 
    'ngRoute', 
    'ngSanitize',
    'ngTouch',
    /* Third party modules */
    'ui.bootstrap', 
    'ui-templates',
    'ui.tinymce', 
    'ui.slider',
    'angularFileUpload',
    /* Our own reusable modules */
    'pippTimelineDirectives',
    'config'
  ])
  .config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
    $routeProvider
      .when('/about-candy-service', {templateUrl: 'views/about-candy-service.html',
			             controller: 'About'})
      .when('/candy-list-table', {templateUrl: 'views/candy-list-table.html',
			          controller: 'CandyListTable'})
      .when('/candy-list-timeline', {templateUrl: 'views/candy-list-timeline.html',
				     controller: 'CandyListTimeline'})
      .when('/', {controller: 'HeaderNavigation'})
      .when('/about', {templateUrl: 'views/about.html'})
      .when('/contact', {templateUrl: 'views/contact.html'})
      .otherwise({redirectTo: '/'});

    // http://stackoverflow.com/questions/17289195/angularjs-post-data-to-external-rest-api
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    // Authentication header is set for every single request on the backend API
    // It currently only uses Basic Authentication and it is absolutely necessary to
    // encrypt all communication for this in production
    $httpProvider.defaults.headers.common.Authorization = 'Basic Y2FuZHk6UEA1NXdvcmQ=';

    // Default is application/json which is not handled by the Flask
    // form validation framework out-of-the-box
    //$httpProvider.defaults.headers.post  = {'Content-Type': 'application/x-www-form-urlencoded'};

  }]);
