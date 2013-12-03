/*jslint browser: true*/
/*global define, $scope, angular, Crypto*/
define(['angular', 'context-services'], function(angular) {
  'use strict';

  var modCont = angular.module('context-directives',['ContextServices']);

  modCont.directive('widgetContext', ['contextService', function(contserv) {
    return {
      templateUrl: 'context/partial-tree-project-widget.html'
      ,restrict: 'E'
      //,scope: true
      ,replace: true
      ,link: function($scope) {
        $scope.userContexts         = contserv.getUserContexts();
        $scope.contexts             = contserv.getDefaultContext();
        $scope.changeCurrentContext = contserv.changeCurrentContext;

        $scope.$on('loadContexts', function() {
          $scope.contexts     = contserv.getDefaultContext();
          $scope.userContexts = contserv.getUserContexts();
        });
      }
    };
  }]);

});
