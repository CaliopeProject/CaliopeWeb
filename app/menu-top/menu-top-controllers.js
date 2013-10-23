/*jslint browser: true*/
/*global $scope, angular */


define(['angular','login-security-services'], function(angular) {
  'use strict';
  var moduleControllers = angular.module('MenuTopControllers', []);

  moduleControllers.controller('alertCtrl',['$scope','loginSecurity',
    function($scope, security){
        $scope.isAuthenticated = security.isAuthenticated;
    }
  ]);
});
