'use strict';

/**
 * @ngdoc function
 * @name nasaraCandyBasketApp.controller:CandyListTimeline
 * @description
 * # CandyListTimeline
 * Controller of the nasaraCandyBasketApp contains the logic to power the 
 * candy list in timeline mode.
 * 
 * TODO - This controller is very similar to the CandyListTimeline controller
 * and they could both be merged into an Javascript prototype
 * only adding properties as they differ eliminating 
 * much code duplication and future errors.
 */
angular.module('nasaraCandyBasketApp')
  .controller('CandyListTimeline', function ($scope, 
                                             $location, 
                                             $filter, 
                                             CandyResource, 
                                             tagsViews, 
                                             stateTracker, 
                                             utilities) {

    var tagsMap          = [];
    var timelineItems    = [];
    var now               = new Date();
    var ranges            = {
      "day"   : 1000 * 3600 * 24,
      "week"  : 1000 * 3600 * 24 * 7,
      "month" : 1000 * 3600 * 24 * 30,
      "year"  : 1000 * 3600 * 24 * 365
    };

    $scope.candies        = [];
    $scope.timelineValues = stateTracker.state.timelineValues; // i.e. {index: 0}

    $scope.changeSlide = function (index) {
      console.log("Changing slide index to: ", index);
      $scope.timelineValues.index = index;
    };

    // These should be set-able, storable via the UI
    // Additionally, I'd like us to think about how to set the default $scope.min,
    // and $scope.max dates in to the first and last candy dates. Currently, there's
    // a double bug, wherein $scope.min is set too far in the past, and $scope.max is
    // set to Date.now(), which allows the user to pull up an empty data set
    // (and throw an unhandled exception in the bargain).
    $scope.min = now - ranges.year;
    $scope.max = Date.now();
    $scope.step = ranges.day;
    $scope.interval = ranges.month * 2;
    $scope.cutoff = now - (ranges.month * 6); //$scope.min

    $scope.setDates  = function(){
      var dateVal    = new Date($scope.cutoff);
      var options = {year: "numeric", month: "long", day: "numeric"};
      var dateString = dateVal.toLocaleString('en-GB', options);
      return "Restrict results to candies created since: <br /><strong>" + dateString + "</strong>";
    };

    $scope.slideStart = function (event, ui){
      // noop
      return;
    };

    $scope.slideStop = function (event, ui){
      var newMap = [];

      tagsMap.forEach(function(elem) {
        if (_.isEqual(_.intersection($scope.tags, elem.tag),$scope.tags)) {
          newMap.push(elem);
        }
      });

      if (newMap.length){
        //$scope.tagsData = utilities.getTagsData(newMap, $scope.cutoff); // reduce cloud
        //$scope.ccsTagStatus = utilities.updateStatusCount(utilities.getTagsData(newMap, $scope.cutoff));
        $scope.tagsData = utilities.getTagsData(newMap); // reduce cloud
        $scope.ccsTagStatus = utilities.updateStatusCount(utilities.getTagsData(newMap));
        $scope.changeSlide(0);
        $scope.timelineData = processTimeline($scope.candies);
      }
      else {
        // $scope.tagsData = utilities.getTagsData(tagsMap, $scope.cutoff); // restore cloud
        // $scope.ccsTagStatus = utilities.updateStatusCount(utilities.getTagsData(tagsMap, $scope.cutoff));
        $scope.tagsData = utilities.getTagsData(tagsMap); // restore cloud
        $scope.ccsTagStatus = utilities.updateStatusCount(utilities.getTagsData(tagsMap));
      }

    };

    $scope.slideMove = function(event, ui) {
      console.log("Slide move ui: ", ui);
      console.log("Slide mode event: ", event);
      $scope.cutoff = ui.value;
    };

    $scope.displayPercentages = function(){
      var confirm = '', challenge = '', surprise = '';

      if (typeof $scope.ccsTagStatus === 'undefined' || $scope.ccsTagStatus.length === 0){
        return 'Calculating...';
      }

      $scope.ccsTagStatus.forEach(function(this_status){
        switch (this_status.type){
        case 'success':
	  confirm = '<span class="confirm ccs">Confirm</span>&nbsp;' + this_status.value + '%';
	  break;
        case 'danger':
	  challenge = '<span class="challenge ccs">Challenge</span>&nbsp;' + this_status.value + '%';
	  break;
        case 'warning':
	  surprise = '<span class="surprise ccs">Surprise</span>&nbsp;' + this_status.value + '%';
	  break;
        }
      });

      return [confirm,challenge,surprise].join("<br />");

    };

    $scope.get_candies = CandyResource.query().$promise.then(function(data) {
      //data.sort(compareByDates);
      $scope.candies = data;
      // When the timelineData is processed (anytime it mutates) there is no need to
      // explicitly change the current_index it will default to the current state
      // of the index provided by the stateTracker which has a two way binding with the
      // angular-timelinejs directive. Of course, the current slide index can be forced
      // changed anytime in the controller through $scope.changeSlide callback.
      // Likewise, when explicitly forcing a current_slide index change the timeline
      // will be reloaded so no need to do it explicitly. However, note that
      // when only force changing the current slide index the timeline will
      // be reloaded but it will be the same timeline data source; this may or
      // may not be desired. For example, when sliding the ui-slider slide
      // you would want to reset the current index to 0 *and* reload a new
      // timeline source data. In this case you would need both
      // $scope.changeSlide *and* $scope.timelineData = processTimeline(data)
      // with data being the newly filtered data from the since cutoff.
      // I would like to simplify this behavior in the future
      $scope.timelineData = processTimeline(data);
    }, function(errorMessage){
      $scope.error=errorMessage;
    });

    $scope.$on('model-update', function(){
      CandyResource.query(function(data){
        $scope.candies = data;
        $scope.timelineData = processTimeline(data);
      });
      tagsViews.getTagsByCandies(function(response) {
        // Reset mapping of candy IDs and their tags on
        // broadcasted created and update events
        tagsMap = response.data.tagsByCandies;
        // Perform reduce with new mapping
        $scope.tagsData = utilities.getTagsData(tagsMap);
        $scope.ccsTagStatus = utilities.updateStatusCount(utilities.getTagsData(tagsMap));
      });
      console.log("INDEX on model update: ", $scope.timelineValues.index);
      $scope.changeSlide($scope.timelineValues.index);
    });


    var processTimeline = function (data){

      timelineItems = [];
      var candies    = [];
      var min_date   = new Date();
      var max_date   = new Date(1990); // need to ensure we get a real maximum from the set

      //candies = $filter('candiesByTags')($scope.candies, $scope.tags, $scope.cutoff);
      candies = $filter('candiesByTags')($scope.candies, $scope.tags);

      candies.forEach(function(this_candy){
        var comp_date  = new Date(Date.parse(this_candy['date']));
        var tag        = _.find(this_candy['tags'], function(i) {return i == 'confirm' ||
                                                                 i == 'challenge' ||
                                                                 i == 'surprise';});
        var candy_tags = this_candy['tags'];

        min_date       = min_date < comp_date ? min_date : comp_date;
        max_date       = max_date < comp_date ? comp_date : max_date;

        timelineItems.push(
          {
            "_id"      : this_candy['_id'],
            "startDate": this_candy['date'],
            "headline" : this_candy['title'],
            "text"     : candy_tags + '|ENDTAGS|' + this_candy['description'],
            "tag"      : tag,
            "asset"    : {"media": this_candy['source']}
          }
        );
      });

      var num_candies = utilities.pluralise(candies.length.toString() + " candy", "candies");
      var timelineData = {
        "timeline":
        {
          "headline"       : num_candies + " in this basket ",
          "type"           :"default",
          "text"           :"<p>Here is a timeline of your results...</p>",
          "date"           : timelineItems,
          "era": [
            {
              "startDate":min_date,
              "endDate": max_date,
              "headline":"Story duration",
              "text":"<p>hmmm</p>"
            }
          ]
        }
      };

      return timelineData;

    };

    $scope.$watchCollection('tags', function(newSearch, oldSearch) {
      var newMap = [];
      tagsMap.forEach(function(elem) {
        if (_.isEqual(_.intersection(newSearch, elem.tag), newSearch)) {
          newMap.push(elem);
        }
      });
      if (newMap.length){
        // $scope.tagsData = utilities.getTagsData(newMap, $scope.cutoff); // reduce cloud
        // $scope.ccsTagStatus = utilities.updateStatusCount(utilities.getTagsData(newMap, $scope.cutoff));
        $scope.tagsData = utilities.getTagsData(newMap); // restore cloud
        $scope.ccsTagStatus = utilities.updateStatusCount(utilities.getTagsData(newMap));

        // Explicit reset to 0 when searching. otherwise, reload of new timelineData
        // will be with the current slide index
        $scope.changeSlide(0);
        $scope.timelineData = processTimeline($scope.candies);
      }
      else {
        // $scope.tagsData = utilities.getTagsData(tagsMap, $scope.cutoff); // restore cloud
        // $scope.ccsTagStatus = utilities.updateStatusCount(utilities.getTagsData(tagsMap, $scope.cutoff));
        $scope.tagsData = utilities.getTagsData(tagsMap); // restore cloud
        $scope.ccsTagStatus = utilities.updateStatusCount(utilities.getTagsData(tagsMap));
      }
    });

    // Add tags to search from cloud. Same here. if we find ourselves boiler platting
    // maybe a cloudService which would watch, add tags to search, dance disco...
    $scope.tagOnClickFunction = function(element){
      if (!_.contains($scope.tags,element.text)) {
        $scope.tags.push(element.text);
        // Need digest as we get outside of Angular world when using
        // tag cloud/d3.
        $scope.$digest();
      }
    };

    tagsViews.getTagsByCandies().then(function(response) {
      // Initial mapping of candy IDs and their tags as they come
      // out of the REST service.
      tagsMap = response.data.tagsByCandies;
      // Initialise tagsData (i.e. tag mapping reduced to unique
      // tags and tag counts) attached to scope for two-way binding
      // $scope.tagsData = utilities.getTagsData(tagsMap, $scope.cutoff);
      // $scope.ccsTagStatus = utilities.updateStatusCount(utilities.getTagsData(tagsMap, $scope.cutoff));
      $scope.tagsData = utilities.getTagsData(tagsMap); // restore cloud
      $scope.ccsTagStatus = utilities.updateStatusCount(
        utilities.getTagsData(tagsMap));
    }, function(errorMessage){
      $scope.error=errorMessage;
    });

    $scope.tags = [];

    // Add tags to search from candy list tags
    $scope.addTag = function(tag) {
      console.log("Click timeline tag: ", tag);
      if (!_.contains($scope.tags,tag)) {
        $scope.tags.push(tag);
      }
    };

    // Are these even being used? In any case, I refactored them to work
    // with new code. NOT TESTED.
    $scope.first = function(){
      return $scope.timelineValues['index'] == 0;
    };

    $scope.last = function(){
      return $scope.timelineValues['index'] == 
        $scope.timelineData['timeline']['date'].length;
    };
  });
