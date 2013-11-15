/*jslint browser: true*/
/*global define, console, $*/

define(['angular','login-security-services'], function (angular) {
  'use strict';

  var adminUsers = angular.module('AdminUsersController', ['login-security-services', 'ui.bootstrap']);

  adminUsers.controller("adminUserCtrl", ["$scope", 'loginSecurity'
    ,function($scope, loginSecurity) {

    $scope.$on('login-service-user', function (event, data) {
      $scope.roles = loginSecurity.groups();
    });

  }]);

});
