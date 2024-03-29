/*jslint browser: true, unparam: true*/
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
define(['angular', 'caliopeWebForms', 'caliopeWebGrids','jquery.fileupload',
  'caliopeweb-formDirectives', 'angular-ui-ng-grid', 'angular-ui-bootstrap-bower', 'caliopeweb-statusDirectives'], function (angular) {
  'use strict';

  /**
  * Define the module controllers for CaliopeWebTemplates
  */
  var moduleControllers = angular.module('CaliopeWebTemplateControllers',
      ['CaliopeWebFormDirectives', 'ngGrid', 'ui.bootstrap', 'status-directives']);

  /**
   *
   * @param result
   * @param $scope
   */
  function processResultLoadForm(result, $scope) {
    if( result !== undefined && result.error === undefined) {
      if( result !== undefined ) {
        if( result.structureToRender !== undefined ) {
          var varTemplate = 'jsonPlantillaAngular';
          if($scope['cwForm-varTemplate'] !== undefined) {
            varTemplate = $scope['cwForm-varTemplate'];
          }
          $scope[varTemplate] = result.structureToRender;
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
    ['caliopewebTemplateSrv', '$scope', '$routeParams', 'caliopeWebFormNotification',
      function (calwebTemSrv, $scope, $routeParams, cwFormNotif) {


        $scope.persons = [
          {name:'Daniel', surname:'Ochoa'},
          {name:'Jorge', surname:'Tellez'},
          {name:'Monica', surname:'Fernandez'},
          {name:'Geronimo', surname:'Sanchez'},
          {name:'Maria', surname:'Perez'}
        ];


        function processGenericForm(cwForm, params, entity) {
            params.formId = entity;
            cwForm.setEntityModel('form');
            $scope.entityModel = entity;
        }

        function getForm() {
          var cwFormName = $scope['cwForm-name'];
          return $scope[cwFormName];
        }

        $scope.init = function() {

          var cwForm = getForm();
          var params = {};


          if(cwForm.getModelUUID() !== undefined && cwForm.getModelUUID().length > 0) {
            $scope.showWidgetTask=true;
          }

          if( cwForm.getGenericForm() === true ) {
            processGenericForm(cwForm, params, cwForm.getEntityModel());

          }

          $scope.caliopeForm   = cwForm;

          calwebTemSrv.loadForm(cwForm, params).then(function(result) {
            processResultLoadForm(result, $scope);
            if( cwForm.getGenericForm() === true ) {
              $scope.entityModel = params.formId;
            }
          });
        };

        $scope.initWithRouteParams = function(actionsToShow, generic) {
          var cwFormName = $scope['cwForm-name'];
          var cwForm = $scope[cwFormName];
          var params = {};

          if($routeParams.uuid !== undefined && $routeParams.uuid.length > 0) {
            $scope.showWidgetTask=true;
          }
          if( generic === true || generic === "true") {
            processGenericForm(cwForm, params, $routeParams.entity);
            $scope.entityModel = $routeParams.entity;
          }

          $scope.actionsToShow = actionsToShow;
          $scope.caliopeForm   = cwForm;

          calwebTemSrv.loadForm(cwForm,params).then(function(result) {
            processResultLoadForm(result, $scope);
            if( generic === true ) {
              $scope.entityModel = params.formId;
            }
          });
        };

        $scope.$on('actionComplete', function(event, result) {
          if( result[1] === true ) {
            var cwFormName = $scope['cwForm-name'];
            var cwForm = $scope[cwFormName];
            $scope.targetTask.uuid = cwForm.getModelUUID();
            $scope.showWidgetTask = true;
          }
        });

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
    ['caliopewebTemplateSrv', 'dialog', '$scope', 'action',
      function (calwebTemSrv, dialog, $scope, action) {

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
            var nameVarScope;
            var inputs = result.elements;
            for (i = 0; i < inputs.length; i++) {
              nameVarScope = inputs[i].name;
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
    ['caliopewebTemplateSrv',  '$scope', '$filter',
      function (caliopewebTemplateSrv, $scope, $filter) {

        $scope.sendAction = function(form, formTemplateName, actionMethod, modelUUID, objID, paramsToSend, encapsulateInData) {

          var cwFormName = $scope['cwForm-name'];

          var cwForm = $scope[cwFormName];
          var data = {};

          if( cwForm !== undefined ) {
            data = cwForm.dataToServerData($scope, paramsToSend);
            if( cwForm.getModelUUID() !== undefined ) {
              modelUUID = cwForm.getModelUUID();
              objID = cwForm.getModelUUID();
            }
          }

          caliopewebTemplateSrv.sendDataForm(formTemplateName,
              actionMethod, data, objID, encapsulateInData).then( function(value) {

              if (value !== undefined && value !== null) {

                if(value.error === undefined) {
                  if($scope.fromDialog) {
                    if($scope[$scope.dialogName] !== undefined) {
                      $scope[$scope.dialogName].close([true, $scope.dialogName]);
                    }
                  }

                  $scope.$emit('actionComplete', [actionMethod, true, value, cwForm]);
                } else {
                  $scope.$emit('actionComplete', [actionMethod, false, value, cwForm]);
                  console.log('Server error response', value.error);
                }
              }
            });

          $scope.$on('changeActions', function(event, actionsConf) {
            var actionsToShow = actionsConf[0];
            var actionsToHide = actionsConf[1];

            angular.forEach(actionsToShow, function(v){
              $scope.$eval('showAct_'.concat(v).concat('= true'));
            });
            angular.forEach(actionsToHide, function(v){
              $scope.$eval('showAct_'.concat(v).concat('= false'));
            });

          });

        };

      }]
  );

  moduleControllers.controller('SIMMGridCtrl',
      ['caliopewebGridSrv', '$scope',
        function (cwGridService, $scope) {


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

