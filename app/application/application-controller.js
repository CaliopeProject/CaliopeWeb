/*jslint browser: true, unparam: true*/
/*global define*/

define(['angular', 'application-servicesWebSocket', 'angular-ui-bootstrap-bower','login-retryQueue','login-security-services','task-services', 'login-directives','httpRequestTrackerService', 'context-services'], function(angular) {
  'use strict';

  var module = angular.module('CaliopeController', ['ui.bootstrap','login-retryQueue','login-security-services', 'task-services', 'login-directives', 'httpRequestTrackerService', 'ContextServices']);

  module.controller('CaliopeController',
    [  'loginSecurity'
      ,'SessionSrv'
      ,'$scope'
      ,'$timeout'
      ,'httpRequestTrackerService'
      ,'taskService'
      ,'contextService'

      ,function(
        security,
        sessionUuid,
        $scope,
        $timeout,
        httpRequestTrackerService,
        taskService,
        contextService
      ){
        var timerMessage;
        $scope.showMenu = false;
        $scope.toggle   = false;
        $scope.isAuthenticated = security.isAuthenticated;

        $scope.alerts      = [];

        timerMessage = function(data){
          if( $scope.$$phase !== '$apply') {
            $scope.$apply(function () {
              $scope.alerts.push(data);
            });
          } else {
            $scope.alerts.push(data);
          }
          if ($scope.alerts.length > 0){
            $timeout(function(){
              $scope.alerts.pop();
            }, 9000);
          }
        };

        $scope.$on('openWebSocket', function(event, data) {
          var uuid = sessionUuid.getIdSession();
          security.requestCurrentUser(uuid).then( function(){
            if(!!security.currentUser){
              $scope.$broadcast('userAuthenticated');
            }
          });
        });

        $scope.$on('userAuthenticated', function() {

          /*
          When user is authenticated then load contexts and before load user kanban
           */
          contextService.loadUserContexts().then(
            function( defaultContext ){
              if( defaultContext !== undefined) {
                taskService.loadData( defaultContext.defaultContext.uuid );
              }
            }
          );
        });

        $scope.$on('closeWebSocket', function(event, data) {
          security.resetAuthentication();
        });

        //Put task when other user create
        $scope.$on('createTask', function (event, data) {
          if( data !== undefined && data.hasOwnProperty('contexts') ) {
            var contextNewTask;
            var varName;
            for( varName in data.contexts ) {
              contextNewTask = varName;
              break;
            }
            if( contextService.getDefaultContext().uuid === contextNewTask ) {
              $scope.$apply(function () {
                taskService.addTask(data);
              });
            } else {
              /**
               * If task is created by other user then compare the holders
               */
              angular.forEach( data.holders, function(vHolder, kHolder) {
                if( contextService.getDefaultContext().uuid === kHolder ) {
                  taskService.addTask(data);
                }
              });

            }
          }
        });

        $scope.init = function () {

          $scope.$on('ChangeTextAlertMessage', function (event, data) {
            timerMessage({msg: data.msg, type: data.type});
          });

          $scope.$on('taskServiceNewTask', function (event, data) {
            $scope.taskpend = taskService.getTaskpend();
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
