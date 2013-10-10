/*jslint browser: true*/
/*global define, console, $*/
define(['angular'], function (angular) {
  'use strict';
  var dirmodule = angular.module('ProyectoSummary', ['ui.bootstrap']);

  dirmodule.controller("summaryProyecto",
    ["$scope",'taskService', function($scope, taskService) {
      $scope.task = [];
      taskService.getAll().then(function(allTaskValues){
        angular.forEach(allTaskValues,function(vtask){
          var user, image;
          var category = [];
          var name = vtask.name;
          var descripcion = vtask.descripcion;
          angular.forEach(vtask.holders.target, function(vtarget){
            var user = {};
            var exist= false;
            user.name  = vtarget.user.name;
            user.image = vtarget.user.image;
            angular.forEach(category, function(vcategory, kcategory){
              if(vcategory.name === vtarget.properties.category){
                exist = true;
                vcategory[kcategory].users.push(user);
              }
            });
            if(!exist){
              category.push({name : vtarget.properties.category, users: [user]});
            }
          });
          $scope.task.push({task: name, desc: descripcion, cate: category});
        });
      });
    }]);
});
