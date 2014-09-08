'use strict';

describe('Directive: displayPercentages', function () {

  // load the directive's module
  beforeEach(module('nasaraCandyBasketApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should replace with live display percentages directive', inject(function ($compile) {

    var ccsTagStatusMock = [
      {'value':70, 'type':'success'},
      {'value':10, 'type':'danger'},
      {'value':20, 'type':'warning'}
    ];

    // Mocked generated output before unsafe conversion
    var mockedOutput = '<div tooltip-html-unsafe="&lt;span class=&quot;confirm ccs&quot;&gt;Confirm&lt;/span&gt;&amp;nbsp;70%&lt;br /&gt;&lt;span class=&quot;challenge ccs&quot;&gt;Challenge&lt;/span&gt;&amp;nbsp;10%&lt;br /&gt;&lt;span class=&quot;surprise ccs&quot;&gt;Surprise&lt;/span&gt;&amp;nbsp;20%" tooltip-placement="bottom" class="ng-scope"><div class="progress ng-isolate-scope" ng-transclude=""><!-- ngRepeat: s in percentages --><div class="progress-bar ng-isolate-scope progress-bar-success" ng-class="type &amp;&amp; \'progress-bar-\' + type" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="" ng-style="{width: percent + \'%\'}" aria-valuetext="70%" ng-transclude="" ng-repeat="s in percentages" value="s.value" type="success" style="width: 70%; "></div><!-- end ngRepeat: s in percentages --><div class="progress-bar ng-isolate-scope progress-bar-danger" ng-class="type &amp;&amp; \'progress-bar-\' + type" role="progressbar" aria-valuenow="10" aria-valuemin="0" aria-valuemax="" ng-style="{width: percent + \'%\'}" aria-valuetext="10%" ng-transclude="" ng-repeat="s in percentages" value="s.value" type="danger" style="width: 10%; "></div><!-- end ngRepeat: s in percentages --><div class="progress-bar ng-isolate-scope progress-bar-warning" ng-class="type &amp;&amp; \'progress-bar-\' + type" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="" ng-style="{width: percent + \'%\'}" aria-valuetext="20%" ng-transclude="" ng-repeat="s in percentages" value="s.value" type="warning" style="width: 20%; "></div><!-- end ngRepeat: s in percentages --></div></div>';

    scope.ccsTagStatus = ccsTagStatusMock;

    element = angular.element('<display-percentages percentages="ccsTagStatus">'+
                              '</display-percentages>');
    element = $compile(element)(scope);
    // Manual digest
    scope.$digest();

    expect(element.html()).toBe(mockedOutput);
  }));
});
