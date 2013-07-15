/*jslint browser: true*/
/*global define, console*/

/**
* Define the module angular in RequireJS
*/
define(['angular'], function (angular) {
  'use strict';

  /**
  * Define the module controllers for CaliopeWebTemplates
  */
  var moduleControllers = angular.module('CaliopeWebTemplateControllers', []);

  /**
  * Define the controller for management the events from view related with
  * templates of caliope framework
  */
  moduleControllers.controller('CaliopeWebTemplateCtrl',
    ['caliopewebTemplateSrv', '$scope', '$routeParams', 'HandlerResponseServerSrv',
      function (caliopewebTemplateSrv, $scope, $routeParams, handlerResServerSrv) {

        var caliopeForm = {};

        caliopeForm.id = $routeParams.plantilla;
        caliopeForm.mode = $routeParams.mode;
        caliopeForm.uuid = $routeParams.uuid;
        $scope.caliopeForm = caliopeForm;

        function putDataScope(jsonTemplateData) {
          var varname;
          if (jsonTemplateData !== undefined) {
            for (varname in jsonTemplateData) {
              $scope[varname] = jsonTemplateData[varname].value;
            }
          }
        }

        function load() {
          var message;
          $scope.jsonPlantillaWA = {};

          $scope.$watch('jsonPlantilla', function (value) {
              if (value !== undefined) {
                var content = value;
                handlerResServerSrv.process(value);
                message = handlerResServerSrv.message();                
                $scope.$emit('ChangeTextAlertMessage', [message]);
                
                var jsonTemplateAngular =                 
                  caliopewebTemplateSrv.completeTemplateForAngular.jsonTemplateGen(
                      content
                  );
                  
                var inputs = caliopewebTemplateSrv.completeTemplateForAngular.inputs();
                $scope.jsonPlantillaAngular = jsonTemplateAngular.form;
                $scope.inputsFormTemplate   = inputs;
                putDataScope(content.data);
              }
            });

          $scope.jsonPlantilla =
            caliopewebTemplateSrv.loadTemplateData(caliopeForm);
        }

        if (caliopeForm.mode === 'create') {
          load();
        }

        if (caliopeForm.mode === 'edit') {
          load();
        }

      }
  ]);

  moduleControllers.controller('SIIMFormCtrl',
    ['caliopewebTemplateSrv', 'HandlerResponseServerSrv', '$scope', '$routeParams',
      function (caliopewebTemplateSrv, handlerResServerSrv,
          $scope, $routeParams) {
      
        var message;

        function sendForm(caliopeForm) {
          var formAng = $scope[caliopeForm.id];
          var inputs = $scope.inputsFormTemplate;
          var obj = {};
          var i;
          
          $scope.$emit('ChangeTextAlertMessage', ["Procesando..emit"]);          
          
          $scope.resposeCreateForm   = {};
          $scope.processingResponse  = true;

          for (i = 0; i < inputs.length; i++) {
            obj[inputs[i]] = $scope[inputs[i]];
          }
          $scope.resposeCreateForm = caliopewebTemplateSrv.sendDataForm(
              obj, caliopeForm);
        }

        $scope.$watch('resposeCreateForm', function (value) {

          if (value !== undefined) {
            handlerResServerSrv.process(value);
            message = handlerResServerSrv.message();
            console.log(message);
            $scope.$emit('ChangeTextAlertMessage', [message]);
            var content = value.result;
            
	          if (content === 'ok') {
              console.log('Proyecto Creado', value.data.uuid);
              var dataList = $scope.dataList;
              if (dataList === undefined) {              
                dataList = [];
              }
              var inputs = $scope.inputsFormTemplate;
              var obj = {};
              var i;
              for (i = 0; i < inputs.length; i++) {
                obj[inputs[i]] = $scope[inputs[i]];
              }            
              obj.uuid = value.data.uuid; 
              dataList.push(obj);
              $scope.$parent.dataList = dataList;              
            }
          }
          $scope.processingResponse  = false;
        });

        $scope.create = function () {
          sendForm($scope.caliopeForm);
        };
        
        $scope.edit = function () {
          sendForm($scope.caliopeForm);
        };

      }]
  );
});
