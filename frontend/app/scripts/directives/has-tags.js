'use strict';

/**
 * @ngdoc directive
 * @name nasaraCandyBasketApp.directive:hasTags
 * @description 
 *
 * A custom validation directive to verify the Candy modal form has
 * tags before submitting. This custom validation directive is a
 * little hackish but mostly because the taglist directive is. The
 * problem is that the validation works on the *input* field but the
 * taglist is an input plus a formatted list of tags in a custom html
 * box. So we can check for validity on each input but this will not
 * detect whether there are already tags or not. This is why the
 * broadcast on the tagData model of the taglist directive was setup
 * and we are listening on it here for changes (to see if it has been
 * emptied by the user).
 */
angular.module('nasaraCandyBasketApp')
  .directive('hasTags', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function postLink(scope, element, attrs, ctrl) {
        var valid;
        var candy = scope.$parent.candy;
        
        // Listen for changes on tagData model
        scope.$on('tagDataChanged', function () {
          if (candy.tags.length === 0) {ctrl.$setValidity('hasTags', false);}
        });

        // Initial check if tags are empty
        if (candy.tags === undefined) {ctrl.$setValidity('hasTags', false);}

        // add a parser that will process each time the value is 
        // parsed into the model when the user updates it.
        ctrl.$parsers.unshift(function(value) {
          // There is no current need in processing this live
          return value;
        });
        
        // add a formatter that will process each time the value 
        // is updated on the DOM element.
        ctrl.$formatters.unshift(function(value) {

          if (value) {
            ctrl.$setValidity('hasTags', true);
          } else {
            ctrl.$setValidity('hasTags', false);
          }

          scope.$parent.$watchCollection('candy.tags', function(olds, news) {
            if (candy.tags) {
              ctrl.$setValidity('hasTags', candy.tags.length);
            }
          });
          
          // return the value or nothing will be written to the DOM.
          return value;
        });

      }
    };
  });
