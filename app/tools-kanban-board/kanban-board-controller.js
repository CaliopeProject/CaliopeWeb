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

        /*Tmp for test subtask in kanban*/
        var task;
        if(data !== undefined) {
          console.log('data', data);
          task = data[0].tasks[0];
          var updateData = [
            {
              description : 'Subtarea 1' ,
              tarea : "Tarea",
              uuid  : task.uuid + "-1",
              tasks : [{
                description : 'Subtarea 1' ,
                tarea : "Tarea",
                uuid  : task.uuid + "-1" + "-1"
              }]
            },
            {
              description : 'Subtarea 2',
              tarea : "Tarea",
              uuid  : task.uuid + "-2",
              tasks : []
            }
          ];
          task.tasks = updateData;
        }

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


    $scope.getSubTasks = function(task){
      var method = "tasks.getSubTasks";
      var params = {
        "sessionuuid" : uuid,
        "taskuuid"    : task.uuid
      };
      var webSockets = webSocket.WebSockets();
      webSockets.serversimm.sendRequest(method, params).then(function(data){
        task.tasks = data;

      });
    };

    updateKanban(uuid);

    $scope.startCallback = function(event, ui) {
      console.log('You started draggin');
    };

    $scope.stopCallback = function(event, ui) {
      console.log('Why did you stop draggin me?');
    };

    $scope.dragCallback = function(event, ui) {
      console.log('hey, look I`m flying');
    };

    $scope.dropCallback = function(event, ui) {
      console.log('hey, you dumped me :-(');
    };

    $scope.overCallback = function(event, ui) {
      console.log('Look, I`m over you');
    };

    $scope.outCallback = function(event, ui) {
      console.log('I`m not, hehe');
    };


  }]);
});
