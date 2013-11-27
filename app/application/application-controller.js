/*jslint browser: true*/
/*global define*/

define(['angular', 'application-servicesWebSocket', 'angular-ui-bootstrap-bower','login-retryQueue','login-security-services','task-services', 'login-directives','httpRequestTrackerService'], function(angular) {
  'use strict';

  var module = angular.module('CaliopeController', ['ui.bootstrap','login-retryQueue','login-security-services', 'task-services', 'login-directives', 'httpRequestTrackerService']);

  module.controller('CaliopeController',
    [  'loginSecurity'
      ,'SessionSrv'
      ,'$scope'
      ,'$timeout'
      ,'httpRequestTrackerService'
      ,'taskService'

      ,function(
        security,
        sessionUuid,
        $scope,
        $timeout,
        httpRequestTrackerService,
        taskService
      ){
        var timerMessage;

        $scope.showMenu = false;
        $scope.toggle   = false;
        $scope.isAuthenticated = security.isAuthenticated;

        $scope.alerts      = [];

        timerMessage = function(data){
          $scope.$apply(function () {
            $scope.alerts.push(data);
          });
          if ($scope.alerts.length > 0){
            $timeout(function(){
              $scope.alerts.pop();
            }, 9000);
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

          $scope.$on('ChangeTextAlertMessage', function (event, data) {
            timerMessage({msg: data.msg, type: data.type});
          });

          $scope.$on('taskServiceNewTask', function (event, data) {
            try{
              $scope.taskpend = taskService.getTaskpend();
            }catch(err){
              console.log("No existen tareas pendientes");
            }
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
