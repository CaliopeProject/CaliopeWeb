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
          if( value !== undefined && value.error === undefined) {
            var result = calwebTemSrv.load(value, $scope, $scope.actionsToShow);
            if( result !== undefined ) {
              if( result.structureToRender !== undefined ) {
                $scope.jsonPlantillaAngular = result.structureToRender;
              }
              if( result.elements !== undefined ) {
                $scope.elementsFormTemplate   = result.elements;
              }
              $scope.modelUUID               = result.modelUUID;
            }
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

        $scope.initWithRouteParams = function(actionsToShow) {
          var calwebtem = calwebTemSrv.caliopeForm;
          calwebtem.id     = $routeParams.plantilla;
          calwebtem.mode   = $routeParams.mode;
          calwebtem.uuid   = $routeParams.uuid;
          $scope.actionsToShow = actionsToShow;

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
          if( value !== undefined && value.error === undefined) {
            var result = calwebTemSrv.load(value, $scope);
            if( result !== undefined ) {
              $scope.jsonPlantillaAngular = result.structureToRender;
              $scope.elementsFormTemplate   = result.elements;
              $scope.modelUUID             = result.modelUUID;

              var inputs = $scope.elementsFormTemplate;
              var i;
              for (i = 0; i < inputs.length; i++) {
                var nameVarScope = inputs[i].name;
                if( action[nameVarScope] !== undefined) {
                  $scope[nameVarScope] = action[nameVarScope];
                }
              }
            }
          }
        });

        $scope.init = function() {
          var calwebtem = calwebTemSrv.caliopeForm;
          calwebtem.id     = action.template;
          calwebtem.mode   = action.mode;
          calwebtem.uuid   = action.uuid;

          $scope.dialogName = action.dialogName;
          $scope.fromDialog = true;

          $scope.caliopeForm   = calwebTemSrv.caliopeForm;
          $scope.jsonPlantilla = calwebTemSrv.loadTemplateData();
        };

        $scope.initFromDialog = function() {
          $scope.message      = action.message;
          $scope.form         = action.template;
          $scope.template     = action.template;
          $scope.actionMethod = action.actionMethod;
          $scope.uuid         = action.uuid;
          $scope.dialogName   = action.dialogName;
          $scope.fromDialog   = true;
        };

        $scope.closeDialog = function (dialogName) {

          if( dialogName !== undefined ) {
            if($scope[dialogName] !== undefined) {
              $scope[dialogName].close([false, dialogName]);
              $scope.fromDialog = false;
            }
          }
        };

      }
  ]);

  moduleControllers.controller('SIMMFormCtrl',
    ['caliopewebTemplateSrv', '$scope', '$filter',
      function (caliopewebTemplateSrv, $scope, $filter) {

        $scope.$watch('responseSendAction', function (value) {

          if (value !== undefined && value !== null) {

            if(value.error === undefined) {

              if($scope.fromDialog) {
                if($scope[$scope.dialogName] !== undefined) {
                  $scope[$scope.dialogName].close([true, $scope.dialogName]);
                }
              }

              /*
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

              */
            } else {
              console.log('Server error response', value.error);
            }
          }
        });

        $scope.sendAction = function(form, formTemplateName, actionMethod, modelUUID, objID, paramsToSend) {

          var inputs = $scope.elementsFormTemplate;
          var obj = {};
          var i;

          $scope.responseSendAction   = {};

          if( paramsToSend === undefined || paramsToSend === '' ) {
            paramsToSend = [];
          } else {
            paramsToSend = paramsToSend.split(',');
          }

          if( inputs !== undefined ) {
            for (i = 0; i < inputs.length; i++) {
              if( paramsToSend.length === 0 || paramsToSend.indexOf(inputs[i]) >= 0 ) {
                var nameVarScope = inputs[i].name;
                if( $scope[nameVarScope] !== undefined ) {
                  var value;
                  if(inputs[i].type === 'div' && inputs[i].type1 === 'datepicker') {
                    value = $scope[nameVarScope].getTime();
                  } else if(inputs[i].type === 'select') {
                    value = $scope[nameVarScope];
                  } else if(inputs[i].type === 'ui-mcombo-choices' && inputs[i].type1 === 'multi-choices') {
                    if($scope[nameVarScope] instanceof Array) {
                      var j;
                      value = [];
                      for( j=0; j<$scope[nameVarScope].length; j++) {
                        if( $scope[nameVarScope][j].value !== undefined) {
                          //value = value.concat($scope[nameVarScope].value);
                          value.push($scope[nameVarScope][j].value);
                        }
                      }
                    }
                  } else {
                    value = $scope[nameVarScope];
                  }
                  obj[nameVarScope] = value;
                }
              }
            }
          }

          $scope.responseSendAction = caliopewebTemplateSrv.sendDataForm(formTemplateName,
              actionMethod, obj, modelUUID, objID);

        };

      }]
  );

  moduleControllers.controller('SIMMGridCtrl',
      ['caliopewebGridSrv', '$scope', '$routeParams',
        function (cwGridService, $scope, $routeParams) {


        function loadDataGrid() {
          var paramsSearch = {};
          $scope.responseLoadDataGrid = cwGridService.loadDataGrid(
              $scope.methodLoadDataGrid, paramsSearch);
        }

        $scope.methodLoadDataGrid = "";
        $scope.gridName = "";

        $scope.init = function(_method, gridName, columnsToRender) {
          $scope.methodLoadDataGrid = _method;
          $scope.gridName = gridName;
        };

        $scope.responseLoadDataGrid = {};

        $scope.data = [];


        $scope.gridOptions = {
          data: 'data',
          columnDefs: 'columnDefs'
        };

        $scope.loadDataGrid = function()  {
          loadDataGrid();
        };

        $scope.$watch('responseLoadDataGrid', function (value) {

          if( value !== undefined ) {
            if( value.error !== undefined) {
              //TODO: Manejar error
            }
            if( value.gridToRender !== undefined && value.gridToRender.data !== undefined) {
              $scope.data = value.gridToRender.data;
              $scope.columnDefs = [
                {field:'name', displayName:'Name'},
                {field:'uuid', displayName:'Id'}
              ];
              $scope.gridOptions = {
                data  : 'data',
                columnDefs: 'columnDefs'
              };
            } else {
              //TODO: Manejar error
            }
          }
        });

      }]
  );
});
