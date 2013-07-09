/**
 * Define the module angular in RequireJS
 */
define(['angular'], function(angular) {
  'use strict';  
  
  /**
   * Define the module controllers for CaliopeWebTemplates
   */
  var moduleControllers = angular.module('CaliopeWebTemplateControllers',[])
  
  /**
   * Define the controller for management the events from view related with
   * templates of caliope framework
   */
  moduleControllers.controller('CaliopeWebTemplateCtrl', 
      ['caliopewebTemplateSrv', '$scope', '$routeParams', 
      function (service, $scope, $routeParams) {

        var caliopeForm = new Object(); 
        
        caliopeForm.id = $routeParams.plantilla;
        caliopeForm.mode = $routeParams.mode; 
        $scope.caliopeForm = caliopeForm;
                
        $scope.load = function () {
          $scope.jsonPlantillaWA = {};
          
          $scope.$watch('jsonPlantilla', function(value) {    
            if( value != null ) {
              var jsonTemplateAngular = service.completeTemplateForAngular(
                  value);            
              $scope.jsonPlantillaAngular = jsonTemplateAngular.form; 
            }
          });
          
          $scope.jsonPlantilla = service.loadTemplateData(caliopeForm);
          //$scope.jsonPlantillaLayout = service.loadTemplateLayout(caliopeForm)
        };
        
        if( caliopeForm.mode == 'create' || caliopeForm.mode == 'edit') {
          $scope.load();
        }

      }
      ]);
  
});