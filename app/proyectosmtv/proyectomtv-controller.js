define(['angular'], function(angular) {
  'use strict';

  var moduleControllers = angular.module('ProyectoControllers', []);
  
  moduleControllers.controller('ProyectoCtrl', ['caliopewebTemplateSrv','$scope', '$routeParams', function (service, $scope, $routeParams) {
       
    $scope.create = function () {
      var id = $scope.proyecto.id;
      var nombre = $scope.proyecto.nombre;  
      
      console.log('proyecto', $scope.proyecto)
      
      proyectoSrv.create($scope.proyecto); 
    };  
        
  }]); 
});