/*jslint browser: true*/
/*global $scope, angular */

define(['angular'], function(angular) {
  'use strict';
  var moduleControllers = angular.module('MenuTopControllers', []);

  moduleControllers.controller('menu-rightController',['$scope',
    function($scope){

      $scope.message = 'Un texto';
      //insert text body
    }
  ]);
});
