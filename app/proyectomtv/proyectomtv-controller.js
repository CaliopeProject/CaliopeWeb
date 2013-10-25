define(['angular','caliopeWebForms','caliopeweb-formDirectives'], function(angular) {
  'use strict';

  var moduleControllers = angular.module('ProyectoControllers', ['CaliopeWebFormDirectives', 'wysiwygEditorDirective', 'fileuploaderDirectives']);


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
        if (result.data !== undefined) {
          var varname;
          for (varname in result.data) {
            if(result.data.hasOwnProperty(varname)) {
              $scope[varname] = result.data[varname];
            }
          }
        }
        */
      }
    } else if(result.error !== undefined) {
      throw new Error('Error load form from server.' + result.error.message);
    } else {
      throw new Error('Error load form from server. Form is empty');
    }
  }

  moduleControllers.controller('ProyectomtvCtrl',
    ['caliopewebTemplateSrv', 'caliopewebGridSrv', '$scope', '$routeParams',
    function (cwFormService, cwGridService, $scope, $routeParams) {

      $scope.initGrid = function() {
        /*
        TODO: Load the value gridEntity from server.
         */
        $scope.gridEntity = 'projects';
        var cwGrid = $scope.gridProjectsmtv;
        cwGrid.addColumn("name", {"name": "Nombre", "show" : true});
        //cwGrid.addColumn("locality", {"name": "Localidad", "show" : true});
        //cwGrid.addColumn("uuid", {"name": "Id", "show" : true});
        cwGrid.addColumn("tree", {"name": "Arbol", "show" : true});
        cwGrid.addColumn("Kanban", {"name": "Kanban", "show" : true});
        cwGrid.addColumn("actions", {"name": "Acciones", "show" : true, "width" : 200, "class" : "cell-center"});

        cwGrid.addColumnProperties("actions", {
          "htmlContent": '<widget-task category="\'ToDo\'" target-uuid="row.entity.uuid" target-entity="gridEntity"/>'
        });

        cwGrid.setDecorators([CaliopeWebGridDataDecorator, CWGridColumnsDefNgGridDecorator])
      };

      function loadForm(cwForm) {
        cwFormService.loadForm(cwForm, {}).then( function(result) {
          processResultLoadForm(result, $scope);
          $scope.showWidgetTask=false;

          if( result !== undefined && result.data !== undefined ) {
            var dataToView = cwForm.dataToViewData();
            if( dataToView !== undefined ) {
              angular.forEach(dataToView, function(value, key){
                $scope[key] = value;
              });
            }
          }

        });
      };

      $scope.initForm = function() {
        var cwForm = $scope['cwForm-project'];
        var methodSupport = cwForm.getEntityModel().concat('.').concat(cwForm.getMode());
        cwForm.setActionsMethodToShow([methodSupport]);
        loadForm(cwForm);
      };

      $scope.$on('actionComplete', function(event, result) {
        if( result[1] === true ) {

          $scope.targetTask.uuid = result[2].uuid;
          $scope.showWidgetTask = true;
          var cwForm = $scope['cwForm-project'];
          cwForm.setModelUUID(result[2].uuid);
          $scope.$broadcast('changeActions', [['projects.edit'],['projects.create']]);
        }
      });

    }]
  );
});
