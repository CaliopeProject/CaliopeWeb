/*jslint browser: true*/
/*global $scope, angular */
define(['angular'], function(angular) {
  'use strict';
  var moduleControllers = angular.module('menu-right-controller', []);

  moduleControllers.controller('menuRightController',['$scope',
    function($scope){
      $scope.message = 'Un texto';
      //insert text body
    }
  ]);
});
