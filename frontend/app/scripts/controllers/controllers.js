'use strict';

/* Controllers */

var app = angular.module('nasaraCandyBasketApp');

app.controller('MetaController', ['$scope', '$location', 'MetaFactory', function ($scope, $location, MetaFactory) {

  $scope.info = MetaFactory.query();
  $scope.getStarted = function () {
    $location.path('/candy-list-timeline');
  };

}]);

app.controller('CandyListController', ['$scope', 'CandyResourceFactory', 'TagsResourceFactory', 'TagsByCandiesResourceFactory', '$location', 'utilities', function ($scope, CandyResourceFactory, TagsResourceFactory, TagsByCandiesResourceFactory, $location, utilities) {

  // Used to maintain a client-side mapping of candy IDs with their
  // list of tags
  var tags_map = [];

  $scope.candies = CandyResourceFactory.query().$promise.then(function(data) {
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
    CandyResourceFactory.query(function(data){
      $scope.candies = data;
      console.log("Broadcast received", $scope.candies);
    });
    TagsByCandiesResourceFactory.query(function(data) {
      // Reset mapping of candy IDs and their tags on
      // broadcasted created and update events
      tags_map = data.tags_by_candies;
      // Perform reduce with new mapping
      $scope.tags_data = utilities.getTagsData(tags_map);
      $scope.ccs_tag_status = utilities.update_status_count(utilities.getTagsData(tags_map));
    }, function(errorMessage){
      $scope.error=errorMessage;
    });
  });

  // Not making use of Angular's Resource here so maybe service
  // should be changes to use low level http request instead of
  // the higher level resource. I guess it will depend on how
  // this evolves: will we ever take advantage of a full REST point
  // for tags or do we simply just pull all and process right here.

  TagsByCandiesResourceFactory.query().$promise.then(function(data) {
    // Initial mapping of candy IDs and their tags as they come
    // out of the REST service.
    tags_map = data.tags_by_candies;
    // Initialise tags_data (i.e. tag mapping reduced to unique
    // tags and tag counts) attached to scope for two-way binding
    $scope.tags_data = utilities.getTagsData(tags_map);
    $scope.ccs_tag_status = utilities.update_status_count(utilities.getTagsData(tags_map));
  }, function(errorMessage){
    $scope.error=errorMessage;
  });

  $scope.tags = [];

  // Watch tags being searched and reduce cloud in consequence
  $scope.$watchCollection('tags', function(newSearch, oldSearch) {
    var new_map = [];

    tags_map.forEach(function(elem) {
      if (_.isEqual(_.intersection(newSearch, elem.tag),newSearch)) {
        new_map.push(elem);
      }
    });

    if (new_map.length){
      $scope.tags_data = utilities.getTagsData(new_map); // reduce cloud
      $scope.ccs_tag_status = utilities.update_status_count(utilities.getTagsData(new_map));
    }
    else {
      $scope.tags_data = utilities.getTagsData(tags_map); // restore cloud
      $scope.ccs_tag_status = utilities.update_status_count(utilities.getTagsData(tags_map));
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

}]);

app.controller('CandyModalCtrl', ['$scope', '$rootScope', '$modal', '$log', '$route', 'CandyResourceFactory', 'StateTracker', '$filter', function ($scope, $rootScope, $modal, $log, $route, CandyResourceFactory, StateTracker, $filter) {

  // Handles all Candy CRUD operations, both in timeline view and table list view

  $scope.open = function (operation, _id) {

    // Following code needed in timeline mode to know what candy we're dealing with
    if (_id === undefined && operation !== 'create') {
      var candies = [];
      var index = StateTracker.state.timelineValues['index'];
      var candy_index = index >= 1 ? index - 1 : 0;
      //candies = $filter('filterTagsArray')($scope.candies, $scope.tags, $scope.cutoff);
      candies = $filter('filterTagsArray')($scope.candies, $scope.tags);
      candies = $filter('orderBy')(candies, 'date', false);
      _id = candies[candy_index]['_id'];
    }

    var modalInstance, modalOptions, logMsg;
    
    var candyModalOperationCallback = function () {
      StateTracker.state.timelineValues['modal_open'] = false;
      $log.info(logMsg + ' candy: ' + new Date());
      $rootScope.$broadcast('model-update');
    };

    var candyModalDismissedCallback = function () {        
      StateTracker.state.timelineValues['modal_open'] = false;
      $log.info('Modal dismissed at: ' + new Date());
    };

    // Clearly some more code duplication to eliminate but could not
    // get it to work and need to move on for now...

    switch (operation) {
    case 'create':
      logMsg = 'Creating new';
      modalOptions = {
        templateUrl: 'candy-save-modal.html',
        controller: SaveCandyInstanceModalCtrl,
        resolve: {
          operation: function() {return logMsg;},
          candyId: function() {return _id ? _id : undefined;}
        }
      };
      modalInstance = $modal.open(modalOptions);
      modalInstance.result.then(function (modalCandy) {
        modalCandy.$create(candyModalOperationCallback);
      }, candyModalDismissedCallback);
      break;
    case 'edit':
      logMsg = 'Updating existing';
      modalOptions = {
        templateUrl: 'candy-save-modal.html',
        controller: SaveCandyInstanceModalCtrl,
        resolve: {
          operation: function() {return logMsg;},
          candyId: function() {return _id ? _id : undefined;}
        }
      };
      modalInstance = $modal.open(modalOptions);
      modalInstance.result.then(function (modalCandy) {
        modalCandy.$update(candyModalOperationCallback);
      }, candyModalDismissedCallback);
      break;
    case 'delete':
      logMsg = 'Deleting';
      modalOptions = {
        templateUrl: 'candy-delete-modal.html',
        controller: DeleteCandyInstanceModalCtrl,
        resolve: {
          operation: function() {return logMsg;},
          candyId: function() {return _id ? _id : undefined;}
        }
      };
      modalInstance = $modal.open(modalOptions);
      modalInstance.result.then(function (modalCandy) {
        modalCandy.$remove(candyModalOperationCallback);
      }, candyModalDismissedCallback);
      break;
    default:
      throw new Error('Candy CRUD Modal controller Error: ', operation);
    }

  };

}]);

// TODO - Could probably consolidate the two instance modal below into one

var SaveCandyInstanceModalCtrl = function ($scope, $modalInstance, operation, candyId,
                                           CandyResourceFactory, TagsResourceFactory) {

  $scope.tinymceOptions = {
    menubar : false,
    toolbar: "undo redo | styleselect | bold italic | link image"
  };
  $scope.candy = new CandyResourceFactory();
  if (candyId) { // We updating?
    $scope.candy.$read({_id: candyId});
  }
  $scope.tags_data = TagsResourceFactory.query();
  $scope.operation = operation;

  $scope.saveCandy = function () {
    $modalInstance.close($scope.candy);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};


var DeleteCandyInstanceModalCtrl = function ($scope, $modalInstance, operation, candyId,
                                            CandyResourceFactory) {

  $scope.candy = new CandyResourceFactory();
  $scope.candy.$read({_id: candyId});
  $scope.operation = operation;

  $scope.deleteCandy = function () {
    $modalInstance.close($scope.candy);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

};

app.controller('ResultsTimelineCtrl', ['$scope', '$location', '$filter', 'CandyResourceFactory', 'TagsByCandiesResourceFactory', 'StateTracker', 'utilities', 'filterTagsArrayFilter', function ($scope, $location, $filter, CandyResourceFactory, TagsByCandiesResourceFactory, StateTracker, utilities, filterTagsArrayFilter) {

  var tags_map          = [];
  var timeline_items    = [];
  var now               = new Date();
  var ranges            = {
    "day"   : 1000 * 3600 * 24,
    "week"  : 1000 * 3600 * 24 * 7,
    "month" : 1000 * 3600 * 24 * 30,
    "year"  : 1000 * 3600 * 24 * 365
  };

  $scope.candies        = [];
  $scope.timelineValues = StateTracker.state.timelineValues; // i.e. {index: 0}

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

  $scope.set_dates  = function(){
    var date_val    = new Date($scope.cutoff);
    var options = {year: "numeric", month: "long", day: "numeric"};
    var date_string = date_val.toLocaleString('en-GB', options);
    return "Restrict results to candies created since: <br /><strong>" + date_string + "</strong>";
  };

  $scope.slideStart = function (event, ui){
    // noop
    return;
  };

  $scope.slideStop = function (event, ui){
    var new_map = [];

    tags_map.forEach(function(elem) {
      if (_.isEqual(_.intersection($scope.tags, elem.tag),$scope.tags)) {
        new_map.push(elem);
      }
    });

    if (new_map.length){
      //$scope.tags_data = utilities.getTagsData(new_map, $scope.cutoff); // reduce cloud
      //$scope.ccs_tag_status = utilities.update_status_count(utilities.getTagsData(new_map, $scope.cutoff));
      $scope.tags_data = utilities.getTagsData(new_map); // reduce cloud
      $scope.ccs_tag_status = utilities.update_status_count(utilities.getTagsData(new_map));
      $scope.changeSlide(0);
      $scope.timelineData = processTimeline($scope.candies);
    }
    else {
      // $scope.tags_data = utilities.getTagsData(tags_map, $scope.cutoff); // restore cloud
      // $scope.ccs_tag_status = utilities.update_status_count(utilities.getTagsData(tags_map, $scope.cutoff));
      $scope.tags_data = utilities.getTagsData(tags_map); // restore cloud
      $scope.ccs_tag_status = utilities.update_status_count(utilities.getTagsData(tags_map));
    }

  };

  $scope.slideMove = function(event, ui) {
    console.log("Slide move ui: ", ui);
    console.log("Slide mode event: ", event);
    $scope.cutoff = ui.value;
  };

  $scope.displayPercentages = function(){
    var confirm = '', challenge = '', surprise = '';

    if (typeof $scope.ccs_tag_status === 'undefined' || $scope.ccs_tag_status.length === 0){
      return 'Calculating...';
    }

    $scope.ccs_tag_status.forEach(function(this_status){
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

  $scope.get_candies = CandyResourceFactory.query().$promise.then(function(data) {
    console.log('TEST BEFORE: ', data);
    console.log('TEST UTIL: ', utilities);
    //data.sort(compareByDates);
    console.log('TEST BEFORE: ', data);
    $scope.candies = data;
    // When the timelineData is processed (anytime it mutates) there is no need to
    // explicitly change the current_index it will default to the current state
    // of the index provided by the StateTracker which has a two way binding with the
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
    CandyResourceFactory.query(function(data){
      $scope.candies = data;
      $scope.timelineData = processTimeline(data);
    });
    TagsByCandiesResourceFactory.query(function(data) {
      // Reset mapping of candy IDs and their tags on
      // broadcasted created and update events
      tags_map = data.tags_by_candies;
      // Perform reduce with new mapping
      $scope.tags_data = utilities.getTagsData(tags_map);
      $scope.ccs_tag_status = utilities.update_status_count(utilities.getTagsData(tags_map));
    });
    console.log("INDEX on model update: ", $scope.timelineValues.index);
    $scope.changeSlide($scope.timelineValues.index);
  });


  var processTimeline = function (data){

    timeline_items = [];
    var candies    = [];
    var min_date   = new Date();
    var max_date   = new Date(1990); // need to ensure we get a real maximum from the set

    //candies = $filter('filterTagsArray')($scope.candies, $scope.tags, $scope.cutoff);
    candies = $filter('filterTagsArray')($scope.candies, $scope.tags);
    console.log("Candies after filter: ", candies);

    candies.forEach(function(this_candy){
      var comp_date  = new Date(Date.parse(this_candy['date']));
      var tag        = _.find(this_candy['tags'], function(i) {return i == 'confirm' ||
                                                               i == 'challenge' ||
                                                               i == 'surprise'});
      var candy_tags = this_candy['tags'];

      min_date       = min_date < comp_date ? min_date : comp_date;
      max_date       = max_date < comp_date ? comp_date : max_date;

      timeline_items.push(
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
    var data = {
      "timeline":
      {
        "headline"       : num_candies + " in this basket ",
        "type"           :"default",
        "text"           :"<p>Here is a timeline of your results...</p>",
        "date"           : timeline_items,
        "era": [
          {
            "startDate":min_date,
            "endDate": max_date,
            "headline":"Story duration",
            "text":"<p>hmmm</p>",
          }
        ]
      }
    };
    console.log("Timeline processed data: ", data);

    return data;

  };

  $scope.$watchCollection('tags', function(newSearch, oldSearch) {
    var new_map = [];
    tags_map.forEach(function(elem) {
      if (_.isEqual(_.intersection(newSearch, elem.tag), newSearch)) {
        new_map.push(elem);
      }
    });
    if (new_map.length){
      // $scope.tags_data = utilities.getTagsData(new_map, $scope.cutoff); // reduce cloud
      // $scope.ccs_tag_status = utilities.update_status_count(utilities.getTagsData(new_map, $scope.cutoff));
      $scope.tags_data = utilities.getTagsData(new_map); // restore cloud
      $scope.ccs_tag_status = utilities.update_status_count(utilities.getTagsData(new_map));

      // Explicit reset to 0 when searching. otherwise, reload of new timelineData
      // will be with the current slide index
      $scope.changeSlide(0);
      $scope.timelineData = processTimeline($scope.candies);
    }
    else {
      // $scope.tags_data = utilities.getTagsData(tags_map, $scope.cutoff); // restore cloud
      // $scope.ccs_tag_status = utilities.update_status_count(utilities.getTagsData(tags_map, $scope.cutoff));
      $scope.tags_data = utilities.getTagsData(tags_map); // restore cloud
      $scope.ccs_tag_status = utilities.update_status_count(utilities.getTagsData(tags_map));
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

  TagsByCandiesResourceFactory.query().$promise.then(function(data) {
    // Initial mapping of candy IDs and their tags as they come
    // out of the REST service.
    tags_map = data.tags_by_candies;
    // Initialise tags_data (i.e. tag mapping reduced to unique
    // tags and tag counts) attached to scope for two-way binding
    // $scope.tags_data = utilities.getTagsData(tags_map, $scope.cutoff);
    // $scope.ccs_tag_status = utilities.update_status_count(utilities.getTagsData(tags_map, $scope.cutoff));
    $scope.tags_data = utilities.getTagsData(tags_map); // restore cloud
    $scope.ccs_tag_status = utilities.update_status_count(utilities.getTagsData(tags_map));
    console.log("Tags initial data: ", tags_map);
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

}]);


app.controller('tagCloudModalCtl', ['$scope', '$rootScope', '$modal', '$log', '$route', 'TagsResourceFactory', function ($scope, $rootScope, $modal, $log, $route, TagsResourceFactory) {

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
      controller: tagCloudInstanceModalCtl
    });

    modalInstance.result.then(function (newcandy) {
      console.debug("Something here...");
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });

  };

}]);

var tagCloudInstanceModalCtl = function ($scope, $modalInstance,
                                         TagsResourceFactory, $location) {

  $scope.tags_data = TagsResourceFactory.query();

  $scope.createNewCandy = function () {
    $modalInstance.close($scope.candy);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};
