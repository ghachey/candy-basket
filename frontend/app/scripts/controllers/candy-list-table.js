/* global _, async */

'use strict';

/**
 * @ngdoc function
 * @name nasaraCandyBasketApp.controller:CandyListTable
 * @description
 * Controller of the nasaraCandyBasketApp logic to retrieve and display
 * candies in list table view mode.
 * 
 * TODO - This controller is very similar to the CandyListTimeline
 * controller and they could both be merged into an Javascript
 * prototype only adding properties as they differ eliminating much
 * code duplication and future errors.
 */
angular.module('nasaraCandyBasketApp')
  .controller('CandyListTable', function ($scope, 
                                          $location, 
                                          $filter,
                                          CandyResource, 
                                          tagsViews, 
                                          utilities,
                                          $timeout) {

    /////////////////////////////////////////////////
    // Controller private variables and functions  //
    /////////////////////////////////////////////////

    // Controller's own private full list of candies. Currently
    // filtering is done on the whole list everytime. We can't filter
    // on $scope.candies as it is dynamic and candies are lost on each
    // search. For the same reason we also have a private
    // tagsByCandies handy in the controller
    var candies = [];
    var tagsByCandies = [];
    var filterByTags = $filter('candiesByTags');
    var filterByDates = $filter('candiesByDates');

    /**
     * @ngdoc function
     * @name nasaraCandyBasketApp.controller:CandyListTimeline#fetchData
     * @description 
     * is an async function that fetches a fresh copy of
     * data from the backend. It fetches both candies and tags data in
     * parallel before returning results into a doneFetchingData
     * callback. This function is currently execute on start of the
     * application and on CRUD updates ($on('model-update')
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

    /**
     * @ngdoc function
     * @name nasaraCandyBasketApp.controller:CandyListTimeline#filterData
     * @description 
     * is a synchronous function that merely groups a
     * list of repeating operations to avoid duplicate code at various
     * locations in the controller. It primarily filters that candy
     * data set and can optionally set the slide index depending on
     * what called this filtering operation in the first place (e.g. a
     * model-update, a slide change, a tag search)
     */
    var filterData = function() {
      var tempCandies = filterByDates(candies, 
                                      $scope.dateRange[0], 
                                      $scope.dateRange[1]);
      $scope.candies = filterByTags(tempCandies, $scope.tags);
    };

    ///////////////////////////////////////////////////
    // Controller scope variables to drive the view  //
    ///////////////////////////////////////////////////

    // Initialize variables on the scope used to power view dynamically
    $scope.candies = [];
    $scope.candiesLoading = true;
    $scope.tags = [];
    $scope.tagsData = [];
    $scope.tagsLoading = true;
    $scope.dateRange = [undefined, undefined];
    $scope.slider = {
      'options': {
        range: true,
        stop: function (event, ui) { 
          console.log('Slider stopped', event);
          ui.handle.blur(); // focus interferes with timeline navigation
          // Here I thought I could directly use the
          // $scope.sliderRange values on two way binding but I am
          // missing something and could not get it to work so
          // explicitly put the values on their own scope property
          $scope.dateRange = ui.values;
          filterData();
          // $apply should be pushed to directive
          $scope.$apply();
        }
      }
    };

    // Fetch data on controller instantiation, and then assign data on scope 
    fetchData(function() {
      $timeout(function() {
        $scope.candiesLoading = false;
        $scope.tagsLoading = false;
        $scope.candies = candies;
        $scope.tagsData = utilities.getTagsData(tagsByCandies);
        $scope.ccsTagStatus = utilities.updateStatusCount($scope.tagsData);
        // Oldest and newest candies
        var range = utilities.getDateRange(candies);
        $scope.sliderMin = range[0];
        $scope.sliderMax = range[1];
        $scope.sliderStep = 24 * 3600 * 1000; // a day in milliseconds
        $scope.sliderRange = range;
      }, 3000);
    });

    // Listeners
    
    // On model update (CRUD operations) get fresh data
    $scope.$on('model-update', function(){
      fetchData(function() {
        //$scope.candies = candies;
        filterData();
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

      filterData();
      $scope.tagsData = utilities.getTagsData(newMap);
      $scope.ccsTagStatus = utilities.updateStatusCount($scope.tagsData);
    });

    // UI Methods

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
