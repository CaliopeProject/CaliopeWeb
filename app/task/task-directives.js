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
      scope: {
        'title'         : '=',
        'category'      : '@',
        'target-uuid'   : '@targetUuid',
        'target-entity' : '@targetEntity'
      },
      link: function($scope, $element, $attrs, $controller) {

        if( $scope['target-entity'] !== undefined || $scope['target-uuid'] !== undefined ) {
          $scope.target = {
            'uuid'    : $scope['target-uuid'],
            'entity'  : $scope['target-entity']
          };
        }

        $scope.createTask  = function (category, target){
          console.log('category', category);
          console.log('target', target);
          taskService.createTask(undefined, category);
        };
      }
    };

    return directive;
  }]);
});
