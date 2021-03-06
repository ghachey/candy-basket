'use strict';

/**
 * @ngdoc directive
 * @name nasaraCandyBasketApp.directive:taglist
 * @description 
 *
 * This directive started based on the work of Chris Pittman
 * https://github.com/chrispittman/angular-taglist but is quickly
 * diverging to fit our needs. If may be worth packaging into its own
 * module and available as bower angular package for others or look at
 * the development of various community directives with similar
 * features. We may eventually find something better designed and
 * benefit from contributing to a community driven project.
 * 
 * Note on the broadcast on tagDataChanged with this directive. It was
 * a hackish way to get the custom tags input validation working. It
 * was mostly working but could not detect when a previously non-empty
 * tag lists would be completely emptied by the user. Now it can 
 */
angular.module('nasaraCandyBasketApp')
  .directive('taglist', function ($rootScope) {
    return {
      restrict: 'EA',
      replace: true,
      scope: {
        tagData: '=',
        taglistBlurTimeout: '='
      },
      transclude: true,
      template: 
      '<div class="taglist">' + 
        '<span class="tag" data-ng-repeat="tag in tagData" ' + 
              'ng-class="{confirm: \'{{tag}}\' === \'confirm\', ' + 
                         'challenge: \'{{tag}}\' === \'challenge\', ' + 
                         'surprise: \'{{tag}}\' === \'surprise\'}">' + 
          '<a href data-ng-click="tagData.splice($index, 1)">x</a> ' + 
          '<span>{{tag}}</span>' + 
        '</span>' + 
        '<div class="tag-input" ng-transclude></div>' + 
        '<div class="tags_clear"></div>' + 
      '</div>',
      link: function postLink(scope, element) {
        
	// element[0] is <div class="taglist">...</div>
	// <input...>...</input> element
        var input = angular.element(element[0]
                                    .getElementsByTagName('div')[0]
                                    .getElementsByTagName('input')[0]);

	// transforming template
        element.bind('click', function () {
          element[0].getElementsByTagName('input')[0].focus();
        });


        input.bind('keydown', function (e) {

	  if (e.altKey || e.metaKey ||
	      e.ctrlKey || e.shiftKey) {
            return;
	  }

	  if (e.which === 188 || e.which === 13) {
	    // 188 = comma, 13 = return
            e.preventDefault();
            addTag(this);
	  } else if (e.which === 8 && 
                     this.value.trim().length === 0 && 
                     element[0].getElementsByClassName('tag').length > 0) {
            e.preventDefault();
            scope.$apply(function () {
	      scope.tagData.splice(scope.tagData.length - 1, 1);
              $rootScope.$broadcast('tagDataChanged',scope.tagData);
            });
	  }
        });

        function addTag(element) {
          if (!scope.tagData) {
            scope.tagData = [];
          }
          var val = element.value.trim();
          if (val.length === 0) {
            return;
          }
          if (scope.tagData.indexOf(val) >= 0) {
            return;
          }
          scope.$apply(function () {
            scope.tagData.push(val);
            element.value = '';
          });
        }

      }
    };
  });
