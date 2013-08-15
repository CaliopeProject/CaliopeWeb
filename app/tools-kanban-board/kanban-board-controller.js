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
                  description : 'Subtarea 1',
                  complete: false
                },
                {
                  description : 'Subtarea 2',
                  complete: true
                }
              ];
              if( task != undefined) {
                task.subtasks = updateData;
              }
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
            task.subtasks = data;

          });
        };

        updateKanban(uuid);

        $scope.startCallback = function(event, ui) {
          console.log('You started draggin');
          $scope.showSubtask = false;
        };

        $scope.addSubtask = function(parentTask, description) {
          var subTask = {
            description : description,
            complete : false
          }
          if( parentTask.subtasks === undefined) {
            parentTask.subtasks = [];
          }
          parentTask.subtasks.push(subTask);
          description = '';
        };

        $scope.dropCallback = function(event, ui) {


          var category , categ, uuid, findCateg, itemsbycateg, data;
          var params = {};
          var method = "tasks.edit";

          itemsbycateg = (function(){
            var i,j,categoryUiid = [];
            for(i=0; $scope.data.length > i; i++){
              var tasksCategory = $scope.data[i].tasks.slice(0);
              for(j=0; tasksCategory.length > j; j++){
                if(tasksCategory[j].uuid === undefined){
                  $scope.data[i].tasks.splice(j, 1);
                }else{
                  categoryUiid.push({uuid : tasksCategory[j].uuid , categ :$scope.data[i].category});
                }
              }
              //$scope.data[i] =  tasksCategory;
            }

            return categoryUiid;
          }());

          findCateg = function (array, value) {
            var i, items;
            console.log('pase');
            for(i = 0; i<array.length; i++) {
              if(array[i].uuid.value === value.value){
                console.log(array[i]);
                return array[i].categ;
              }
            }
          };

          uuid         = JSON.parse(ui.draggable.attr("uuid"));
          console.log('itemsbycateg', itemsbycateg);
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

      }]);


  dirmodule.controller("kanbanItemCtrl", ["SessionSrv", "$scope","webSocket", 'caliopewebTemplateSrv',
    function(security, $scope, webSocket, tempServices) {

        $scope.startCallback = function(event, ui) {
          console.log('You started draggin-kanbanItemCtrl-callback', $scope.showSubtasks);
          $scope.showSubtasks = false;
        };



      }]);
});
