/*jslint browser: true*/
/*global $scope, angular */
define(['angular'], function(angular) {
  'use strict';
  var moduleControllers = angular.module('menu-right-controller', []);

  moduleControllers.controller('menuRightController',['$scope',
    function($scope){
      $scope.shortcuts = [
        { btn  : 'success', icon  : 'signal'},
        { btn  : 'info',    icon  : 'pencil'},
        { btn  : 'warning', icon  : 'globe' },
        { btn  : 'error', icon  : 'globe' },
        { btn  : 'inverse', icon  : 'globe' },
        { btn  : 'danger', icon  : 'globe' },
        { icon : 'tint'}
      ];
    }
  ]);
});
