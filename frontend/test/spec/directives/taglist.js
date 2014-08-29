'use strict';

describe('Directive: taglist', function () {

  // load the directive's module
  beforeEach(module('nasaraCandyBasketApp'));

  var element,
      scope;
  
  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    // element = angular.element('<taglist></taglist>');
    // element = $compile(element)(scope);
    // expect(element.text()).toBe('this is the taglist directive');
    expect(true).toBe(false);
  }));
});
