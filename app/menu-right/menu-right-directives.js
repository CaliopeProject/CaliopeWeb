/*jslint browser: true*/
/*global $scope, angular */

define(['angular'], function(angular) {
  'use strict';
  var moduleControllers = angular.module('menu-right-directives', []);

  moduleControllers.directive('sidebar',['$scope',
    function($scope){
      return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
          console.log("Recognized the fundoo-rating directive usage");
        }
      };
    }
  ]);

  moduleControllers.directive('items',['$scope',
    function($scope){
      return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
          console.log("Recognized the fundoo-rating directive usage");
        }
      };
    }
  ]);

  moduleControllers.directive('shortcuts',['$scope',
    function($scope){
      return {
        restrict: 'A',
        template: '',
        scope: {
          msg: '='
        },
        link: function (scope, elem, attrs) {
          console.log("Recognized the fundoo-rating directive usage");
        }
      };
    }
  ]);

});

