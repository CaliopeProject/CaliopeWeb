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

      function(security,
        sessionUuid,
        $scope,
        $timeout,
        handlerResServerSrv,
        httpRequestTrackerService,
        taskService
      ){
        var timerMessage;
        var initMessage = {type: 'success', msg: 'Bienvenidos al SIIM' };

        $scope.isAuthenticated = security.isAuthenticated;

        $scope.$watch(function() {
          return security.isAuthenticated();
        }, function(value) {
          try{
            taskService.loadData();
          }catch(err){
            console.log("Usuario no registrado");
          }
        });

        $scope.alerts      = [];

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
            try{
              $scope.taskpend = taskService.getTaskpend();
            }catch(err){
              console.log("Usuario no registrado");
            }
          });

          $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
          };

        };

        if(!httpRequestTrackerService.first){
          $scope.hasPendingRequests = httpRequestTrackerService.hasPendingRequests;
        }

      }]
  );
});
