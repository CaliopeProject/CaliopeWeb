/*jslint browser: true*/
/*global $scope, angular */

define(['angular'], function(angular) {
  'use strict';

  angular.module('task-directives',[])
  // The loginToolbar directive is a reusable widget that can show login or logout buttons
  // and information the current authenticated user
  .directive('widgetToolbar', function() {
    var directive = {
      templateUrl: 'task/partial-task-widget-toolbar.html',
      restrict: 'E',
      replace: true,
      scope: true,
      link: function($scope, $element, $attrs) {}
    };
    return directive;
  });

});

