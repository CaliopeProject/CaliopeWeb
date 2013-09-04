/*jslint browser: true*/
/*global $scope, angular */

define(['angular'], function(angular) {
  'use strict';

  angular.module('seeinmap-directives',['seeinmap-services'])
  .directive('widgetSeeinmap', ['seeinmapService',function(seeinmapService) {
          return {
              templateUrl: 'tools-gis-viewer/seeinmap-partial.html',
              restrict: 'E',
              replace: true,
              scope: {
                  map: '@map'
              },
              link: function($scope, $element, $attrs, $controller) {
                  $scope.findByPredio = function(map){
                      seeinmapService.findByPredio();
                  }
              }
          };
      }]);

});
