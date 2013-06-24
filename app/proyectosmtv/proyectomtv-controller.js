define(['angular'], function(angular) {
  'use strict';

  angular.module('ProyectoCtrl', []).controller('ProyectoCtrl', ['$scope', '$routeParams', function ($scope, $routeParams) {
    
    $scope.create = function () {
      var id = $scope.proyecto.id;
      var nombre = $scope.proyecto.nombre;  
      
      alert(id + ' ' + nombre);
      proyectoSrv.create(id, nombre); 
    };  
    
    
  }]);
  
});