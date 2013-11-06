/*jslint browser: true*/
/*global define, console, $*/

define(['angular', 'caliopeweb-formDirectives'], function (angular) {
  'use strict';

  var module = angular.module('task-controllers', ['CaliopeWebFormDirectives']);

  module.controller("TaskFormCtrl", ['$scope', '$location', 'caliopewebTemplateSrv', 'caliopeWebFormNotification', 'loginSecurity', 'action',
    function($scope, $location, cwFormService, cwFormNotif, loginSecurity, action) {

      function putActionDataInScope() {
        angular.forEach(action, function(value, key){
          $scope[key] = value;
        });
      }


    $scope.change = function(cwForm, scopeForm, name) {

      var oHolders = undefined;
      if( name === 'category' ) {
        var uuidUser = loginSecurity.currentUser.user_uuid;
        var holders = angular.copy(scopeForm.holders);
        oHolders = angular.copy(scopeForm.holders);
        if( holders !== undefined && holders.length > 0) {
          var i;
          for( i = 0; i < scopeForm.holders.length; i++ ) {
              var vHolder = scopeForm.holders[i];
              if( vHolder.value.uuid !== uuidUser ) {
                holders.splice(i,1);
              } else {
                holders[i].uuid =  vHolder.value.uuid;
              }
          }
          scopeForm.holders = holders;
        } else {
          holders = [];
          holders.push({uuid : uuidUser});
        }
      }

      if( name === 'holders' ) {
        angular.forEach(scopeForm.holders, function(vHolder){
          vHolder.uuid = vHolder.value.uuid;
        });
      }

      cwFormNotif.sendChange(cwForm, scopeForm, name);

      if(oHolders !== undefined) {
        scopeForm.holders = oHolders;
      }

    };

    $scope.initFromDialogAction = function() {
      putActionDataInScope();
      $scope.form         = action.template;
      $scope.fromDialog   = true;
    };

    $scope.preLoadForm = function(cwForm) {
      var methodSupport = cwForm.getEntityModel().concat('.').concat("commit");
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

