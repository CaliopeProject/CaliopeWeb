/*jslint browser: true, unparam: true*/
/*global $scope, define*/
define(['angular'], function(angular) {
  'use strict';

  var moduleServices = angular.module('commonServices', []);

  moduleServices.filter('htmlToPlaintext', function() {
    return function(text) {
      return String(text).replace(/<(?:.|\n)*?>/gm, '');
    };
  });

  moduleServices.filter('orderObjectBy', function() {
    return function(items, field, reverse) {
      var filtered = [];
      angular.forEach(items, function(item) {
        filtered.push(item);
      });
      filtered.sort(function (a, b) {
        return (a[field] > b[field]);
      });
      if(reverse){
        filtered.reverse();
      }
      return filtered;
    };
  });


  moduleServices.directive('myFrame', function () {
    return {
      restrict: 'E',
      require: '?ngModel',
      replace: true,
      transclude: true,
      template: '<iframe width="100%" height="730" allowfullscreen webkitallowfullscreen frameborder="0"></iframe>',
      link: function (scope, element, attrs) {
        element.attr('src', attrs.iframeSrc);
      }
    };
  });


  moduleServices.service('toolservices', ['$rootScope', function($rootScope) {

    function parseValue(objvalue){
      var  temobj;
      if(angular.isArray(objvalue)){
        temobj = [];
        angular.forEach(objvalue, function(value, key){
          temobj.push(parseValue(value));
        });
        return  temobj;
      }

      if(angular.isObject(objvalue)){
        temobj = {};
        if(!angular.isUndefined(objvalue.value)){
          return objvalue.value;
        }
        angular.forEach(objvalue, function(value, key){
          temobj[key] = parseValue(value);
        });
        return temobj;
      }
      return objvalue;
    }

    function removeValue(objvalue){
      var temobj;
      if(angular.isObject(objvalue)){
        temobj = {};
        angular.forEach(objvalue, function(value, key){
          temobj[key] = parseValue(value);
        });
      }

      if(angular.isArray(objvalue)){
        temobj = [];
        angular.forEach(objvalue, function(value, key){
          temobj.push(parseValue(value));
        });
      }
      return temobj;
    }

    /**
     * Get the final value of a attribute in a object. Attribute is represented by a string
     * notation that indicate the path to final attribute..
     *
     * @example
     * obj = { "user" : {
     *            "username" : {value : "username"},
     *            "name"  : {value : "NAME USER"}
     *          }
     *       }
     * attName = user.name.value
     * charSplitAttName = '.'
     *
     * Return "NAME USER"
     *
     * @memberOf commonServices
     * @param {object} obj Object with the data
     * @param {string} attName String that represent the attribute final to return value.
     * @param {string} charSplitAttName A character that indicate the separation of attributes in attName,
     * if this is undefined or empty or type is not string then the value by default is '.'.
     * @return {object} The value of attribute, if strAttrValues don't exist then return undefined
     */
    function getValueAttInObject(obj, attName, charSplitAttName) {
      if(charSplitAttName === undefined || typeof charSplitAttName !== 'string' || charSplitAttName.length < 1) {
        charSplitAttName = '.';
      }
      var fieldsValue = attName.split(charSplitAttName);
      var j;
      var objValue = obj;
      for(j=0;j<fieldsValue.length;j++) {
        try {
          objValue = objValue[fieldsValue[j]];
        } catch (ex) {
          objValue = undefined;
        }
      }
      return objValue;
    }

    //Is empty for object, array and string
    function validateEmpty(obj){
      var o;
      // null and undefined are "empty"
      if (obj === null){
        return true;
      }

      // Assume if it has a length property with a non-zero value
      // that that property is correct.
      if (obj.length && obj.length > 0){
        return false;
      }

      if (angular.isNumber(obj)){
        return false;
      }

      if (obj.length === 0){
        return true;
      }

      for (o in obj) {
        if (obj.hasOwnProperty(o)) {
          return false;
        }
      }

      return true;
    }

    // The public API of the service
    return {

      rmValue: removeValue,

      getValueAttInObject: function (obj, attName, charSplitAttName) {
        return getValueAttInObject(obj, attName, charSplitAttName);
      },

      isEmtpy: validateEmpty

    };
  }]);

});
