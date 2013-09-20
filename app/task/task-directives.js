/*jslint browser: true*/
/*global $scope, angular, Crypto*/


define(['angular'], function(angular) {
  'use strict';

  var moduleDirectives = angular.module('task-directives',['task-services']);
  // The loginToolbar directive is a reusable widget that can show login or logout buttons
  // and information the current authenticated user
  moduleDirectives.directive('widgetTask', ['taskService', function(taskService) {
    var directive = {
      templateUrl: 'task/partial-task-widget-task.html',
      restrict: 'E',
      replace: true,
      link: function($scope, $element, $attrs, $controller) {
        $scope.target        = {};
        $scope.title         = $attrs.title;
        $scope.category      = $attrs.category || '';
        $scope.target.uuid   = $attrs.targetUuid || '';
        $scope.target.entity = $attrs.targetEntity || '';

        $scope.createTask  = function (category, target){
          taskService.createTask(target, category);
        };
      }
    };

    return directive;
  }]);


  moduleDirectives.directive('cwTaskExecute', ['taskService', '$location', function(taskService, $location) {
    var directive = {
      templateUrl: 'task/partial-task-execute-template.html',
      restrict: 'E',
      replace: true,
      controller: function($scope, $element, $attrs) {

        if($attrs.targetUuid !== undefined && $attrs.targetEntity !== undefined) {
          $scope.showExecuteTask = true;
        } else {
          $scope.showExecuteTask = false;
        }

        $scope.executeTask = function(dialogName) {
          var route = 'form/';

          if($attrs.targetUuid !== undefined && $attrs.targetEntity !== undefined) {
            //TODO: Create centralized function to encode and decode uuid
            var bytesUUID = Crypto.charenc.Binary.stringToBytes($attrs.targetUuid);
            route = route.concat($attrs.targetEntity).concat('/edit/').concat(Crypto.util.bytesToBase64(bytesUUID));
          }
          $location.path(route);

          if( dialogName !== undefined ) {
            if($scope[dialogName] !== undefined) {
              $scope[dialogName].close([false, dialogName]);
              $scope.fromDialog = false;
            }
          }
        };
      }
    };

    return directive;
  }]);

});
