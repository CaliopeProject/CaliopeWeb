define(['angular'], function(angular) {
  'use strict';

  var moduleControllers = angular.module('ProyectoControllers', []);

  moduleControllers.controller('ProyectomtvCtrl',
    ['caliopewebTemplateSrv', 'caliopewebGridSrv', '$scope', '$routeParams',
    function (cwTemplateService, cwGridService, $scope) {


      $scope.initGrid = function() {

        var cwGrid = $scope['gridProjectsmtv'];
        cwGrid.addColumn("name", {"name": "Nombre", "show" : true});
        cwGrid.addColumn("locality", {"name": "Localidad", "show" : true});
        cwGrid.addColumn("uuid", {"name": "Id", "show" : false});
        cwGrid.addColumn("tree", {"name": "Arbol", "show" : true});
        cwGrid.addColumn("Kanban", {"name": "Kanban", "show" : true});
        cwGrid.addColumn("actions", {"name": "Acciones", "show" : true, "width" : 200, "class" : "cell-center"});

        cwGrid.addColumnProperties("actions", {
          "htmlContent": '<widget-task category="ToDo" parent="{{row.entity.uuid}}"/>'
        });

        cwGrid.setDecorators([CaliopeWebGridDataDecorator, CWGridColumnsDefNgGridDecorator])
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

