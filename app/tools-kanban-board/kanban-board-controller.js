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

        $scope.editTask = function ( uuid, category ){
          taskService.editTask(uuid, category);
        };

        $scope.deleteTask = function( uuid ) {
          taskService.deleteTask(uuid);
        };

        $scope.getSubTasks = function(task){
          task.subtasks = taskService.getSubTasks(task);
        };

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

          $scope.checkSubtask = function (task){
            taskService.checkSubtask(task);
          };

        }]);
});
