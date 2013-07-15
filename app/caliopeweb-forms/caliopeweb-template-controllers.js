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
    ['caliopewebTemplateSrv', '$scope', '$routeParams',
      function (caliopewebTemplateSrv, $scope, $routeParams) {

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
              var content = value;
              if (content !== undefined) {

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

        if(caliopeForm.mode === 'delete' ) {

        }

      }
  ]);

  moduleControllers.controller('SIMMFormCtrl',
    ['caliopewebTemplateSrv', '$scope', '$routeParams',
      function (caliopewebTemplateSrv,
          $scope, $routeParams) {

        var message;

        function saveData(caliopeForm, uuidData) {
          var formAng = $scope[caliopeForm.id];
          var inputs = $scope.inputsFormTemplate;
          var obj = {};
          var i;

          $scope.responseSaveData   = {};

          for (i = 0; i < inputs.length; i++) {
            obj[inputs[i]] = $scope[inputs[i]];
          }
          if(uuidData !== undefined) {
            obj['uuid'] = uuidData;
          }
          $scope.responseSaveData = caliopewebTemplateSrv.sendDataForm(
              obj, caliopeForm);
        }

        function deleteData(caliopeForm, uuidData) {
          caliopeForm.mode = 'delete';

          var obj = {};
          $scope.responseDeleteData   = {};

          if(uuidData !== undefined) {
            obj['uuid'] = uuidData;
          }
          $scope.responseDeleteData = caliopewebTemplateSrv.sendDataForm(
              obj, caliopeForm);
        }

        $scope.$watch('responseSaveData', function (value) {

          if (value !== undefined) {
            var content = 'ok';

	          if (content === 'ok') {
              console.log('Proyecto Creado', value.uuid);
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
              obj.uuid = value.uuid;
              dataList.push(obj);
              $scope.$parent.dataList = dataList;
            }
          }
        });

        $scope.$watch('responseDeleteData', function (value) {
          if( value !== undefined ) {
            //TODO: Definir que se debe hacer cuando se eliminan datos.
          }
        });

        $scope.create = function () {
          saveData($scope.caliopeForm);
        };

        $scope.edit = function () {
          var uuidData = $scope.caliopeForm.uuid;
          saveData($scope.caliopeForm, uuidData);
        };

        $scope.delete = function() {
          var uuidData = $scope.caliopeForm.uuid;
          deleteData($scope.caliopeForm, uuidData)
        }

      }]
  );
});
