define(['angular'], function(angular) {
  'use strict';

  var moduleControllers = angular.module('ProyectoControllers', []);
  
  moduleControllers.controller('ProyectoCtrl', 
      ['proyectoSrv','$scope', '$routeParams', 
       function (service, $scope, $routeParams) {
       
        $scope.create = function () {
          var id = $scope.proyecto.id;
          var nombre = $scope.proyecto.nombre;  
          
          console.log('proyecto', $scope.proyecto)
          
          //service.create($scope.proyecto); 
        };         
      }]
  ); 
});