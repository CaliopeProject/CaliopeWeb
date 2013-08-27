/*jslint browser: true*/
/*global $scope, angular */

define(['angular'], function(angular) {
  'use strict';
  var moduleControllers = angular.module('menu-right-directives', []);

  moduleControllers.directive("sidebar", function () {
    return {
      templateUrl: 'menu-right/directive-sidebar.html',
      replace: true,
      restrict: "A",
      scope: {
        btn:  '=',
        url:  '=',
        icon: '=',
        ttip: '='
      },
      link: function (scope, elem, attrs) {}
    };
  })

  .directive("shortcuts", function () {
    return {
      templateUrl: 'menu-right/directive-shortcuts.html',
      replace: true,
      restrict: "A",
      scope: {
        btn:  '=',
        url:  '=',
        icon: '=',
        tooltip: '='
      },
      link: function (scope, elem, attrs) {}
    };
  });

});

