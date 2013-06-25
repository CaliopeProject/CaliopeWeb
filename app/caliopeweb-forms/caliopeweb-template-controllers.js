define(['angular'], function(angular) {
  'use strict';  
  

  angular.module('caliopewebFormsCtrl',[]).controller('caliopewebFormsCtrl', ['caliopewebTemplateSrv', '$scope', '$routeParams', function (caliopewebTemplateSrv, $scope, $routeParams) {

    var caliopeForm = new Object(); 
    
    caliopeForm.id = $routeParams.plantilla;
    caliopeForm.mode = $routeParams.mode; 
    $scope.caliopeForm = caliopeForm;
    
    //$scope.jsonPlantilla = 'B';
    //$scope.jsonPlantilla = 'B';
    
 
    
    $scope.load = function () {
      
      //$scope.jsonPlantilla = 'B';           
      $scope.jsonPlantilla = 'D';      
      var promise = caliopewebTemplateSrv.load(caliopeForm);
      
      //$scope.jsonPlantilla = jsonPlantilla;

      $scope.$watch('jsonPlantilla', function(newValue, oldValue) { 
        console.log('NV:',  newValue);
        console.log('OV:',  oldValue)
      }); 
      
    };    
    
    if( caliopeForm.mode == 'create' || caliopeForm.mode == 'edit') {
      $scope.load();
      $scope.jsonPlantilla = 'C';
    }

  }]);
  
});