/*jslint browser: true*/
/*global define, console, $*/

define(['angular','angular-dragdrop'], function (angular) {
  'use strict';
  var dirmodule = angular.module('kanbanBoardCtrl', ['login-security-services','ngDragDrop', 'ui.bootstrap']);

  dirmodule.controller("kanbanBoardCtrl",
    ["$scope","webSocket", 'taskService',
      function($scope, webSocket, taskService) {

        $scope.data = taskService.getTask();

        $scope.showSubtasks = false;

        $scope.$on('taskServiceNewTask', function (event, data) {
            $scope.data = taskService.getTask();
        });

        $scope.editTask     = taskService.editTask;

        $scope.deleteTask   = taskService.deleteTask;

        $scope.archiveTask  = taskService.archiveTask;

        $scope.getSubTasks  = taskService.getSubTasks;

        $scope.dropCallback = function(event, ui) {
          var uuidtask = ui.draggable.attr("uuid");
          var changetask;
          angular.forEach($scope.data, function(value1, key1){
            if(!angular.isUndefined(value1.tasks)){
              angular.forEach(value1.tasks, function(value2, key2){
                if(value2.uuid === uuidtask){
                  changetask =  $scope.data[key1].tasks[key2];
                  return;
                }
              });
            }
          });
          taskService.changeCategory(changetask);
        };

      }]);


      dirmodule.controller("kanbanItemCtrl", ["SessionSrv", "$scope", "webSocket", 'taskService',
        function(security, $scope, webSocket, taskService) {


          $scope.countSubtask = taskService.countSubtask;
          $scope.checkSubtask = taskService.checkSubtask;
          $scope.removeSubtask= taskService.removeSubtask;

          $scope.startCallback = function(event, ui) {
            $scope.showSubtasks = false;
          };

          $scope.addSubtask   = function (parentTask, description, category){
            taskService.addSubtask(parentTask, description, category);
            $scope.description = '';
          };

          $scope.addComment   = function (parentTask, text, category){
            taskService.addComment(parentTask, text, category);
            $scope.text = '';
          };

        }]);
});
