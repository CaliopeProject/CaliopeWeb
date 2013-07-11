/**
* Define the module angular in RequireJS
*/
define(['angular'], function(angular) {
  'use strict';

  /**
  * Define the module controllers for CaliopeWebTemplates
  */
  var moduleControllers = angular.module('CaliopeWebTemplateControllers',[]);

  /**
  * Define the controller for management the events from view related with
  * templates of caliope framework
  */
  moduleControllers.controller('CaliopeWebTemplateCtrl',
    ['caliopewebTemplateSrv', '$scope', '$routeParams',
      function (service, $scope, $routeParams) {

        var caliopeForm = {};

        caliopeForm.id = $routeParams.plantilla;
        caliopeForm.mode = $routeParams.mode;
        $scope.caliopeForm = caliopeForm;

        function putDataScope(jsonTemplateData) {
          var varname;
          if( jsonTemplateData !== null ) {
            for ( varname in jsonTemplateData) {
              $scope[varname] = jsonTemplateData[varname].value;
            }
          }
        }

        $scope.load = function () {
          $scope.jsonPlantillaWA = {};

          $scope.$watch('jsonPlantilla', function(value) {
            if( value !== null ) {
              var content = value.data;
              var jsonTemplateAngular = service.completeTemplateForAngular.jsonTemplateGen(content);
              var inputs = service.completeTemplateForAngular.inputs();
              $scope.jsonPlantillaAngular = jsonTemplateAngular.form;
              $scope.inputsFormTemplate = inputs;
              putDataScope(content.data);
            }
          });

          $scope.jsonPlantilla = service.loadTemplateData(caliopeForm);
        };

        $scope.loadEdit = function() {

        };

        if( caliopeForm.mode === 'create') {
          $scope.load();
        }

        if(caliopeForm.mode === 'edit') {
          $scope.load();
        }

      }
  ]);

  moduleControllers.controller('SIIMFormCtrl',
    ['caliopewebTemplateSrv', '$scope', '$routeParams',
      function (caliopewebTemplateSrv, $scope, $routeParams) {
        $scope.$watch('resposeCreateForm', function(value) {
          var content = value.result;
          if (content === 'ok') {
             
          };
          $scope.processingResponse  = false;
        });

        $scope.create = function () {
          var formAng = $scope[$scope.caliopeForm.id];
          var inputs = $scope.inputsFormTemplate;
          var obj = {};
          var i;

          $scope.resposeCreateForm   = {};
          $scope.processingResponse  = true;

          for( i = 0; i < inputs.length; i++) {
            obj[inputs[i]] = $scope[inputs[i]];
          }
          $scope.resposeCreateForm = caliopewebTemplateSrv.sendDataForm(obj, $scope.caliopeForm.id);
        };
      }]
  );
});
