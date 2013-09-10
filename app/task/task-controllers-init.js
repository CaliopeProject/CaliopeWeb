/*jslint browser: true*/
/*global define, console, $*/

define(['angular'], function (angular) {
  'use strict';

  var module = angular.module('task-controllers-init', []);

  module.controller("taskControllersInit", function($scope) {
    $scope.task = {title : 'Tareas'};

    $scope.choices1 = [
      {value: 1, text:'Este es un nombre decente'},
      {value: 2, text:'bbb'},
      {value: 3, text:'ccc'},
      {value: 2, text:'bbb'}
    ];

    $scope.selectedChoices1 = [
      {value: 1, text:'aaa'}
    ];


    $scope.addChoice = function(choices, newValueName, newTextName) {
      choices.push({value: $scope[newValueName], text: $scope[newTextName]});
      $scope[newValueName]='';
      $scope[newTextName]='';
    };

  });

});

