define(['angular', 'application-servicesWebSocket', 'angular-ui-bootstrap-bower'], function(angular, webSocket) {
  'use strict';

  var module = angular.module('CaliopeController', ['ui.bootstrap','login-security-services', 'task-services']);

  module.controller('CaliopeController',
    ['loginSecurity',
      'SessionSrv',
      '$scope',
      '$timeout',
      'HandlerResponseServerSrv',
      'httpRequestTrackerService',
      'taskService',
      'breadcrumbs',

      function(security,
        sessionUuid,
        $scope,
        $timeout,
        handlerResServerSrv,
        httpRequestTrackerService,
        taskService,
        breadcrumbs
      ){
        var timerMessage;
        var initMessage = {type: 'success', msg: 'Bienvenidos al SIIM' };

        $scope.isAuthenticated = security.isAuthenticated;

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

        $scope.$on('openWebSocket', function(event, data) {
          var uuid = sessionUuid.getIdSession();
          security.requestCurrentUser(uuid);
          taskService.loadData();
        });

        $scope.$on('closeWebSocket', function(event, data) {
          security.resetAuthentication();
        });

        $scope.init = function () {

          timerMessage(initMessage);

          $scope.$on('ChangeTextAlertMessage', function (event, data) {
            timerMessage({msg: data[0]});
          });

          $scope.$on('taskServiceNewTask', function (event, data) {
            $scope.taskpend = taskService.getTaskpend();
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
