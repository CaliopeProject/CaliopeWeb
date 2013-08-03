/*jslint browser: true*/
/*global define, console, $*/

define(['angular'], function (angular) {
  'use strict';

  var module = angular.module('task-controllers-init', []);

  module.controller("taskControllersInit", function($scope) {
    $scope.task = {parent : '', title : 'Tareas'};
  });

});

