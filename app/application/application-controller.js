define(['angular', 'application-servicesWebSocket'], function(angular, webSocket) {
  'use strict';

  var module = angular.module('CaliopeController', ['webSocket']);

  module.controller('CaliopeController',
      ['webSocket', '$scope', '$timeout','HandlerResponseServerSrv', 'httpRequestTrackerService',
      function(webSocket, $scope, $timeout,handlerResServerSrv, httpRequestTrackerService) {
        var timerMessage;
        var initMessage = {type: 'success', msg: 'Bienvenidos al SIIM' };
        $scope.alerts = [];

        timerMessage = function(data){
          $scope.alerts.push(data);
          if ($scope.alerts.length > 0){
            $timeout(function(){
              $scope.alerts.pop();
            }, 5000);
          }
        };

        $scope.init = function () {
          webSocket.initWebSockets();

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
      }]
  );
});
