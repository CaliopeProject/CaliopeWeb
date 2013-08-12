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
      //$scope.uuid    = uuid;
    });

    function updateKanban(uuid) {
      var params = {};
      var method = "tasks.getAll";

      params = {
        "uuid" : uuid
      };

      var webSockets = webSocket.WebSockets();
      webSockets.serversimm.sendRequest(method, params).then(function(data){
        $scope.data = data;
      });

      $scope.editTask = function ( uuid, category ){
        taskService.editTask(uuid, category);
      };

      $scope.deleteTask = function( uuid ) {
        taskService.deleteTask(uuid);
      };
    }

    $scope.$on('updateKanban', function(event, data) {
      updateKanban(uuid);
    });

    updateKanban(uuid);

  }]);
});
