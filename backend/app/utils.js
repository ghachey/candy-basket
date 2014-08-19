'use strict';

var _ = require('underscore');

/**
 * @description
 *
 * Utility function to generate list of couchdb url documents
 * that are parent of a given document. It does this by looking
 * at a URL string that follows a convention.
 *
 * @param {String} str URL of the form 'base.software.en-GB'
 * @return {Array} urls URL and all its parent URLs
 *
 */
exports.getParentDocs = function(str){
  var tokens = str.split('.');
  var locale = tokens.pop();
  var urls = [];

  do {
    urls.push(tokens.join('.') + '.' + locale);
    tokens.pop();
  } while (tokens.length >= 1);

  return urls.reverse();
};


/**
 * @description
 *
 * Utility function to merge an array of objects into a single object. The
 * objects are JSON docs comming from CouchDB. They are a collection
 * of related documents (child and it's parent documents). Properties that
 * are present of both child and parents should be merged and take the youngest
 * child value.
 *
 * @param {Array} objectArray An array of objects to merge
 * @return {Object} obj A merged object
 *
 */
exports.mergeObjects = function(objectArray){
  //console.log('Merging objects: ', objectArray);

  return objectArray.reduce(function(previousValue, currentValue){
    var nextValue = {};

    // Look for properties already present and update them with current value
    var currentProps = Object.keys(currentValue);
    var previousProps = Object.keys(previousValue);
    var commonProps = _.intersection(currentProps, previousProps);
    commonProps.forEach(function(prop) {
      nextValue[prop] = currentValue[prop];
    });

    // Add non existing properties (remove commonProps from current/previous)
    currentProps = _.difference(currentProps, commonProps);
    previousProps = _.difference(previousProps, commonProps);
    currentProps.forEach(function(prop) {
      nextValue[prop] = currentValue[prop];
    });
    previousProps.forEach(function(prop) {
      nextValue[prop] = previousValue[prop];
    });
    return nextValue;

  }, {});

};
