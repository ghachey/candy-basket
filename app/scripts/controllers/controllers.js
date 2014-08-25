'use strict';

/* Controllers */

var app = angular.module('nasaraCandyBasketApp');

app.controller('MetaController', ['$scope', '$location', 'MetaFactory', function ($scope, $location, MetaFactory) {

  $scope.info = MetaFactory.query();

  // callback for ng-click 'getStarted':
  $scope.getStarted = function () {
    $location.path('/candy-list');
  };

}]);

app.controller('CandyListController', ['$scope', 'CandyResourceFactory', 'TagsResourceFactory', 'TagsByCandiesResourceFactory', '$location', 'utilities', function ($scope, CandyResourceFactory, TagsResourceFactory, TagsByCandiesResourceFactory, $location, utilities) {

  // Used to maintain a client-side mapping of candy IDs with their
  // list of tags
  var tags_map = [];

  // callback for ng-click 'editCandy':
  $scope.editCandy = function (_id) {
    $location.path('/candy-detail/' + _id);
  };

  // callback for ng-click 'deleteCandy':
  $scope.deleteCandy = function (_id) {
    $location.path('/candy-delete/' + _id);
  };

  // callback for ng-click 'createCandy':
  $scope.createNewCandy = function () {
    $location.path('/candy-creation');
  };

  // No need of the explicit use of $promises below, but they will
  // be useful when in need of processing results
  // (i.e. success/errors) as the app grows.

  $scope.candies = CandyResourceFactory.query().$promise.then(function(data) {
    //console.debug("Data: ", data);
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

app.controller('CreateCandyModalCtrl', ['$scope', '$rootScope', '$modal', '$log', '$route', 'CandyResourceFactory', 'StateTracker', function ($scope, $rootScope, $modal, $log, $route, CandyResourceFactory, StateTracker) {

  $scope.open = function () {

    StateTracker.state.timelineValues['modal_open'] = true;

    var modalInstance = $modal.open({
      templateUrl: 'candy-creation-modal.html',
      controller: CreateCandyInstanceModalCtrl
    });

    modalInstance.result.then(function (newcandy) {
      var candy = new CandyResourceFactory(newcandy);
      candy.$create(function () {
        StateTracker.state.timelineValues['modal_open'] = false;
        $log.info('New candy created: ' + new Date());
        $rootScope.$broadcast('model-update');
      });
    }, function () {
      StateTracker.state.timelineValues['modal_open'] = false;
      $log.info('Modal dismissed at: ' + new Date());
    });

  };

}]);

var CreateCandyInstanceModalCtrl = function ($scope, $modalInstance,
                                             TagsResourceFactory, $location) {

  $scope.tinymceOptions = {
    menubar : false,
    toolbar: "undo redo | styleselect | bold italic | link image"
  };

  $scope.candy = {};
  $scope.tags_data = TagsResourceFactory.query();

  $scope.createNewCandy = function () {
    $modalInstance.close($scope.candy);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};

app.controller('DetailCandyModalCtrl', ['$scope', '$rootScope', '$modal', '$log', '$filter', 'CandyResourceFactory', 'StateTracker', '$route', function ($scope, $rootScope, $modal, $log, $filter, CandyResourceFactory, StateTracker, $route) {

  $scope.open = function (_id) {

    var candies         = [];
    var timeline_config = [];

    if (typeof _id === 'undefined'){
      var index = StateTracker.state.timelineValues['index'];
      var candy_index = index >= 1 ? index - 1 : 0;
      //candies = $filter('filterTagsArray')($scope.candies, $scope.tags, $scope.cutoff);
      candies = $filter('filterTagsArray')($scope.candies, $scope.tags);
      candies = $filter('orderBy')(candies, 'date', false);
      _id = candies[candy_index]['_id'];
    }

    StateTracker.state.timelineValues['modal_open'] = true;

    var modalInstance = $modal.open({
      templateUrl: 'candy-detail-modal.html',
      controller: DetailCandyInstanceModalCtrl,
      resolve: {
        candy: function () {
          return CandyResourceFactory.read({_id: _id});
        }
      }
    });

    modalInstance.result.then(function (newcandy) {
      newcandy.$update(function() {
        $log.info('Candy updated: ' + new Date());
        StateTracker.state.timelineValues['modal_open'] = false;
        $rootScope.$broadcast('model-update');
      });
    }, function () {
      StateTracker.state.timelineValues['modal_open'] = false;
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

}]);

var DetailCandyInstanceModalCtrl = function ($scope, $modalInstance,
                                             candy, TagsResourceFactory) {

  $scope.tinymceOptions = {
    menubar : false,
    toolbar: "undo redo | styleselect | bold italic | link image"
  };

  $scope.candy = candy;
  $scope.tags_data = TagsResourceFactory.query();

  $scope.updateCandy = function () {
    $modalInstance.close($scope.candy);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};

app.controller('DeleteCandyModalCtrl', ['$scope', '$rootScope', '$modal', '$route', '$log', '$filter', 'CandyResourceFactory', 'StateTracker', function ($scope, $rootScope, $modal, $route, $log, $filter, CandyResourceFactory, StateTracker) {

  $scope.open = function (_id) {

    var candies = [];

    if (typeof _id === 'undefined'){

      var index = StateTracker.state.timelineValues['index'];
      var candy_index = index >= 1 ? index - 1 : 0;
      //candies = $filter('filterTagsArray')($scope.candies, $scope.tags, $scope.cutoff);
      candies = $filter('filterTagsArray')($scope.candies, $scope.tags);
      candies = $filter('orderBy')(candies, 'date', false);
      _id = candies[candy_index]['_id'];
    }

    var modalInstance = $modal.open({
      templateUrl: 'candy-delete-modal.html',
      controller: DeleteCandyInstanceModalCtrl,
      resolve: {
        candy: function () {
          return CandyResourceFactory.read({_id: _id});
        }
      }
    });

    modalInstance.result.then(function (newcandy) {
      newcandy.$remove(function() {
        $log.info('Candy deleted: ' + new Date());
        $rootScope.$broadcast('model-update');
      });
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });

  };

}]);

var DeleteCandyInstanceModalCtrl = function ($scope, $modalInstance, candy) {

  $scope.candy = candy;

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
  }

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
  }

  $scope.last = function(){
    return $scope.timelineValues['index'] == $scope.timelineData['timeline']['date'].length;
  }

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
