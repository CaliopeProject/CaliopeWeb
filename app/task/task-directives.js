/*jslint browser: true*/
/*global $scope, angular */


define(['angular'], function(angular) {
  'use strict';

  var moduleDirectives = angular.module('task-directives',['task-services'])
  // The loginToolbar directive is a reusable widget that can show login or logout buttons
  // and information the current authenticated user
  moduleDirectives.directive('widgetTask', ['taskService', function(taskService) {
    var directive = {
      templateUrl: 'task/partial-task-widget-task.html',
      restrict: 'E',
      replace: true,
      link: function($scope, $element, $attrs, $controller) {

        //$scope.category = $attrs.category;
        $scope.title = $attrs.title;
        $scope.target = {};

        $scope.$watch($attrs.category, function(value){
          $scope.category = value;
        });
        $scope.$watch($attrs.targetUuid, function(value){
          $scope.target.uuid = value;
        });
        $scope.$watch($attrs.targetEntity, function(value){
          $scope.target.entity = value;
        });

        $scope.createTask  = function (category, target){
          taskService.createTask(target, category);
        };
      }
    };

    return directive;
  }]);


  moduleDirectives.directive('cwTaskExecute', ['taskService', function(taskService) {
    var directive = {
      templateUrl: 'task/partial-task-execute-template.html',
      restrict: 'E',
      replace: true,
      link: function($scope, $element, $attrs, $controller) {

        console.log('Link cwTaskExecute')

      }
    };

    return directive;
  }]);

});
