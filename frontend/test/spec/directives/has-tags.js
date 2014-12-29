'use strict';

describe('Directive: hasTags', function () {

  // load the directive's module
  beforeEach(module('nasaraCandyBasketApp'));

  var form,
      scope,
      $timeout;

  beforeEach(inject(function ($rootScope, $compile, _$timeout_) {
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
    $timeout = _$timeout_;
  }));

  it('should pass with non empty list of tags', function () {
    form.theTags.$setViewValue(['tag1','tag2']);
    scope.$digest();
    $timeout.flush();
    expect(scope.newtags).toEqual(['tag1','tag2']);
    expect(form.theTags.$valid).toBe(true);
  });

  it('should not pass with no previous tags', function () {
    scope.$parent.candy.tags = undefined;
    expect(form.theTags.$valid).toBe(false);
  });

  it('should pass with previously no tags but new tags added', function () {
    scope.$parent.candy.tags = undefined;
    form.theTags.$setViewValue(['tag3','tag4']);
    // hack to simulate binding of $parent.candy.tags with the new tags
    scope.$parent.candy.tags = scope.newtags;
    scope.$digest();
    $timeout.flush();
    expect(scope.newtags).toEqual(['tag3','tag4']);
    expect(form.theTags.$valid).toBe(true);
  });

  it('should not pass with empty list of tags on $parent.candy', function () {
    scope.$parent.candy.tags = [];
    scope.$digest();
    $timeout.flush();
    expect(scope.newstags).toEqual(undefined);
    expect(form.theTags.$valid).toBe(false);
  });


});
