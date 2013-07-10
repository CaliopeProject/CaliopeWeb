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
        
        function putDataScope(jsonTemplateData) {         
          if( jsonTemplateData != null ) {
            for ( var varname in jsonTemplateData) {
              $scope[varname] = jsonTemplateData[varname].value;
            }
          }          
        }
                
        $scope.load = function () {
          $scope.jsonPlantillaWA = {};
          
          $scope.$watch('jsonPlantilla', function(value) {    
            if( value != null ) {
              
              var jsonTemplateAngular = service.completeTemplateForAngular.jsonTemplateGen(value);              
              var inputs = service.completeTemplateForAngular.inputs();              
              $scope.jsonPlantillaAngular = jsonTemplateAngular.form;
              $scope.inputsFormTemplate = inputs;
              putDataScope(value.data);
            }
          });
          
          $scope.jsonPlantilla = service.loadTemplateData(caliopeForm);
        };
        
        $scope.loadEdit = function() {
          
        };
        
        if( caliopeForm.mode == 'create') {
          $scope.load();
        } 
        if(caliopeForm.mode == 'edit') {
          $scope.load();
        }

      }
      ]);
  
  moduleControllers.controller('SIIMFormCtrl', 
      ['caliopewebTemplateSrv', '$scope', '$routeParams', 
      function (caliopewebTemplateSrv, $scope, $routeParams) {
      
        $scope.create = function () {
          var formAng = $scope[$scope.caliopeForm.id];         
          var inputs = $scope.inputsFormTemplate;          
          var obj = {};
          for( var i = 0; i < inputs.length; i++) {
            obj[inputs[i]] = $scope[inputs[i]];
          }                              
          caliopewebTemplateSrv.sendDataForm(obj, $scope.caliopeForm.id);
        };        
      }]
  );
      
  
  
});