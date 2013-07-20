/*jslint browser: true*/
/*global alert, define*/

define(['angular', 'angular-ui-bootstrap-bower'], function (angular) {
  'use strict';

  var moduleControllers = angular.module('LoginControllers', []);

  moduleControllers.controller('LoginCtrl',
    ['LoginSrv', 'SessionSrv', '$scope', '$routeParams', '$rootScope', '$dialog',

      function (loginSrv, sessionSrv, $scope, $routeParams, $rootScope,$dialog) {
        $scope.opts = {
          backdrop: true,
          keyboard: true,
          backdropClick: false,
          templateUrl:   "./login/partial-login-form.html",
          controller: 'login-controllers-form'
        };

        $scope.openDialog = function(){
          var d = $dialog.dialog($scope.opts);
          d.open().then(function(result){
            if(result)
            {
              alert('dialog closed with result: ' + result);
            }
          });
        };

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
