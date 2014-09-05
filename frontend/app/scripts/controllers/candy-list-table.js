/* global _, async */

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

    /////////////////////////////////////////////////
    // Controller private variables and functions  //
    /////////////////////////////////////////////////

    // Controller's own private full list of candies. Currently
    // filtering is done on the whole list everytime. We can't filter
    // on $scope.candies as it is dynamic and candies are lost on each
    // search. For the same reason we also have a private
    // tagsByCandies handy in the controller
    var candies;
    var tagsByCandies = [];

    /**
     * @ngdoc function
     * @name nasaraCandyBasketApp.controller:CandyListTimeline.fetchData
     * @description
     * # CandyListTimeline.fetchData is an async function that fetches
     * a fresh copy of data from the backend. It fetches both candies
     * and tags data in parallel before returning results into a
     * doneFetchingData callback. This function is currently execute
     * on start of the application and on CRUD updates
     * ($on('model-update')
     *
     * @param {Function} doneFetchingCallback a callback function used
     * to execute some work after fetchData is done
     */
    var fetchData = function(doneFetchingCallBack) {
      async.parallel([
        function(callback){
          CandyResource.query().$promise.then(function(data) {
            candies = data;
            callback(null, 'Candies retrieved');
          }, function(errorMessage){
            $scope.error = errorMessage;
            callback(errorMessage, null);
          });
        },
        function(callback){
          tagsViews.getTagsByCandies().then(function(response) {
            tagsByCandies = response.data.tagsByCandies;
            callback(null, 'Tags retrieved');
          }, function(errorMessage){
            $scope.error = errorMessage;
            callback(errorMessage, null);
          });
        }
      ], function(err, results){
        // Currently not doing anything with err except logging
        if (err) {console.error('Error retrieving data: ', err);}
        // Nor are we using results directly
        console.log(results);
        doneFetchingCallBack();
      });
    };

    ///////////////////////////////////////////////////
    // Controller scope variables to drive the view  //
    ///////////////////////////////////////////////////

    // Initialize variables on the scope used to power view dynamically
    $scope.candies = [];
    $scope.tags = [];
    $scope.tagsData = [];

    // Fetch data on controller instantiation, and then assign data on scope 
    fetchData(function() {
      $scope.candies = candies;
      $scope.tagsData = utilities.getTagsData(tagsByCandies);
      $scope.ccsTagStatus = utilities.updateStatusCount(
        utilities.getTagsData(tagsByCandies));
    });
    
    // On model update (CRUD operations) get fresh data
    $scope.$on('model-update', function(){
      fetchData(function() {
        $scope.candies = candies;
      });
    });

    // Work to perform every time the $scope.tags property changes
    $scope.$watchCollection('tags', function(newSearch) {
      var newMap = [];

      if (newSearch.length > 0) {
        tagsByCandies.forEach(function(elem) {
          if (_.isEqual(_.intersection(newSearch, elem.tag), newSearch)) {
            newMap.push(elem);
          }
        });
      } else {
        newMap = tagsByCandies;
      }

      $scope.tagsData = utilities.getTagsData(newMap);
      $scope.ccsTagStatus = utilities.updateStatusCount(
        utilities.getTagsData(newMap));
    });


    // Add tags to search from cloud
    $scope.tagOnClickFunction = function(element) {
      if (!_.contains($scope.tags, element.text)) {
        $scope.tags.push(element.text);
        // TODO - $apply should really be pushed to relevant directive somehow
        $scope.$apply();
      }
    };

    // Add tags to search from candy list table view tags
    $scope.addTag = function(tag) {
      if (!_.contains($scope.tags,tag)) {
        $scope.tags.push(tag);
      }
    };

  });
