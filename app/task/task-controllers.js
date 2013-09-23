/*jslint browser: true*/
/*global define, console, $*/

define(['angular', 'Crypto'], function (angular) {
  'use strict';

  var module = angular.module('task-controllers', []);
  /**
   *
   * @param result
   */
  /*
  TODO: Revisar como se puede dejar genérico en el servicio de caliope web template
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

      }
    }
  }

  module.controller("TaskFormCtrl", ['$scope', '$location', 'caliopewebTemplateSrv','action',
    function($scope, $location, cwFormService, action) {

    $scope.initFromDialogAction = function() {
      $scope.message      = action.message;
      $scope.form         = action.template;
      $scope.template     = action.template;
      $scope.actionMethod = action.actionMethod;
      $scope.uuid         = action.uuid;
      $scope.dialogName   = action.dialogName;
      $scope.fromDialog   = true;
    };

    $scope.initFormDialog = function() {
      $scope.dialogName = action.dialogName;
      $scope.fromDialog = true;
      var cwForm = $scope['cwForm-task'];
      var methodSupport = cwForm.getEntityModel().concat('.').concat(action.mode);
      cwForm.setActionsMethodToShow([methodSupport]);
      cwForm.setMode(action.mode);
      cwForm.setModelUUID(action.uuid);

      cwFormService.loadForm(cwForm, {}).then(function(result){
        var inputs = result.elements;
        processResultLoadForm(result, $scope);
        if( result !== undefined && result.data !== undefined ) {
          var dataToView = cwForm.dataToViewData();
          if( dataToView !== undefined ) {
            angular.forEach(dataToView, function(value, key){
              $scope[key] = value;
            });
          }
        }
        angular.forEach(action, function(value, key){
          $scope[key] = value;
        });
      });
    };

    $scope.closeDialog = function (dialogName) {

      if( dialogName !== undefined ) {
        if($scope[dialogName] !== undefined) {
          $scope[dialogName].close([false, dialogName]);
          $scope.fromDialog = false;
        }
      }
    };


  }]);

});

