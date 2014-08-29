'use strict';

/**
 * @ngdoc function
 * @name nasaraCandyBasketApp.controller:CandyListTable
 * @description
 * # CandyListTable
 * Controller of the nasaraCandyBasketApp logic to retrieve and display
 * candies in list table view mode.
 * 
 * TODO - This controller is very similar to the CandyListTimeline controller
 * and they could both be merged into an Javascript prototype
 * only adding properties as they differ eliminating 
 * much code duplication and future errors.
 */
angular.module('nasaraCandyBasketApp')
  .controller('CandyListTable', function ($scope, 
                                          $location, 
                                          CandyResource, 
                                          tagsViews, 
                                          utilities) {

    // Used to maintain a client-side mapping of candy IDs with their
    // list of tags
    var tagsMap = [];

    $scope.candies = CandyResource.query().$promise.then(function(data) {
      $scope.candies = data;
    }, function(errorMessage){
      $scope.error=errorMessage;
    });

    // Register for $broadcast events on rootScope. By doing it this
    // way it will work nicely for the best possible case (low
    // latency, light usage...). What is actually happening is that
    // updates are done on the client side (say when submitting an
    // update modal) and broadcasted also on the client side while the
    // resource updates are being done async. on the server. Extending
    // with proper error handling will become necessary when latency
    // will be high or if the app would ever be subject to highly
    // concurrent and heavy usage scenarios. For instance, someone
    // might try to update a candy that would have been deleted
    // milliseconds before (or up to a second in high latency
    // contexts). This would result in an error code on the REST
    // backend which would need to be nicely reported back to the
    // user.

    $scope.$on('model-update', function(){
      CandyResource.query(function(data){
        $scope.candies = data;
        console.log("Broadcast received");
      });
      tagsViews.getTagsByCandies().then(function(response) {
        tagsMap = response.data.tagsByCandies;
        $scope.tagsData = utilities.getTagsData(tagsMap);
        $scope.ccsTagStatus = utilities.updateStatusCount(
          utilities.getTagsData(tagsMap));
      }, function(errorMessage){
        $scope.error=errorMessage;
      });
    });

    // TODO - Remove this code duplication in a easily testable fashion
    tagsViews.getTagsByCandies().then(function(response) {
      tagsMap = response.data.tagsByCandies;
      $scope.tagsData = utilities.getTagsData(tagsMap);
      $scope.ccsTagStatus = utilities.updateStatusCount(
        utilities.getTagsData(tagsMap));
    }, function(errorMessage){
      $scope.error=errorMessage;
    });

    $scope.tags = [];

    // Watch tags being searched and reduce cloud in consequence
    $scope.$watchCollection('tags', function(newSearch, oldSearch) {
      var newMap = [];

      tagsMap.forEach(function(elem) {
        if (_.isEqual(_.intersection(newSearch, elem.tag), newSearch)) {
          newMap.push(elem);
        }
      });

      if (newMap.length){
        $scope.tagsData = utilities.getTagsData(newMap); // reduce cloud
        $scope.ccsTagStatus = utilities.updateStatusCount(
          utilities.getTagsData(newMap));
      }
      else {
        $scope.tagsData = utilities.getTagsData(tagsMap); // restore cloud
        $scope.ccsTagStatus = utilities.updateStatusCount(
          utilities.getTagsData(tagsMap));
      }
    });

    // Add tags to search from cloud
    $scope.tagOnClickFunction = function(element){
      if (!_.contains($scope.tags,element.text)) {
        $scope.tags.push(element.text);
        // Need digest as we get outside of Angular world when using
        // tag cloud/d3.
        $scope.$digest();
      }
    };

    $scope.tagOnHoverFunction = function(element){
      // Nothing for now...
    };

    // Add tags to search from candy list tags
    $scope.addTag = function(tag) {
      if (!_.contains($scope.tags,tag)) {
        $scope.tags.push(tag);
      }
    };

  });
