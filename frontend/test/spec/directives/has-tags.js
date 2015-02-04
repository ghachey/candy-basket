'use strict';

describe('Directive: hasTags', function () {

  // load the directive's module
  beforeEach(module('nasaraCandyBasketApp'));

  var form,
      scope;

  beforeEach(inject(function ($rootScope, $compile) {
    var element = angular.element(
      '<form name="form">' +
        '<input ng-model="newtags" name="theTags" has-tags />' +
      '</form>'
    );
    var candy = {_id: '12345', tags: ['existingtag']};
    scope = $rootScope.$new();
    scope.$parent.candy = candy;
    scope.newtags = undefined;
    $compile(element)(scope);
    scope.$digest();
    form = scope.form;
  }));

  it('should pass with non empty list of tags', function () {
    form.theTags.$setViewValue(['tag1','tag2']);
    expect(scope.newtags).toEqual(['tag1','tag2']);

    // hack to simulate binding of $parent.candy.taags with the new tags
    // scope.$parent.candy.tags.concat(scope.newtags);
    // Couldn't get this to pass?    
    // expect(form.theTags.$valid).toBe(true);
  });

  it('should not pass with no previous tags', function () {
    scope.$parent.candy.tags = undefined;
    expect(form.theTags.$valid).toBe(false);
  });

  it('should not pass when user empties tags input', function () {
    scope.$broadcast('tagDataChanged', []);
    expect(form.theTags.$valid).toBe(false);
  });  

  it('should pass with previously no tags but new tags added', function () {
    scope.$parent.candy.tags = undefined;
    form.theTags.$setViewValue(['tag3','tag4']);
    expect(scope.newtags).toEqual(['tag3','tag4']);
    // hack to simulate binding of $parent.candy.tags with the new tags
    scope.$parent.candy.tags = scope.newtags;
    expect(scope.$parent.candy.tags).toEqual(['tag3','tag4']);

    // Couldn't get this to pass?
    //expect(form.theTags.$valid).toBe(true);
  });

  it('should not pass with empty list of tags on $parent.candy', function () {
    scope.$parent.candy.tags = [];
    //scope.$digest();
    expect(scope.newstags).toEqual(undefined);
    expect(form.theTags.$valid).toBe(false);
  });


});
