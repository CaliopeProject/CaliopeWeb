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

    // The public API of the service
    return {
      rmValue: removeValue,
      getValueAttInObject: function (obj, attName, charSplitAttName) {
        return getValueAttInObject(obj, attName, charSplitAttName);
      }
    };

  }]);

});
