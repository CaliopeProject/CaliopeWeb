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
          var message;
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
                var formName = caliopeWebForm.getFormName();

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
          load();
        };

        $scope.initWithRouteParams = function() {
          caliopeForm.id = $routeParams.plantilla;
          caliopeForm.mode = $routeParams.mode;
          caliopeForm.uuid = $routeParams.uuid;
          $scope.caliopeForm = caliopeForm;
          load();
        }


        if (caliopeForm.mode === 'edit') {
          load();
        }

      }
  ]);

  moduleControllers.controller('SIMMFormCtrl',
    ['caliopewebTemplateSrv', '$scope', '$routeParams',
      function (caliopewebTemplateSrv,
          $scope, $routeParams) {

        var message;

        function saveData(caliopeForm, formUUID, uuidData) {

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
              obj, formUUID, caliopeForm);
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
          saveData($scope.caliopeForm, $scope.formUUID);
        };

        $scope.edit = function () {
          var uuidData = $scope.caliopeForm.uuid;
          saveData($scope.caliopeForm, $scope.formUUID, uuidData);
        };

        $scope.delete = function() {
          var uuidData = $scope.caliopeForm.uuid;
          deleteData($scope.caliopeForm, uuidData)
        }

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
          };

          $scope.$watch('responseLoadDataGrid', function (value) {

            if( value !== undefined && value['error'] === undefined) {
              var caliopeWebGrid = new CaliopeWebGrid();
              caliopeWebGrid.addGridName($scope.caliopeForm.id);
              caliopeWebGrid.addData(value.data);
              CaliopeWebGridDataDecorator.createStructureToRender(caliopeWebGrid);
              var structureToRender = caliopeWebGrid.createStructureToRender();
              console.log('Structure To Render', structureToRender);

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

          loadDataGrid($scope.caliopeForm);

      }]
  );
});
