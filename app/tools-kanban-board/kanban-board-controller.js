/*jslint browser: true*/
/*global define, console, $*/

define(['angular','angular-dragdrop'], function (angular) {
  'use strict';
  var dirmodule = angular.module('kanbanBoardCtrl', ['login-security-services','ngDragDrop']);

  dirmodule.controller("kanbanBoardCtrl",
    ["$scope","webSocket", "$log", 'taskService', 'caliopewebTemplateSrv',
      function($scope, webSocket, $log, taskService, tempServices) {

        var tasks;
        $scope.data = taskService.getTask();

        $scope.showSubtasks = false;

        $scope.$on('taskServiceNewTask', function (event, data) {
            $scope.data = taskService.getTask();
        });

        function updateKanban() {
          /**
          * Tranform data from server. Example:
          */

          if($scope.data !== undefined ) {
            var i;
            for(i=0; i < $scope.data.length; i++) {
              var j;
              for(j=0; j < $scope.data.length; j++) {
                var obj = $scope.data[i].tasks[j];
                if( obj !== undefined ) {
                  var varName;
                  for( varName in obj ) {
                    if( obj[varName].value !== undefined ) {
                      obj[varName] = obj[varName].value;
                    }
                  }
                }
              }
            }
        
        }}

        $scope.editTask = function ( uuid, category ){
          taskService.editTask(uuid, category);
        }

        $scope.deleteTask = function( uuid ) {
          taskService.deleteTask(uuid);
        }

        $scope.$on('updateKanban', function(event, data) {
          updateKanban();
        });

        $scope.getSubTasks = function(task){
          task.subtasks = taskService.getSubTasks(task);
        };

        updateKanban();


        /**
        *
        * @param event
        * @param ui
        */
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
            for(i = 0; i<array.length; i++) {
              if(array[i].uuid === value){
                return array[i].categ;
              }
            }
          };

          uuid         = ui.draggable.attr("uuid");
          categ        = findCateg(itemsbycateg, uuid);

          if(categ !== undefined){
            data = $scope.taskDrag;
            data.category = categ;
            tempServices.sendDataForm('tasks', 'tasks.edit', data, uuid.value, uuid.value );
          }
        };

        $scope.$on('DragTask', function(event, data) {
          angular.forEach(data, function(value, key){
            $scope.taskDrag = value;
            console.log('158 kanbanboarad controller', key);
          });
        });
      }]);


      dirmodule.controller("kanbanItemCtrl", ["SessionSrv", "$scope", "webSocket", 'caliopewebTemplateSrv',
        function(security, $scope, webSocket, tempServices) {
          var webSockets = webSocket.WebSockets();

          $scope.remaining = 0;

          angular.forEach($scope.item.subtask, function(value, key){
            if(value === false){
              $scope.remaining++;
            }
          });

          $scope.startCallback = function(event, ui) {
            $scope.showSubtasks = false;
            $scope.$emit('DragTask', [$scope.item]);
          };

          $scope.addSubtask = function(parentTask, description, category) {

            var subTask = {
              description : description,
              complete : false
            };

            if( parentTask.subtasks === undefined) {
              parentTask.subtasks = [];
            }

            parentTask.subtasks.push(subTask);
            parentTask.category = category;

            tempServices.sendDataForm('tasks', 'tasks.edit', parentTask, parentTask.uuid, parentTask.uuid).then(function(data){
              subTask.uuid = data;
            });

            $scope.description = '';
          };


          $scope.checkSubtask = function(parentTask, subtask) {
            $scope.remaining = subtask.length;

            angular.forEach(subtask, function(subtask) {
              if (subtask.complete) {
                $scope.remaining--;
              }
            });

            tempServices.sendDataForm('tasks', 'tasks.edit', parentTask, parentTask.uuid.value, parentTask.uuid.value);

          };

        }]);
});
