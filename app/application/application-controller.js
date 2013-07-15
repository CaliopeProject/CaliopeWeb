define(['angular', 'application-servicesWebSocket'], function(angular, webSocket) {
  'use strict';

  var module = angular.module('CaliopeController', ['webSocket']);

  module.controller('CaliopeController',
      ['webSocket', '$scope',
      function(webSocket, $scope) {

        $scope.init = function () {
          webSocket.initWebSockets();

          $scope.alerts = [
            { type: 'success', msg: 'Bienvenidos al SIIM' }
          ];

          $scope.$on('ChangeTextAlertMessage', function (event, data) {
            $scope.alerts.push({msg: data[0]});
          });

          $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
          };

        };

      }]
  );
});
