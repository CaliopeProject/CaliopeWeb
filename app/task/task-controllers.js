/*jslint browser: true*/
/*global define, console, $*/

define(['angular', 'caliopeweb-formDirectives'], function (angular) {
  'use strict';

  var module = angular.module('task-controllers', ['CaliopeWebFormDirectives']);

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

    $scope.preLoadForm = function(cwForm) {
      var methodSupport = cwForm.getEntityModel().concat('.').concat(action.mode);
      cwForm.setActionsMethodToShow([methodSupport]);
      cwForm.setMode(action.mode);
      cwForm.setModelUUID(action.uuid);
    }

    $scope.postLoadForm = function(cwForm, result) {
      if( result !== undefined && result.data !== undefined ) {
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
    }

    $scope.$on('actionComplete', function(event, result) {
      if( result[1] === true ) {
        var cwForm = $scope['cwForm-task'];
        cwForm.addData(result[2]);
        cwForm.dataToViewData($scope);
      }
    });

    $scope.initFormDialog = function() {
      $scope.fromDialog = true;
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

