/*jslint browser: true*/
/*global $scope, angular */


define(['angular'], function(angular) {
  'use strict';
  var moduleControllers = angular.module('MenuTopControllers', []);

  moduleControllers.controller('alertCtrl',['$scope','loginSecurity',
    function($scope, security){
        $scope.isAuthenticated = security.isAuthenticated;
    }
  ]);
});
