/* global _ */

'use strict';

/**
 * @ngdoc function
 * @name nasaraCandyBasketApp.controller:SaveCandyInstanceModal
 * @description
 * Controller of the nasaraCandyBasketApp controls how a a single instance
 * of a CandyModal works for saving (creating/updating) candies
 */
angular.module('nasaraCandyBasketApp')
  .controller('SaveCandyInstanceModal', function ($scope, $modalInstance, 
                                                  operation, candyId,
                                                  CandyResource, tagsViews, 
                                                  FileUploader, ENV) {
    $scope.operation = operation;
    $scope.tinymceOptions = {
      menubar : false,
      toolbar: 'undo redo | styleselect | bold italic | link image'
    };

    $scope.candy = new CandyResource();

    if (candyId) { // We updating?
      $scope.candy.$read({_id: candyId});
    }

    tagsViews.getTags().then(function(response) {
      $scope.tagsData = response.data; // all tags
    }, function(reason){
      // Use to tell user about error retrieving tags for auto-complete
      // Not used yet, but can be easily added to form error message
      // later on
      $scope.tagsError = reason; 
    }); 

    ////////////////////////////////////////////////////
    // Putting all the file upload stuff here for now //
    ////////////////////////////////////////////////////

    // Private tracking of what has been uploaded to server async'ly
    var uploadedFiles = []; 
    // The Actual file upload service
    var uploader = $scope.uploader = new FileUploader({
      headers: {
        'Authorization': 'Basic Y2FuZHk6UEA1NXdvcmQ='
      },
      url: ENV.backendUrl + '/files' // Our own NodeJS backend
    });
    // Filters can be added on allowed types of files
    uploader.filters.push({
      name: 'customFilter',
      fn: function(item /*{File|FileLikeObject}*/, options) {
        console.log('item: ', item);
        console.log('options: ', options);
        return this.queue.length < 10;
      }
    });
    // Callbacks (see {@link
    // https://github.com/nervgh/angular-file-upload/wiki/Module-APIñ}
    // for a full API)
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
      console.info('onCompleteItem', fileItem, response, status, headers);
      uploadedFiles.push(response);
    };

    $scope.removeFile = function (filename) {
      if ($scope.candy.files) {
        $scope.candy.files = $scope.candy.files.filter(function(fileObject) {
          return (fileObject.name !== filename);
        });
      }
    };

    $scope.saveCandy = function () {
      // Before closing the modal and saving the candy check files still
      // in the queue (users might have been removing some of them) and
      // compare with ones pushed into uploadedFiles which contains meta
      // data about files already asynchronously uploaded to server
      // successfully. Only keep meta data of files still in the
      // uploader queue and save *that* into CouchDB with candy data.
      var queueNames = _.map(uploader.queue, function(fileItem) {
        return fileItem.file.name;
      });
      var newFiles = _.filter(uploadedFiles, function(fileMeta) {
        return _.contains(queueNames, fileMeta.originalName); 
      });
      $scope.candy.files = ($scope.candy.files) ? 
        $scope.candy.files.concat(newFiles) : $scope.candy.files = newFiles;
      $modalInstance.close($scope.candy);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  });

/**
 * @ngdoc function
 * @name nasaraCandyBasketApp.controller:DeleteCandyInstanceModal
 * @description
 * Controller of the nasaraCandyBasketApp controls how a a single instance
 * of a CandyModal works for deleting candies
 */
angular.module('nasaraCandyBasketApp')
  .controller('DeleteCandyInstanceModal', function ($scope, $modalInstance, 
                                                    operation, candyId,
                                                    CandyResource) {

    $scope.candy = CandyResource.read({_id: candyId});
    $scope.operation = operation;

    $scope.deleteCandy = function () {
      $modalInstance.close($scope.candy);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  });

/**
 * @ngdoc function
 * @name nasaraCandyBasketApp.controller:CandyModal
 * @description
 * Controller of the nasaraCandyBasketApp. It controls all CRUD operations
 * of candies using a modal form. The modal form is powered by
 * angular-ui's ui.bootstrap module. It works in both candy list table
 * and candy list timeline mode.
 * 
 * @see http://angular-ui.github.io/bootstrap/  
 */
angular.module('nasaraCandyBasketApp')
  .controller('CandyModal', function ($scope, 
                                      stateTracker, 
                                      $rootScope, 
                                      $filter, 
                                      $log, 
                                      $modal) {

    $scope.open = function (operation, _id) {

      // Following code needed in timeline mode to know what candy
      // we're dealing with
      if (_id === undefined && operation !== 'create') {
        var candies = [];
        var index = stateTracker.timelineValues.index;
        var candyIndex = index >= 1 ? index - 1 : 0;
        candies = $filter('candiesByTags')($scope.candies, $scope.tags);
        candies = $filter('orderBy')(candies, 'date', false);
        _id = candies[candyIndex]._id;
      }

      var modalInstance, modalOptions, logMsg;
      
      var candyModalOperationCallback = function () {
        /* jshint ignore:start */
        stateTracker.timelineValues.modal_open = false;
        /* jshint ignore:end */
        $log.info(logMsg + ' candy: ' + new Date());
        $rootScope.$broadcast('model-update');
      };

      var candyModalDismissedCallback = function () {        
        /* jshint ignore:start */
        stateTracker.timelineValues.modal_open = false;
        /* jshint ignore:end */
        $log.info('Modal dismissed at: ' + new Date());
      };

      // Clearly some more code duplication to eliminate but could not
      // get it to work and need to move on for now...

      switch (operation) {
      case 'create':
        logMsg = 'Creating new';
        modalOptions = {
          templateUrl: 'candy-save-modal.html',
          controller: 'SaveCandyInstanceModal',
          resolve: {
            operation: function() {return logMsg;},
            candyId: function() {return _id ? _id : undefined;}
          }
        };
        modalInstance = $modal.open(modalOptions);
        /* jshint ignore:start */
        stateTracker.timelineValues.modal_open = true;
        /* jshint ignore:end */       
        modalInstance.result.then(function (modalCandy) {
          modalCandy.$create(candyModalOperationCallback);
        }, candyModalDismissedCallback);
        break;
      case 'edit':
        logMsg = 'Updating existing';
        modalOptions = {
          templateUrl: 'candy-save-modal.html',
          controller: 'SaveCandyInstanceModal',
          resolve: {
            operation: function() {return logMsg;},
            candyId: function() {return _id ? _id : undefined;}
          }
        };
        modalInstance = $modal.open(modalOptions);
        /* jshint ignore:start */
        stateTracker.timelineValues.modal_open = true;
        /* jshint ignore:end */
        modalInstance.result.then(function (modalCandy) {
          modalCandy.$update(candyModalOperationCallback);
        }, candyModalDismissedCallback);
        break;
      case 'delete':
        logMsg = 'Deleting';
        modalOptions = {
          templateUrl: 'candy-delete-modal.html',
          controller: 'DeleteCandyInstanceModal',
          resolve: {
            operation: function() {return logMsg;},
            candyId: function() {return _id ? _id : undefined;}
          }
        };
        modalInstance = $modal.open(modalOptions);
        /* jshint ignore:start */
        stateTracker.timelineValues.modal_open = true;
        /* jshint ignore:end */
        modalInstance.result.then(function (modalCandy) {
          modalCandy.$remove(candyModalOperationCallback);
          stateTracker.timelineValues.index =
            stateTracker.timelineValues.index - 1;
        }, candyModalDismissedCallback);
        break;
      default:
        throw new Error('Candy CRUD Modal controller Error: ', operation);
      }

    }; // end of $scope.open

  });
