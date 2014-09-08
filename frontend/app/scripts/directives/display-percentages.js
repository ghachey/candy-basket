'use strict';

/**
 * @ngdoc directive
 * @name nasaraCandyBasketApp.directive:displayPercentages
 * @description
 * # displayPercentages
 */
angular.module('nasaraCandyBasketApp')
  .directive('displayPercentages', function () {
    return {
      restrict: 'E',
      scope: {
        percentages: '='
      },
      template: '<div tooltip-html-unsafe="{{formatPercentages()}}" ' +
                     'tooltip-placement="bottom">' + 
                  '<progress>' + 
                    '<bar ng-repeat="s in percentages"' +
                         'value="s.value" type="{{s.type}}"></bar>' +
                  '</progress>' +
                '</div>',
      link: function postLink(scope) {

        scope.formatPercentages = function() {
          var confirm = '', challenge = '', surprise = '';

          if (typeof scope.percentages === 'undefined' || 
              scope.percentages.length === 0){
            return 'Calculating...';
          }

          scope.percentages.forEach(function(thisStatus){
            switch (thisStatus.type){
            case 'success':
	      confirm = '<span class="confirm ccs">Confirm</span>&nbsp;' + 
                thisStatus.value + '%';
	      break;
            case 'danger':
	      challenge = '<span class="challenge ccs">Challenge</span>&nbsp;' + 
                thisStatus.value + '%';
	      break;
            case 'warning':
	      surprise = '<span class="surprise ccs">Surprise</span>&nbsp;' + 
                thisStatus.value + '%';
	      break;
            }
          });

          return [confirm,challenge,surprise].join('<br />');
        };

      }
    };
  });
