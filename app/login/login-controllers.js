define(['angular'], function(angular) {
  'use strict';

  var moduleControllers = angular.module('LoginControllers', []);
  
  moduleControllers.controller('LoginCtrl', 
      ['LoginSrv', 'SessionSrv', '$scope', '$routeParams', '$rootScope',
       function (loginSrv, sessionSrv, $scope, $routeParams, $rootScope) {
        
        /*
         *  
         */
        $scope.$watch( 'login.responseAuthenticate', function(value) {
          if( value != null ) {
            var uuid = value.uuid;
            if( uuid != null ) {
              sessionSrv.createSession(uuid, $scope.login.username);
              var user = sessionSrv.getUserNameSession();
              alert('Usuario autenticado ' +  user)
            } else {
              sessionSrv.removeSession();
              alert('Usuario no autenticado');
            }
          }
        });
        
        $scope.authenticate = function (login) {
          $scope.login.responseAuthenticate = 
            loginSrv.authenticate($scope.login);
        };
      }]
  ); 
});