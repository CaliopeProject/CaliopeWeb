define(['angular'], function(angular) {
  'use strict';

  var moduleControllers = angular.module('ProyectoControllers', []);

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

        if (result.data !== undefined) {
          var varname;
          for (varname in result.data) {
            if(result.data.hasOwnProperty(varname)) {
              $scope[varname] = result.data[varname];
            }
          }
        }
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
        var cwGrid = $scope['gridProjectsmtv'];
        cwGrid.addColumn("name", {"name": "Nombre", "show" : true});
        cwGrid.addColumn("locality", {"name": "Localidad", "show" : true});
        cwGrid.addColumn("uuid", {"name": "Id", "show" : true});
        cwGrid.addColumn("tree", {"name": "Arbol", "show" : true});
        cwGrid.addColumn("Kanban", {"name": "Kanban", "show" : true});
        cwGrid.addColumn("actions", {"name": "Acciones", "show" : true, "width" : 200, "class" : "cell-center"});

        cwGrid.addColumnProperties("actions", {
          "htmlContent": '<widget-task category="\'ToDo\'" target-uuid="row.entity.uuid" target-entity="gridEntity"/>'
        });

        cwGrid.setDecorators([CaliopeWebGridDataDecorator, CWGridColumnsDefNgGridDecorator])
      };

      $scope.initForm = function() {
        var cwForm = $scope['cwForm-project'];
        var methodSupport = cwForm.getEntityModel().concat('.').concat(cwForm.getMode());

        /*
        $scope.$on(methodSupport.concat('_').concat(cwForm.getFormName()), function(params) {
          console.log('on ' + methodSupport.concat('_').concat(cwForm.getFormName()), params);
        });
        */
        var eventNameCreate = methodSupport.concat('_').concat(cwForm.getEntityModel());
        console.log('eventNameCreate', eventNameCreate);
        $scope.$on(''.concat(eventNameCreate), function(event, result) {
          console.log('Se notifico  ' + methodSupport.concat('_').concat(cwForm.getFormName()), result[0], result[1]);
          if( result[0] === true ) {
            $scope.target.uuid = result[1].uuid;
            //cwForm.setActionsMethodToShow(['projects.edit']);
            $scope['show_projects_projects.create'] = false;
            $scope['show_projects_projects.edit'] = true;
          }
        });

        cwForm.setActionsMethodToShow([methodSupport]);
        cwFormService.loadForm(cwForm, {}).then(function(result) {

          console.log('scope.id proyecto controller', $scope.$id);

          processResultLoadForm(result, $scope);
          if($scope.modelUUID !== undefined) {
            $scope.showWidgetTask=true;
          } else {
            $scope.showWidgetTask=false;
          }
        });


      };



      /*
      Ejemplo de carga de grilla cuando se invoca un evento y se envian parámetros.
      $scope.findWithFilter = function(uuidProyecto) {
        var cwGrid = $scope['gridProjectsmtv'];
        var parameters = {
          //"uuid" : uuidProyecto
        }
        cwGrid.setParameters(parameters);
        console.log('gridDataName', cwGrid.getGridDataName());
        $scope[cwGrid.getGridDataName()] = cwGrid.loadDataFromServer();
      };
      */

    }]
  );
});

