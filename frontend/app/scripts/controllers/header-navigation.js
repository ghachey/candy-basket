'use strict';

/**
 * @ngdoc function
 * @name nasaraCandyBasketApp.controller:HeaderNavigation
 * @description HeaderNavigation's currently sole purpose is to
 * activate and deactivate the navigation menu items CSS.
 */
angular.module('nasaraCandyBasketApp')
  .controller('HeaderNavigation', function ($scope, $rootScope, $location, stateTracker) {

    $scope.loc = $location;
    $scope.switcher = {
      'view': stateTracker.switcherView
    };

    $scope.$watch('switcher.view', function(newView) {
      $location.path('/'+newView);
      stateTracker.switcherView = newView;
    });

    $scope.$watch('loc.path()', function(){
      var url = $scope.loc.path();
      if (url === '/candy-list-timeline' || url === '/candy-list-table') {
        $scope.switcher.view = url.slice(1);
      } else if (url === '/') { // redirect to whatever last state is
        $location.path('/'+$scope.switcher.view);
      }
    });

    // to set active class on <li>elements</li>
    $scope.isActive = function (viewLocation) { 
      if (viewLocation === '/candy-list-*') { // bit of a hack!
        return '/candy-list-timeline' === $location.path() || 
          '/candy-list-table' === $location.path();
      } 
      return viewLocation === $location.path();
    };

  });
