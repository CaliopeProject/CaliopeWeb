/*jslint browser: true*/
/*global define, console, $*/

define(['angular','angular-dragdrop'], function (angular) {
  'use strict';
  var dirmodule = angular.module('kanbanBoardCtrl', ['login-security-services','ngDragDrop']);

  dirmodule.controller("kanbanBoardCtrl",
    ["$scope","webSocket", "$log", 'taskService',
      function($scope, webSocket, $log, taskService) {

        var tasks;
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
          taskService.changeCategory(ui,$scope.taskDrag);
        };

        $scope.$on('DragTask', function(event, data) {
          angular.forEach(data, function(value, key){
            $scope.taskDrag = value;
          });
        });
      }]);


      dirmodule.controller("kanbanItemCtrl", ["SessionSrv", "$scope", "webSocket", 'taskService',
        function(security, $scope, webSocket, taskService) {
          var webSockets = webSocket.WebSockets();

          $scope.countSubtask = taskService.countSubtask ;

          angular.forEach($scope.item.subtask, function(value, key){
          });

          $scope.startCallback = function(event, ui) {
            $scope.showSubtasks = false;
            $scope.$emit('DragTask', [$scope.item]);
          };

          $scope.addSubtask   = function (parentTask, description, category){
            taskService.addSubtask(parentTask, description, category);
            $scope.description = '';
          };

          $scope.checkSubtask = taskService.checkSubtask;
          $scope.removeSubtask= taskService.removeSubtask;
        }]);
});
