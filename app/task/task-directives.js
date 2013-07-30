/*jslint browser: true*/
/*global $scope, angular */

define(['angular'], function(angular) {
  'use strict';

  angular.module('task-directives',['task-services'])
  // The loginToolbar directive is a reusable widget that can show login or logout buttons
  // and information the current authenticated user
  .directive('widgetTask', ['taskService', function(taskService) {
    var directive = {
      templateUrl: 'task/partial-task-widget-task.html',
      restrict: 'E',
      replace: true,
      scope: true,
      link: function($scope, $element, $attrs, $controller) {
        $scope.task = taskService.createTask;
      }
    };

    return directive;
  }]);

});
