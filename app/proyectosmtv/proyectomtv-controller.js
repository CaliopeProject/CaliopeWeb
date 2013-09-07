define(['angular'], function(angular) {
  'use strict';

  var moduleControllers = angular.module('ProyectoControllers', []);

  moduleControllers.controller('ProyectomtvCtrl',
    ['caliopewebTemplateSrv', 'caliopewebGridSrv', '$scope', '$routeParams',
    function (cwTemplateService, cwGridService, $scope, $routeParams) {


      $scope.initGrid = function(method, nameGrid) {

        $scope.gridOptions = {
          data: 'data',
          columnDefs: 'columnDefs'
        };

        $scope.parent="parent";

        var cwGrid = cwGridService.createGrid(nameGrid, method, []);
        cwGrid.addColumn("name", {"name": "Nombre", "show" : true});
        cwGrid.addColumn("locality", {"name": "Localidad", "show" : true});
        cwGrid.addColumn("uuid", {"name": "Id", "show" : false});
        cwGrid.addColumn("tree", {"name": "Arbol", "show" : true});
        cwGrid.addColumn("Kanban", {"name": "Kanban", "show" : true});
        cwGrid.addColumn("actions", {"name": "Acciones", "show" : true, "width" : 200});

        cwGrid.addColumnProperties("actions", {
          "htmlContent": '<widget-task category="ToDo" parent="{{row.entity.uuid}}"/>' //'<span ng-cell-text><button onclick="console.log({{row.entity.hasOwnProperty(\'uuid\') ? row.entity[\'uuid\'] : null}})">Boton</button>{{row.entity.uuid}}</span>'
        });

        cwGrid.setDecorators([CaliopeWebGridDataDecorator, CWGridColumnsDefNgGridDecorator])
        $scope.cwGrid = cwGrid;
      };

      $scope.loadGrid = function() {

      };

    }]
  );
});
