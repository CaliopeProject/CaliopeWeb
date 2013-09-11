define(['angular'], function(angular) {
  'use strict';

  var moduleControllers = angular.module('ProyectoControllers', []);

  moduleControllers.controller('ProyectomtvCtrl',
    ['caliopewebTemplateSrv', 'caliopewebGridSrv', '$scope', '$routeParams',
    function (cwFormService, cwGridService, $scope, $routeParams) {


      $scope.initGrid = function() {

        var cwGrid = $scope['gridProjectsmtv'];
        cwGrid.addColumn("name", {"name": "Nombre", "show" : true});
        cwGrid.addColumn("locality", {"name": "Localidad", "show" : true});
        cwGrid.addColumn("uuid", {"name": "Id", "show" : true});
        cwGrid.addColumn("tree", {"name": "Arbol", "show" : true});
        cwGrid.addColumn("Kanban", {"name": "Kanban", "show" : true});
        cwGrid.addColumn("actions", {"name": "Acciones", "show" : true, "width" : 200, "class" : "cell-center"});

        cwGrid.addColumnProperties("actions", {
          "htmlContent": '<widget-task category="ToDo" target-uuid="{{row.entity.uuid}}" target-entity="projects"/>' //
        });

        cwGrid.setDecorators([CaliopeWebGridDataDecorator, CWGridColumnsDefNgGridDecorator])
      };

      $scope.initForm = function(methodsToSupport) {
        //cwTempCtrl.initWithRouteParams(methodsToSupport);
        //$scope.mehodsToSupport = methodsToSupport;
        $scope.showWidgetTask=true;
        //var cwForm = cwFormService.createForm($routeParams.plantilla, $routeParams.mode, $routeParams.uuid);
        var cwForm = $scope['project'];
        $scope.jsonPlantilla = cwFormService.loadForm();

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

