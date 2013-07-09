define(['angular'], function(angular) {
  'use strict';

  var moduleControllers = angular.module('LoginControllers', []);
  
  moduleControllers.controller('LoginCtrl', 
      ['LoginSrv', 'SessionSrv', '$scope', '$routeParams', '$rootScope',
       function (loginSrv, sessionSrv, $scope, $routeParams, $rootScope) {
                        
        /*
         *  
         */
        $scope.$watch( 'respLoginAuthenticate', function(value) {
          if( value != null ) {
            var uuid = value.uuid;
            if( uuid != null ) {
              sessionSrv.createSession(uuid, $scope.username);
              var user = sessionSrv.getUserNameSession();
              alert('Usuario autenticado ' +  user)
              //TODO: Realizar funcionalidades cuando se hace login correctamente
            } else {
              sessionSrv.removeSession();
              alert('Usuario no autenticado');
            }
          }
        });
        
        $scope.authenticate = function (login) {
          var login = {};
          login.username = $scope.username;
          login.password = $scope.password;
          $scope.respLoginAuthenticate = loginSrv.authenticate(login);
        };
      }]
  ); 
});