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
      var cwForm = $scope.task;
      var methodSupport = cwForm.getEntityModel().concat('.').concat(action.mode);
      cwForm.setActionsMethodToShow([methodSupport]);
      cwForm.setMode(action.mode);
      cwForm.setModelUUID(action.uuid);

      cwFormService.loadForm(cwForm, {}).then(function(result){
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

