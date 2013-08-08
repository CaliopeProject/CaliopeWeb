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
      function (calwebTemSrv, $scope, $routeParams) {

        $scope.$watch('jsonPlantilla', function (value) {
          if( value !== undefined ) {
            var result = calwebTemSrv.load(value, $scope);
            if( result.structureToRender !== undefined ) {
              $scope.jsonPlantillaAngular = result.structureToRender;
            }
            if( result.elementsName !== undefined ) {
              $scope.elementsFormTemplate   = result.elementsName;
            }
            $scope.formUUID               = result.formUuid;
          }
        });

        $scope.init = function(template, mode, uuid) {
          var calwebtem = calwebTemSrv.caliopeForm;
          calwebtem.id     = template;
          calwebtem.mode   = mode;
          calwebtem.uuid   = uuid;

          $scope.caliopeForm   = calwebTemSrv.caliopeForm;
          $scope.jsonPlantilla = calwebTemSrv.loadTemplateData();
        };

        $scope.initWithRouteParams = function() {
          var calwebtem = calwebTemSrv.caliopeForm;
          calwebtem.id     = $routeParams.plantilla;
          calwebtem.mode   = $routeParams.mode;
          calwebtem.uuid   = $routeParams.uuid;

          $scope.caliopeForm   = calwebTemSrv.caliopeForm;
          $scope.jsonPlantilla = calwebTemSrv.loadTemplateData();
        };


        if (calwebTemSrv.caliopeForm.mode === 'edit') {
          calwebTemSrv.caliopeForm.id     = $routeParams.plantilla;
          calwebTemSrv.caliopeForm.mode   = $routeParams.mode;
          calwebTemSrv.caliopeForm.uuid   = $routeParams.uuid;
          $scope.caliopeForm = calwebTemSrv.caliopeForm;
          calwebTemSrv.load();
        }
      }
  ]);

  moduleControllers.controller('CaliopeWebTemplateCtrlDialog',
    ['caliopewebTemplateSrv', 'dialog', '$scope', 'action', 'taskService',
      function (calwebTemSrv, dialog, $scope, action, taskService) {

        $scope.$watch('jsonPlantilla', function (value) {
          if( value !== undefined ) {
            var result = calwebTemSrv.load(value, $scope);
            $scope.jsonPlantillaAngular = result.structureToRender;
            $scope.elementsFormTemplate   = result.elements;
            $scope.formUUID             = result.formUuid;

            var inputs = $scope.elementsFormTemplate;
            var i;
            for (i = 0; i < inputs.length; i++) {
              var nameVarScope = inputs[i].name;
              if( action[nameVarScope] !== undefined) {
                $scope[nameVarScope] = action[nameVarScope];
              }
            }
          }
        });

        $scope.init = function() {
          var calwebtem = calwebTemSrv.caliopeForm;
          calwebtem.id     = action.template;
          calwebtem.mode   = action.mode;
          calwebtem.uuid   = action.uuid;

          $scope.caliopeForm   = calwebTemSrv.caliopeForm;
          $scope.jsonPlantilla = calwebTemSrv.loadTemplateData();
        };

        if( dialog !== undefined){
          $scope.closeDialog = function(){
            taskService.cancelTask();
          };
        }

        $scope.initDelete = function() {
          console.log('Init delete', action)
          $scope.formDelete = action.template
          $scope.templateToDelete = action.template
          $scope.actionMethodDelete = action.actionMethod
          $scope.uuidToDelete = action.uuid
        };

      }
  ]);

  moduleControllers.controller('SIMMFormCtrl',
    ['caliopewebTemplateSrv', '$scope', '$filter',
      function (caliopewebTemplateSrv, $scope, $filter) {

        $scope.$watch('responseSaveData', function (value) {

          if (value !== undefined) {
            var content = 'ok';

            if (content === 'ok') {
              console.log('Entidad Creada', value.uuid);
              var dataList = $scope.dataList;
              if (dataList === undefined) {
                dataList = [];
              }
              var inputs = $scope.elementsFormTemplate;
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

          var inputs = $scope.elementsFormTemplate;
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
              var nameVarScope = inputs[i].name;
              if( $scope[nameVarScope] !== undefined ) {
                var value;
                if(inputs[i].type === 'text' && inputs[i].type1 === 'datepicker') {
                  value = $filter('date')($scope[nameVarScope], inputs[i].format );
                } else if(inputs[i].type === 'select') {
                  value = $scope[nameVarScope];
                } else {
                  value = $scope[nameVarScope];
                }
                obj[nameVarScope] = value;
              }
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

          $scope.data = [];

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
