/*jslint browser: true*/
/*global alert, define*/

define(['angular', 'angular-ui-bootstrap-bower'], function (angular) {
  'use strict';

  var moduleControllers = angular.module('LoginControllers', []);

  moduleControllers.controller('LoginCtrl',
    ['LoginSrv', 'SessionSrv', '$scope', '$routeParams', '$rootScope', 

      function (loginSrv, sessionSrv, $scope, $routeParams, $rootScope) {

        $scope.$watch('respLoginAuthenticate', function (value) {
          if (value !== undefined) {
            var uuid = value.uuid;
            if (uuid !== undefined) {
              sessionSrv.createSession(uuid, $scope.username);
              var user = sessionSrv.getUserNameSession();
              //TODO: Realizar funcionalidades cuando se hace login correctamente
            } else {
              sessionSrv.removeSession();
            }
          }
        });

        $scope.authenticate = function () {
          var login = {};
          login.username = $scope.username;
          login.password = $scope.password;
          $scope.respLoginAuthenticate = loginSrv.authenticate(login);
        };
      }]
  );
});
