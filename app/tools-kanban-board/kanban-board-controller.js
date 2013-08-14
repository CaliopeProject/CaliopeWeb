/*jslint browser: true*/
/*global define, console, $*/


define(['angular','angular-dragdrop'], function (angular) {
  'use strict';
  var dirmodule = angular.module('kanbanBoardCtrl', ['login-security-services','ngDragDrop']);

  dirmodule.controller("kanbanBoardCtrl",
    ["SessionSrv", "$scope","webSocket", "$log", 'taskService', 'caliopewebTemplateSrv',
      function(security, $scope, webSocket, $log, taskService, tempServices) {

        var uuid, tasks;
        var webSockets = webSocket.WebSockets();

        $scope.showSubtasks = false;

        $scope.$on('openWebSocket', function(event, data) {
          uuid = security.getIdSession();
        });

        function updateKanban(uuid) {
          var params = {};
          var method = "tasks.getAll";

          params = {
            "uuid" : uuid
          };

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

        $scope.dropCallback = function(event, ui) {

          var category , categ, uuid, findCateg, itemsbycateg, data;
          var params = {};
          var method = "tasks.edit";

          itemsbycateg = (function(){
            var i,j,categoryUiid = [];
            for(i=0; $scope.data.length > i; i++){
              for(j=0; $scope.data[i].tasks.length > j; j++){
                if($scope.data[i].tasks[j].uuid === undefined){
                  $scope.data[i].tasks.splice(j, 1);
                }else{
                  categoryUiid.push({uuid : $scope.data[i].tasks[j].uuid , categ :$scope.data[i].category});
                }
              }
            }

            return categoryUiid;
          }());

          findCateg = function (array, value) {
            var i, items;
            console.log('pase');
            for(i = 0; i<array.length; i++) {
              if(array[i].uuid === value){
                return array[i].categ;
              }
            }
          };

          uuid         = ui.draggable.attr("uuid");
          categ        = findCateg(itemsbycateg, uuid);

          console.log('uuid',uuid);
          console.log('cagt',categ);

          if(categ !== undefined){
            data  = {
              "uuid"     : uuid,
              "category" : categ
            };
            tempServices.sendDataForm('asignaciones', 'tasks.edit', data, '', uuid );
          }
        };

        $scope.startCallback = function(event, ui) {
          console.log('You started draggin');
          $scope.showSubtask = false;
        };

      }]);

      dirmodule.controller("kanbanItemCtrl", ['$scope', function($scope) {
        $scope.startCallback = function(event, ui) {
          console.log('You started draggin-kanbanItemCtrl-callback', $scope.showSubtasks);
          $scope.showSubtasks = false;
        };
      }]);
});
