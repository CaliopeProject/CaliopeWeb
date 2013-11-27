define(['angular','caliopeWebForms','caliopeweb-formDirectives', 'angular-ui-ng-grid'], function(angular) {
  'use strict';

  var moduleControllers = angular.module('ProyectoControllers',
      ['CaliopeWebFormDirectives', 'wysiwygEditorDirective', 'fileuploaderDirectives', 'ngGrid' ]);


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


      $scope.preLoadForm = function(cwForm) {
        $scope.showWidgetTask=false;
        var methodSupport = cwForm.getEntityModel().concat('.').concat(cwForm.getMode());
        cwForm.setActionsMethodToShow([methodSupport]);
      };

      $scope.postLoadForm = function(cwForm, result) {
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
