/* global _ */

'use strict';

var tagCloudInstanceModal = function ($scope, $modalInstance, tagsViews) {

  $scope.tagsData = tagsViews.getTags();

  $scope.createNewCandy = function () {
    $modalInstance.close($scope.candy);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};

/**
 * @ngdoc function
 * @name nasaraCandyBasketApp.controller:TagCloudModal
 * @description
 * # TagCloudModal
 * Controller of the nasaraCandyBasketApp
 */
angular.module('nasaraCandyBasketApp')
  .controller('TagCloudModal', function ($scope, $rootScope, $modal, $log) {

  // Add tags to search from cloud
  $scope.tagOnClickFunction = function(element){
    if (typeof $scope.tags === 'undefined'){
      $scope.tags = [];
    }
    if (!_.contains($scope.tags, element.text)) {
      $scope.tags.push(element.text);
        // TODO - $apply should really be pushed to relevant directive somehow
      $scope.$apply();
    }
  };

  $scope.open = function () {

    var modalInstance = $modal.open({
      templateUrl: 'welcome.html',
      controller: tagCloudInstanceModal
    });

    modalInstance.result.then(function (newcandy) {
      console.debug('Something here...: ', newcandy);
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });

  };
  });
