/*jslint browser: true*/
/*global define, $scope, angular, Crypto*/


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

        $scope.title = $attrs.title;
        $scope.targetTask = {};

        if($attrs.hasOwnProperty('category')) {
          $scope.$watch($attrs.category, function(value){
            $scope.category = value;
          });
        }

        if($attrs.hasOwnProperty('targetUuid')) {
          $scope.$watch($attrs.targetUuid, function(value){
            $scope.targetTask.uuid = value;
          });
        }

        if($attrs.hasOwnProperty('targetEntity')) {
          $scope.$watch($attrs.targetEntity, function(value){
            $scope.targetTask.entity = value;
          });
        }

        $scope.createTask  = taskService.createTask;

      }
    };

    return directive;
  }]);


  moduleDirectives.directive('cwTaskExecute', ['taskService', '$location', 'toolservices',
    function(taskService, $location, toolservices) {

      var directive = {
        templateUrl: 'task/partial-task-execute-template.html',
        restrict: 'E',
        replace: true,
        controller: function($scope, $element, $attrs) {

          if($attrs.targetEntity !== undefined) {
            $scope.showExecuteTask = true;
          } else {
            $scope.showExecuteTask = false;
          }

          $scope.executeTask = function(dialogName) {
            var route = 'form/';

            var targetEntity =  $attrs.targetEntity;
            var targetUuid = $attrs.targetUuid;

            if(targetEntity !== undefined ) {
              if( targetUuid !== undefined && targetUuid.length > 0 ) {
                //TODO: Create centralized function to encode and decode uuid
                var bytesUUID = Crypto.charenc.Binary.stringToBytes(targetUuid);
                route = route.concat($attrs.targetEntity).concat('/').concat('edit').concat('/').concat(Crypto.util.bytesToBase64(bytesUUID));
              }else {
                route = route.concat($attrs.targetEntity).concat('/').concat('create').concat('/');
              }
              $location.path(route);
              if( dialogName !== undefined ) {
                if($scope[dialogName] !== undefined) {
                  $scope[dialogName].close([false, dialogName]);
                  $scope.fromDialog = false;
                }
              }
            }
          };
        }
      };

    return directive;
  }]);

});
