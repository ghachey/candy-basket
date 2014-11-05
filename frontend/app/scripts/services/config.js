'use strict';

/**
 * @ngdoc service
 * @name nasaraCandyBasketApp.config
 * @description
 * # config
 * Factory in the nasaraCandyBasketApp.
 */
angular.module('nasaraCandyBasketApp')
  .factory('config', function () {

    // Production config, the switch is still manual
    //var wsUrl = 'https://candy.pacificpolicy.org';
    //var wsUrl = 'https://candy-restapi-v1.pacificpolicy.org.vu';

    // Pushing the application's config into a injectible
    // service. This will make is easier and cleaner to automate test,
    // development and production workflow.
    
    // Public API here
    return {
      backendUrl: 'https://localhost:3003'
    };
  });
