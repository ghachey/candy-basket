'use strict';

describe('Directive: tagcloud', function () {

  // load the directive's module
  beforeEach(module('nasaraCandyBasketApp'));

  var element,
      scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('TODO - write test', inject(function ($compile) {
    //element = angular.element('<tagcloud></tagcloud>');
    //element = $compile(element)(scope);
    //expect(element.text()).toBe('this is the tagcloud directive');
    expect(true).toBe(false);
  }));
});
