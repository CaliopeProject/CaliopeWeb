/*jslint browser: true*/
/*global $scope, angular */

define(['angular'], function(angular) {
  'use strict';

  angular.module('login-directives', ['login-security-services'])
  // The loginToolbar directive is a reusable widget that can show login or logout buttons
  // and information the current authenticated user
  .directive('loginToolbar', ['loginSecurity', function(security) {
    var directive = {
      templateUrl: 'login/partial-login-toolbar.html',
      restrict: 'E',
      replace: true,
      scope: true,
      link: function($scope, $element, $attrs, $controller) {
        $scope.isAuthenticated = security.isAuthenticated;
        $scope.login = security.showLogin;
        $scope.logout = security.logout;
        $scope.$watch(function() {
          return security.currentUser;
        }, function(currentUser) {
          $scope.currentUser = currentUser;
        });
      }
    };
    return directive;
  }]);

});

