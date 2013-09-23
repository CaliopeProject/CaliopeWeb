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
   *
   * @param result
   */
  function processResultLoadForm(result, $scope) {
    if( result !== undefined && result.error === undefined) {
      if( result !== undefined ) {
        if( result.structureToRender !== undefined ) {
          $scope.jsonPlantillaAngular = result.structureToRender;
        }
        if( result.elements !== undefined ) {
          $scope.elementsFormTemplate = result.elements;
        }
        $scope.modelUUID = result.modelUUID;
        $scope.entityModel = result.entityModel;

        /*
        Add data to scope
         */
        if (result.data !== undefined) {
          var varname;
          for (varname in result.data) {
            if(result.data.hasOwnProperty(varname)) {
              $scope[varname] = result.data[varname];
            }
          }
        }

      }
    }
  }

  /**
  * Define the controller for management the events from view related with
  * templates of caliope framework
  */
  moduleControllers.controller('CaliopeWebTemplateCtrl',
    ['caliopewebTemplateSrv', '$scope', '$routeParams',
      function (calwebTemSrv, $scope, $routeParams) {


        $scope.init = function(template, mode, uuid) {
          var calwebtem = calwebTemSrv.caliopeForm;
          calwebtem.id     = template;
          calwebtem.mode   = mode;
          calwebtem.uuid   = uuid;

          $scope.caliopeForm   = calwebTemSrv.caliopeForm;
          calwebTemSrv.loadTemplateData().then(function(result) {
            processResultLoadForm(result, $scope);
          });
        };

        $scope.initWithRouteParams = function(actionsToShow, generic) {
          var cwFormName = $scope['cwForm-name'];
          var cwForm = $scope[cwFormName];
          var params = {};

          var calwebtem = calwebTemSrv.caliopeForm;
          calwebtem.id     = $routeParams.entity;
          if( generic === true ) {
            params.formId = calwebtem.id;
            calwebtem.id  = 'form';
          }
          calwebtem.mode   = $routeParams.mode;
          calwebtem.uuid   = $routeParams.uuid;
          $scope.actionsToShow = actionsToShow;


          $scope.caliopeForm   = calwebTemSrv.caliopeForm;
          calwebTemSrv.loadTemplateData(params).then(function(result) {
            processResultLoadForm(result, $scope);
          });
        };

        if (calwebTemSrv.caliopeForm.mode === 'edit') {
          calwebTemSrv.caliopeForm.id     = $routeParams.entity;
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

        $scope.init = function() {
          var calwebtem = calwebTemSrv.caliopeForm;
          calwebtem.id     = action.template;
          calwebtem.mode   = action.mode;
          calwebtem.uuid   = action.uuid;

          $scope.dialogName = action.dialogName;
          $scope.fromDialog = true;

          $scope.caliopeForm   = calwebTemSrv.caliopeForm;
          calwebTemSrv.loadTemplateData().then(function(result) {
            var i;
            var inputs = result.elements;
            for (i = 0; i < inputs.length; i++) {
              var nameVarScope = inputs[i].name;
              if( action[nameVarScope] !== undefined) {
                $scope[nameVarScope] = action[nameVarScope];
              }
            }
            processResultLoadForm(result, $scope);
          });
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
    ['caliopewebTemplateSrv', 'global_constants', '$scope', '$filter',
      function (caliopewebTemplateSrv, GConst, $scope, $filter) {

        $scope.$watch('responseSendAction', function (value) {

          if (value !== undefined && value !== null) {

            if(value.error === undefined) {
              if($scope.fromDialog) {
                if($scope[$scope.dialogName] !== undefined) {
                  $scope[$scope.dialogName].close([true, $scope.dialogName]);
                }
              }
            } else {
              console.log('Server error response', value.error);
            }
          }
        });


        $scope.sendAction = function(form, formTemplateName, actionMethod, modelUUID, objID, paramsToSend) {

          var cwFormName = $scope['cwForm-name'];

          var cwForm = $scope[cwFormName];
          if( cwForm !== undefined ) {
            $scope.responseSendAction   = {};
            var data = cwForm.dataToServerData($scope);
            $scope.responseSendAction = caliopewebTemplateSrv.sendDataForm(formTemplateName,
                actionMethod, data, modelUUID, objID);
          }

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
