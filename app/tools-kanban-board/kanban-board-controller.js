/*jslint browser: true*/
/*global define, console, $*/


define(['angular','angular-dragdrop'], function (angular) {
  'use strict';
var dirmodule = angular.module('kanbanBoardCtrl', ['login-security-services','ngDragDrop']);
dirmodule.controller("kanbanBoardCtrl",
  ["SessionSrv", "$scope","webSocket", "$log", 'taskService',
  function(security, $scope, webSocket, $log, taskService) {
    var uuid, tasks;

    $scope.$on('openWebSocket', function(event, data) {
      uuid = security.getIdSession();
      $scope.uuid    = uuid;
    });

    var params = {};
    var method = "tasks.getAll";

    params = {
      "uuid" : uuid
    };

    var webSockets = webSocket.WebSockets();
    webSockets.serversimm.sendRequest(method, params).then(function(data){
      $scope.data = data;
    });

    $scope.openConfirmation = function( dialogName, uuid ) {

    };

    $scope.editTask = function ( uuid ){
      taskService.editTask(uuid);
    };

    $scope.deleteTask = function( uuid ) {
      taskService.deleteTask(uuid);
    }

  }]);
});
