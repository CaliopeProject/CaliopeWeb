define(['angular', 'application-servicesWebSocket', 'angular-ui-bootstrap-bower','login-retryQueue','login-security-services','task-services', 'login-directives','httpRequestTrackerService'], function(angular) {
  'use strict';

  var module = angular.module('CaliopeController', ['ui.bootstrap','login-retryQueue','login-security-services', 'task-services', 'login-directives', 'httpRequestTrackerService']);

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

        $scope.showMenu = false;
        $scope.toggle   = false;
        $scope.isAuthenticated = security.isAuthenticated;

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
          security.requestCurrentUser(uuid).then(function(){
            if(!!security.currentUser){
              taskService.loadData();
            }
          });
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
              console.log("No existen tareas pendientes");
            }
          });

          //this metodo is the same that method in login_controller.
          $scope.$on('login-service-user', function (event, data) {
              taskService.loadData();
          });

          $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
          };

        };

        if(!httpRequestTrackerService.first){
          $scope.hasPendingRequests = httpRequestTrackerService.hasPendingRequests;
        }

        $scope.changeMenu = function (){
          $scope.showMenu = !$scope.showMenu;
        };

        $scope.changeToogleMenu = function (){
          $scope.toggle = !$scope.toggle;
        };

        $scope.$on('closemenu', function(event, data) {
          $scope.showMenu = false;
        });
     }]
  );
});
