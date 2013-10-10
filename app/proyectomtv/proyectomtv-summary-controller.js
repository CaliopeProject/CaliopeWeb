/*jslint browser: true*/
/*global define, console, $*/
define(['angular'], function (angular) {
  'use strict';
  var dirmodule = angular.module('ProyectoSummary', ['ui.bootstrap']);

  dirmodule.controller("summaryProyecto",
    ["$scope",'taskService', function($scope, taskService) {
      $scope.tasks = [];
      taskService.getAll().then(function(allTaskValues){
        angular.forEach(allTaskValues,function(vtask){
          var user, image;
          var category = [];
          var name = vtask.name;
          var descripcion = vtask.descripcion;
          angular.forEach(vtask.holders.target, function(vtarget){
            var user   = vtarget.entity_data;
            var exist  = false;
            angular.forEach(category, function(vcategory, kcategory){
              if(vcategory.name === vtarget.properties.category){
                exist = true;
                if(angular.isUndefined(category[kcategory].users)){
                  category[kcategory].push({users: [user]});
                }else{
                  category[kcategory].users.push(user);
                }
              }
            });
            if(!exist){
              category.push({name : vtarget.properties.category, users: [user]});
            }
          });
          $scope.tasks.push({'name': name, desc: descripcion, cate: category});
        });
      });
    }]);
});
