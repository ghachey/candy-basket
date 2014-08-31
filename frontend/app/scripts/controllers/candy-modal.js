'use strict';

/**
 * @ngdoc function
 * @name nasaraCandyBasketApp.controller:CandyModal
 * @description
 * # CandyModal
 * Controller of the nasaraCandyBasketApp. It controls all CRUD operations
 * of candies using a modal form. The modal form is powered by
 * angular-ui's ui.bootstrap module. It works in both candy list table
 * and candy list timeline mode.
 * 
 * @see http://angular-ui.github.io/bootstrap/  
 */
angular.module('nasaraCandyBasketApp')
  .controller('CandyModal', function ($scope, 
                                      $rootScope, 
                                      $filter,
                                      $log, 
                                      $modal,  
                                      stateTracker) {

    $scope.open = function (operation, _id) {

      // Following code needed in timeline mode to know what candy we're dealing with
      if (_id === undefined && operation !== 'create') {
        var candies = [];
        var index = stateTracker.state.timelineValues.index;
        var candy_index = index >= 1 ? index - 1 : 0;
        //candies = $filter('candiesByTags')($scope.candies, $scope.tags, $scope.cutoff);
        candies = $filter('candiesByTags')($scope.candies, $scope.tags);
        candies = $filter('orderBy')(candies, 'date', false);
        _id = candies[candy_index]['_id'];
      }

      var modalInstance, modalOptions, logMsg;
      
      var candyModalOperationCallback = function () {
        stateTracker.state.timelineValues['modal_open'] = false;
        $log.info(logMsg + ' candy: ' + new Date());
        $rootScope.$broadcast('model-update');
      };

      var candyModalDismissedCallback = function () {        
        stateTracker.state.timelineValues['modal_open'] = false;
        $log.info('Modal dismissed at: ' + new Date());
      };

      // Clearly some more code duplication to eliminate but could not
      // get it to work and need to move on for now...

      switch (operation) {
      case 'create':
        logMsg = 'Creating new';
        modalOptions = {
          templateUrl: 'candy-save-modal.html',
          controller: SaveCandyInstanceModal,
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
          controller: SaveCandyInstanceModal,
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
          controller: DeleteCandyInstanceModal,
          resolve: {
            operation: function() {return logMsg;},
            candyId: function() {return _id ? _id : undefined;}
          }
        };
        modalInstance = $modal.open(modalOptions);
        modalInstance.result.then(function (modalCandy) {
          modalCandy.$remove(candyModalOperationCallback);
          stateTracker.state.timelineValues.index =
            stateTracker.state.timelineValues.index - 1;
        }, candyModalDismissedCallback);
        break;
      default:
        throw new Error('Candy CRUD Modal controller Error: ', operation);
      }

    }; // end of $scope.open

  });

/**
 * @ngdoc function
 * @name nasaraCandyBasketApp.controller:SaveCandyInstanceModal
 * @description
 * # SaveCandyInstanceModal
 * Controller of the nasaraCandyBasketApp controls how a a single instance
 * of a CandyModal works for saving (creating/updating) candies
 */
var SaveCandyInstanceModal = function ($scope, $modalInstance, operation, candyId,
                                       CandyResource, tagsViews) {
  $scope.operation = operation;
  $scope.tinymceOptions = {
    menubar : false,
    toolbar: "undo redo | styleselect | bold italic | link image"
  };

  $scope.candy = new CandyResource();

  if (candyId) { // We updating?
    $scope.candy.$read({_id: candyId});
  }

  tagsViews.getTags().then(function(response) {
    $scope.tags_data = response.data; // all tags
  }, function(reason){
    // Use to tell user about error retrieving tags for auto-complete
    // Not used yet, but can be easily added to form error message
    // later on
    $scope.tags_error = reason; 
  }); 

  $scope.saveCandy = function () {
    $modalInstance.close($scope.candy);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};

/**
 * @ngdoc function
 * @name nasaraCandyBasketApp.controller:DeleteCandyInstanceModal
 * @description
 * # DeleteCandyInstanceModal
 * Controller of the nasaraCandyBasketApp controls how a a single instance
 * of a CandyModal works for deleting candies
 */
var DeleteCandyInstanceModal = function ($scope, $modalInstance, operation, candyId,
                                         CandyResource) {

  $scope.candy = CandyResource.read({_id: candyId});
  $scope.operation = operation;

  $scope.deleteCandy = function () {
    $modalInstance.close($scope.candy);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

};
