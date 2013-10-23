/*jslint browser: true*/
/*global define, console, $*/
define(['angular'], function (angular) {
  'use strict';
  var dirmodule = angular.module('ProyectoSummary', ['ui.bootstrap']);

  dirmodule.controller("summaryProyectoCtrl",
    ["$scope",'taskService', function($scope, taskService) {
      $scope.tasks = [];
      var maxpoint = 10;

      var result = function(category, total){
        var value = {'Done':maxpoint,'Doing': 0,'ToDo':0, 'archived':maxpoint};
        if(!angular.isUndefined(value[category])){
          total.users++;
          total.points+= value[category];
          return total;
        }
        return total;
      };

      var barclass = function(total){
        if(total > 80){return "-success";}
        if((60 < total) && (total < 80)){return "";}
        if((40 < total) && (total < 60)){return "-warning";}
        if((20 < total) && (total < 40)){return "-info";}
        return "-danger";
      };

      taskService.getAll().then(function(allTaskValues){
        angular.forEach(allTaskValues,function(vtask){

          var user, image, bclass;
          var total = {users: 0, points: 0};
          var category    = {};
          var name        = vtask.name;
          var descripcion = vtask.descripcion;

          angular.forEach(vtask.holders.target, function(vtarget){
            var user   = vtarget.entity_data;
            var exist  = false;
            angular.forEach(category, function(vcategory, kcategory){
              if(kcategory === vtarget.properties.category){
                exist = true;
                category[kcategory].push(user);
                total = result(kcategory, total);
              }
            });
            if(!exist){
              category[vtarget.properties.category] = [];
              category[vtarget.properties.category].push(user);
              total = result(vtarget.properties.category, total);
            }
          });

          total = (total.users === 0)? 0 : (total.points * 100)/( total.users * maxpoint);

          $scope.tasks.push({
            'name'  : name,
            'desc'  : descripcion,
            'cate'  : category,
            'total' : total,
            'bclass': barclass(total)
          });
        });
        console.log('data',$scope.tasks);
      });
    }]);
});
