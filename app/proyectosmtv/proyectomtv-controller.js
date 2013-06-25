define(['angular'], function(angular) {
  'use strict';

  angular.module('ProyectoCtrl', []).controller('ProyectoCtrl', ['caliopewebTemplateSrv','$scope', '$routeParams', function (service, $scope, $routeParams) {
    
    var caliopeForm = new Object(); 
    
    caliopeForm.id = $routeParams.plantilla;
    caliopeForm.mode = $routeParams.mode; 
    $scope.caliopeForm = caliopeForm;
    
    alert('ProyectoCtrl');
    $scope.jsonPlantilla = service.load(caliopeForm);
    
    $scope.create = function () {
      var id = $scope.proyecto.id;
      var nombre = $scope.proyecto.nombre;  
      
      alert(id + ' ' + nombre);
      //proyectoSrv.create(id, nombre); 
    };  
    
    
  }]);
  
  /*
  moduleangular.module('ProyectoCtrl').controller('customerList', ['MyService', function(MyService){
    $scope.customers = MyService.getCustomers();
  }]);
  
  var module = angular.module('ProyectoCtrl', []);
  
  module.controller('ProyectoCtrl', ['$scope', '$routeParams', function ($scope, $routeParams) {
    
    $scope.create = function () {
      var id = $scope.proyecto.id;
      var nombre = $scope.proyecto.nombre;  
      
      alert(id + ' ' + nombre);
      //proyectoSrv.create(id, nombre); 
    };  
        
  }]);
  
  moduleangular.module('ProyectoCtrl').controller('customerList', ['MyService', function(MyService){
    $scope.customers = MyService.getCustomers();
  }]);
  */  
});