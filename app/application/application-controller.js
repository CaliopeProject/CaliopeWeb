define(['angular', 'application-servicesWebSocket', 'angular-ui-bootstrap-bower'], function(angular, webSocket) {
  'use strict';

  var module = angular.module('CaliopeController', ['ui.bootstrap','login-security-services']);

  module.controller('CaliopeController',
      ['loginSecurity',
      'SessionSrv',
      '$scope',
      '$timeout',
      'HandlerResponseServerSrv',
      'httpRequestTrackerService',
      'breadcrumbs',
      function(security,
      sessionUuid,
      $scope,
      $timeout,
      handlerResServerSrv,
      httpRequestTrackerService,
      breadcrumbs,
      loginSecurity
    ){
        var timerMessage;
        var initMessage = {type: 'success', msg: 'Bienvenidos al SIIM' };

        $scope.alerts      = [];
        $scope.breadcrumbs = breadcrumbs;

        timerMessage = function(data){
          $scope.alerts.push(data);
          if ($scope.alerts.length > 0){
            $timeout(function(){
              $scope.alerts.pop();
            }, 3000);
          }
        };

        $scope.init = function () {

          $scope.$on('openWebSocket', function(event, data) {

            //TODO: Funcionalidades a hacer cuando se notifica que el websocket está abierto.

          });

          var login = {};
          login.username = $scope.username;
          login.password = $scope.password;
          $scope.respLoginAuthenticate = loginSrv.authenticate(login);

          timerMessage(initMessage);

          $scope.$on('ChangeTextAlertMessage', function (event, data) {
            timerMessage({msg: data[0]});
          });

          $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
          };

        };

        $scope.hasPendingRequests = function () {
          return httpRequestTrackerService.hasPendingRequests();
        };

        $scope.$watch('hasPendingRequests', function(value){
          console.log('ingresoahaspendint', value);
          if (value !== undefined && value === false) {
            var uuid = sessionUuid.getIdSession();
            security.requestCurrentUser(uuid);
          }
        });
      }]
  );
});
