define(['angular'], function(angular) {
  'use strict';  
  

  angular.module('caliopewebFormsCtrl',[]).controller('caliopewebFormsCtrl', ['caliopewebTemplateSrv', '$scope', '$routeParams', function (caliopewebTemplateSrv, $scope, $routeParams) {

    var caliopeForm = new Object(); 
    
    caliopeForm.id = $routeParams.plantilla;
    caliopeForm.mode = $routeParams.mode; 
    $scope.caliopeForm = caliopeForm;
    
     $scope.load = function () {
      
      //$scope.jsonPlantilla = 'B';                 
       $scope.jsonPlantilla = caliopewebTemplateSrv.load(caliopeForm);
      
      //$scope.jsonPlantilla = jsonPlantilla;

//      $scope.$watch('jsonPlantilla', function(newValue, oldValue) { 
//        console.log('NV:',  newValue);
//        console.log('OV:',  oldValue)
//      }); 
      
    };    
    
    if( caliopeForm.mode == 'create' || caliopeForm.mode == 'edit') {
      $scope.load();
    }

  }]);
  
});