define(['angular', 'application-servicesWebSocket'], function(angular, webSocket) {
  'use strict';

  var module = angular.module('CaliopeController', ['webSocket']);

  module.controller('CaliopeController',
      ['webSocket', '$scope','HandlerResponseServerSrv', 'httpRequestTrackerService',
      function(webSocket, $scope, handlerResServerSrv, httpRequestTrackerService) {
        var delMessage, timerMessage;

        delMessage = function(){
          $scope.alerts.pop();
        };

        timerMessage = function(){
          console.log('salida de alerts ',$scope.alerts.length);
          if ($scope.alerts.length > 0){
            setTimeout(delMessage, 3000);
          }
        };

        $scope.init = function () {
          webSocket.initWebSockets();

          $scope.alerts = [
            { type: 'success', msg: 'Bienvenidos al SIIM' }
          ];

          timerMessage();

          $scope.$on('ChangeTextAlertMessage', function (event, data) {
            $scope.alerts.push({msg: data[0]});
            timerMessage();
          });

          $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
          };

        };

        $scope.hasPendingRequests = function () {
          return httpRequestTrackerService.hasPendingRequests();
        };
      }]
  );
});
