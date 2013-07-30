/*jslint browser: true*/
/*global define,CaliopeWebForm,
 CaliopeWebFormSpecificDecorator,
 CaliopeWebFormActionsDecorator,
 CaliopeWebFormValidDecorator,
 CaliopeWebFormValidDecorator,
 CaliopeWebFormAttachmentsDecorator,
 console*/

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

        $scope.$watch('jsonPlantilla', function (value) {
          if( value !== undefined ) {
            var result = caliopewebTemplateSrv.load(value, $scope);
            $scope.jsonPlantillaAngular = result.structureToRender;
            $scope.inputsFormTemplate   = result.elementsName;
            $scope.formUUID             = result.formUuid;
          }
        });

        $scope.init = function(template, mode, uuid) {
          var calwebtem = caliopewebTemplateSrv.caliopeForm;
          calwebtem.id     = template;
          calwebtem.mode   = mode;
          calwebtem.uuid   = uuid;

          $scope.caliopeForm = caliopewebTemplateSrv.caliopeForm;
          $scope.jsonPlantilla = caliopewebTemplateSrv.loadTemplateData();
        };


        $scope.initWithRouteParams = function() {

          caliopewebTemplateSrv.caliopeForm.id     = $routeParams.plantilla;
          caliopewebTemplateSrv.caliopeForm.mode   = $routeParams.mode;
          caliopewebTemplateSrv.caliopeForm.uuid   = $routeParams.uuid;
          $scope.caliopeForm = caliopewebTemplateSrv.caliopeForm;
          $scope.jsonPlantilla = caliopewebTemplateSrv.loadTemplateData();
        };


        if (caliopewebTemplateSrv.caliopeForm.mode === 'edit') {
          caliopewebTemplateSrv.caliopeForm.id     = $routeParams.plantilla;
          caliopewebTemplateSrv.caliopeForm.mode   = $routeParams.mode;
          caliopewebTemplateSrv.caliopeForm.uuid   = $routeParams.uuid;
          $scope.caliopeForm = caliopewebTemplateSrv.caliopeForm;
          caliopewebTemplateSrv.load();
        }
      }
  ]);

  moduleControllers.controller('CaliopeWebTemplateCtrlDialog',
    ['caliopewebTemplateSrv', 'dialog', '$scope',
      function (caliopewebTemplateSrv, dialog, $scope) {
        $scope.init = function(template, mode, uuid) {
          caliopewebTemplateSrv.caliopeForm.id     = template;
          caliopewebTemplateSrv.caliopeForm.mode   = mode;
          caliopewebTemplateSrv.caliopeForm.uuid   = uuid;
          $scope.caliopeForm = caliopewebTemplateSrv.caliopeForm;
          caliopewebTemplateSrv.load();
        };


        if( dialog !== undefined){
          $scope.closeDialog = function(){
            dialog.close('ok');
          };
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
