/*jslint browser: true*/
/*global $scope*/
define(['angular'], function(angular) {
  'use strict';

  var moduleServices = angular.module('commonServices', []);

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

    // The public API of the service
    return {
      rmValue: removeValue
    };

  }]);

});
