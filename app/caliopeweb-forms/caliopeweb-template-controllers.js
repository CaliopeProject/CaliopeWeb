/*jslint browser: true*/
/*global define, console*/

/**
* Define the module angular in RequireJS
*/
define(['angular', 'caliopeWebForms', 'caliopeWebGrids'], function (angular) {
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

        function load() {

          $scope.jsonPlantillaWA = {};

          $scope.$watch('jsonPlantilla', function (value) {
              var content = value;
              if (content !== undefined && content.error === undefined &&
                  content.form !== undefined) {

                var caliopeWebForm = new CaliopeWebForm();
                caliopeWebForm.addStructure(content.form, content.form.name);
                caliopeWebForm.addActions(content.actions);
                caliopeWebForm.addData(content.data);
                caliopeWebForm.addTranslations(content.translations);

                CaliopeWebFormSpecificDecorator.createStructureToRender(caliopeWebForm);
                CaliopeWebFormActionsDecorator.createStructureToRender(caliopeWebForm);
                CaliopeWebFormValidDecorator.createStructureToRender(caliopeWebForm);
                CaliopeWebFormAttachmentsDecorator.createStructureToRender(caliopeWebForm);


                $scope.jsonPlantillaAngular = caliopeWebForm.createStructureToRender();
                $scope.inputsFormTemplate   = caliopeWebForm.getElementsName();
                $scope.formUUID = caliopeWebForm.getFormUUID();

                caliopeWebForm.putDataToContext($scope);
              }
            });

          $scope.jsonPlantilla =
            caliopewebTemplateSrv.loadTemplateData(caliopeForm);
        }

        $scope.init = function(template, mode) {
          caliopeForm.id = template;
          caliopeForm.mode = mode;
          $scope.caliopeForm = caliopeForm;
          load();
        };

        $scope.initWithRouteParams = function() {
          caliopeForm.id = $routeParams.plantilla;
          caliopeForm.mode = $routeParams.mode;
          caliopeForm.uuid = $routeParams.uuid;
          $scope.caliopeForm = caliopeForm;
          load();
        };


        if (caliopeForm.mode === 'edit') {
          caliopeForm.id = $routeParams.plantilla;
          caliopeForm.mode = $routeParams.mode;
          caliopeForm.uuid = $routeParams.uuid;
          $scope.caliopeForm = caliopeForm;
          load();
        }

      }
  ]);

  moduleControllers.controller('SIMMFormCtrl',
    ['caliopewebTemplateSrv', '$scope',
      function (caliopewebTemplateSrv, $scope) {

        $scope.$watch('responseSaveData', function (value) {

          if (value !== undefined) {
            var content = 'ok';

            if (content === 'ok') {
              console.log('Entidad Creada', value.uuid);
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

        $scope.sendAction = function(form, formTemplateName, actionMethod, formUUID, objID, paramsToSend) {

          var inputs = $scope.inputsFormTemplate;
          var obj = {};
          var i;

          $scope.responseSaveData   = {};

          if( paramsToSend === undefined || paramsToSend === '' ) {
            paramsToSend = [];
          } else {
            paramsToSend = paramsToSend.split(',');
          }

          for (i = 0; i < inputs.length; i++) {
            if( paramsToSend.length === 0 || paramsToSend.indexOf(inputs[i]) >= 0 ) {
              obj[inputs[i]] = $scope[inputs[i]];
            }
          }

          $scope.responseSaveData = caliopewebTemplateSrv.sendDataForm(formTemplateName,
              actionMethod, obj, formUUID, objID);

        };

      }]
  );

  moduleControllers.controller('SIMMGridCtrl',
      ['caliopewebTemplateSrv', '$scope', '$routeParams',
        function (caliopewebTemplateSrv,
                  $scope, $routeParams) {


          var caliopeForm = {};

          caliopeForm.id = $routeParams.plantilla;
          $scope.caliopeForm = caliopeForm;
          $scope.responseLoadDataGrid = {};

          $scope.data = [
          ];
          $scope.gridOptions = {
            'data': 'data'
          };

          function loadDataGrid() {
            var paramsSearch = {};
            $scope.responseLoadDataGrid = caliopewebTemplateSrv.loadDataGrid(
                caliopeForm.id, paramsSearch);
          }

          $scope.$watch('responseLoadDataGrid', function (value) {

            if( value !== undefined && value['error'] === undefined) {
              var caliopeWebGrid = new CaliopeWebGrid();
              caliopeWebGrid.addGridName($scope.caliopeForm.id);
              caliopeWebGrid.addData(value.data);
              CaliopeWebGridDataDecorator.createStructureToRender(caliopeWebGrid);
              var structureToRender = caliopeWebGrid.createStructureToRender();

              $scope.data = structureToRender.data;
              $scope.gridOptions = {
                'data'  : 'data'
              };
            } else {
              $scope.data = [
              ];
              $scope.gridOptions = {
                'data': 'data'
              };
            }

          });

          loadDataGrid();

      }]
  );
});
