'use strict';

/**
 * @ngdoc function
 * @name nasaraCandyBasketApp.controller:TagCloudModal
 * @description
 * # TagCloudModal
 * Controller of the nasaraCandyBasketApp
 */
angular.module('nasaraCandyBasketApp')
  .controller('TagCloudModal', function ($scope, $rootScope, $modal, $log, $route) {

  // Add tags to search from cloud
  $scope.tagOnClickFunction = function(element){
    console.debug("CLICK:", element);
    if (typeof $scope.tags === 'undefined'){
      $scope.tags = [];
    }
    if (!_.contains($scope.tags,element.text)) {
      $scope.tags.push(element.text);
      // Need digest as we get outside of Angular world when using
      // tag cloud/d3.
      $scope.$digest();
    }
  };

  $scope.open = function () {

    var modalInstance = $modal.open({
      templateUrl: 'welcome.html',
      controller: tagCloudInstanceModal
    });

    modalInstance.result.then(function (newcandy) {
      console.debug("Something here...");
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });

  };
  });

var tagCloudInstanceModal = function ($scope, $modalInstance,
                                         tagsViews, $location) {

  $scope.tagsData = tagsViews.getTags();

  $scope.createNewCandy = function () {
    $modalInstance.close($scope.candy);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};
