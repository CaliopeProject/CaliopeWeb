define(['angular'], function(angular) {
  'use strict';

  var moduleControllers = angular.module('ProyectoControllers', []);
  
  moduleControllers.controller('ProyectomtvCtrl', 
      ['proyectoSrv','$scope', '$routeParams', 
       function (service, $scope, $routeParams) {
       
        $scope.create = function () {
          var id = $scope.proyecto.id;
          var nombre = $scope.proyecto.nombre;  
                    
          service.create($scope.proyecto); 
        };         
      }]
  ); 
});