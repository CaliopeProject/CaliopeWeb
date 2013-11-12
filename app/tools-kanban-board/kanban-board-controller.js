/*jslint browser: true*/
/*global define, console, $*/

define(['angular', 'angular-dragdrop', 'task-controllers','task-directives'], function (angular) {
  'use strict';
  var dirmodule = angular.module('kanbanBoardCtrl', ['ngDragDrop', 'ui.bootstrap', 'task-controllers','task-directives']);

  dirmodule.controller("kanbanBoardCtrl", ["$scope",'taskService',
    function($scope, taskService) {

      //Put task when other user create
      $scope.$on('createTask', function (event, data) {
        taskService.addTask(data);
        $scope.$apply(function () {
          $scope.data = taskService.getTask();
        });
      });

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
        var changetask, category;
        angular.forEach($scope.data, function(value1, key1){
          if(!angular.isUndefined(value1.tasks)){
            angular.forEach(value1.tasks, function(value2, key2){
              if(value2.uuid === uuidtask){
                category   = $scope.data[key1].category;
                changetask = $scope.data[key1].tasks[key2];
                return;
              }
            });
          }
        });
        if($scope.categoryOld !== category) {
          taskService.changeCategory(changetask, category);
        }
      };

      $scope.startDragCallback = function(event, ui) {
        $scope.categoryOld = ui.helper.attr('category');
      };
  }]);


  dirmodule.controller("kanbanItemCtrl", ["$scope", 'taskService',
    function($scope, taskService) {

      $scope.countSubtask = taskService.countSubtask;
      $scope.checkSubtask = taskService.checkSubtask;
      $scope.removeSubtask= taskService.removeSubtask;

      $scope.stopDragCallback = function(event, ui) {
        $scope.showSubtasks = false;
      };

      $scope.addSubtask   = taskService.addSubtask;

      $scope.addComment   = taskService.addComment;

      $scope.getTargetUUID = function(target) {
        var varName;
        if( target !== undefined ) {
          for( varName in target ) {
            break;
          }
        }
        return varName;
      };

  }]);


  dirmodule.controller("kanbanItemDataCtrl", ["$scope", 'taskService',
    function($scope, taskService) {

      $scope.addSubtask   = function (parentTask, description){
        taskService.addSubtask(parentTask, description);
        $scope.description = '';
      };

      $scope.addComment   = function (parentTask, text){
        console.log($scope.$id);
        taskService.addComment(parentTask, text);
        $scope.text = '';
      };

  }]);
});
