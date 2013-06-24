define(['angular'], function(angular) {
  'use strict';  
  

  angular.module('caliopeFormsCtrl',[]).controller('caliopeFormsCtrl', ['caliopeweb-templateService', '$scope', '$routeParams', function (caliopeFormsSrv, $scope, $routeParams) {

    var caliopeForm = new Object(); 
    
    caliopeForm.id = $routeParams.plantilla;
    caliopeForm.mode = $routeParams.mode; 
    $scope.caliopeForm = caliopeForm;
      
    $scope.load = function () {       
      var jsonPlantilla = caliopeFormsSrv.load(caliopeForm);
      $scope.jsonPlantilla = jsonPlantilla;
    };

    if( caliopeForm.mode == 'create' || caliopeForm.mode == 'edit') {
      $scope.load();
    }

  }]);
  
});
  
    


/*
var moduleControllers = Application.Controllers;

var controller = moduleControllers.controller('caliopeFormsCtrl', ['caliopeFormsSrv', '$scope', '$routeParams', function (caliopeFormsSrv, $scope, $routeParams) {

	var caliopeForm = new Object();	
	
	caliopeForm.id = $routeParams.plantilla;
	caliopeForm.mode = $routeParams.mode;	
	$scope.caliopeForm = caliopeForm;
		
	$scope.load = function () {				
		var jsonPlantilla = caliopeFormsSrv.load(caliopeForm);
		$scope.jsonPlantilla = jsonPlantilla;
	};

	if( caliopeForm.mode == 'create' || caliopeForm.mode == 'edit') {
		$scope.load();
	}

}]);
*/