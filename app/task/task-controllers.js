/*jslint browser: true*/
/*global define, console, $*/

define(['angular', 'caliopeWebForms'], function (angular, cwForm) {
  'use strict';

console.log('cwForm text', cwForm);
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

      function putActionDataInScope() {
        angular.forEach(action, function(value, key){
          $scope[key] = value;
        });
      }

    $scope.initFromDialogAction = function() {
      putActionDataInScope();
      $scope.form         = action.template;
      $scope.fromDialog   = true;
    };

    $scope.initFormDialog = function() {


      $scope.fromDialog = true;

      var cwForm = $scope['cwForm-task'];
      var methodSupport = cwForm.getEntityModel().concat('.').concat(action.mode);
      cwForm.setActionsMethodToShow([methodSupport]);
      cwForm.setMode(action.mode);
      cwForm.setModelUUID(action.uuid);


      $scope.$on('actionComplete', function(event, result) {
        if( result[1] === true ) {
          cwForm.addData(result[2]);
          cwForm.dataToViewData($scope);
        }
      });


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
          putActionDataInScope();
          if( action.targetTask !== undefined && action.targetTask.hasOwnProperty('entity')) {
            $scope.formtask = action.targetTask.entity;
          }
          if( action.targetTask !== undefined && action.targetTask.hasOwnProperty('uuid')) {
            if($scope.target === undefined) {
              $scope.target = {};
            }
            $scope.target.uuid = action.targetTask.uuid;
          }
        }
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

