/*jslint browser: true*/
/*global define, $scope, angular */
define(['angular', 'login-security-services'], function(angular) {
  'use strict';
  var moduleControllers = angular.module('login-controllers-form', []);

  moduleControllers.controller('login-controllers-form',['$scope','loginSecurity'
    ,function($scope, security){
      // The model for this form
      $scope.user = {};

      // Any error message from failing to login
      $scope.authError = null;

      // The reason that we are being asked to login - for instance because we tried to access something to which we are not authorized
      // We could do something diffent for each reason here but to keep it simple...
      $scope.authReason = null;
      if ( security.getLoginReason()) {
        $scope.authReason = ( security.isAuthenticated() ) ?
          'No autorizado' :
          'No autenticado';
      }

      // Attempt to authenticate the user specified in the form's model
      $scope.login = function() {
        // Clear any previous security errors
        $scope.authError = null;

        // Try to login
        security.login($scope.user.email, $scope.user.password).then(function(loggedIn) {
          if ( !loggedIn ) {
            // If we get here then the login failed due to bad credentials
            $scope.authError = 'Credenciales invalidas';
          } else {
            $scope.$parent.$broadcast('userAuthenticated');
          }
        }, function(x) {
          // If we get here then there was a problem with the login request to the server
          $scope.authError = 'servidor no responde ' + x;
        });
      };

      $scope.clearForm = function() {
        $scope.user = {};
      };

      $scope.cancelLogin = function() {
        security.cancelLogin();
      };

   }]);
});
