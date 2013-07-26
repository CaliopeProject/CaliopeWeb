/*jslint browser: true*/
/*global $scope, angular */

define(['angular'], function(angular) {
  'use strict';

  angular.module('gis-directives',[])
  .directive('widgetGis', function() {
    var directive = {
      templateUrl: 'tools-gis-viewer/gis-partial.html',
      restrict: 'E',
      replace: true,
      scope: true,
      link: function($scope, $element, $attrs, $controller) {
      }
    };

    return directive;
  });

});
