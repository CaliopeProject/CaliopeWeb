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


      function sendChange(cwForm, scopeForm, name) {

        var oHolders = undefined;
        if( name === 'category' ) {
          var uuidUser = loginSecurity.currentUser.user_uuid;
          var holdersToSend = [];
          oHolders = angular.copy(scopeForm.holders);
          holdersToSend.push({uuid : uuidUser});
          scopeForm.holders = holdersToSend;
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
      }

      function sendCommit(cwForm) {
        return cwFormNotif.sendCommit(cwForm);
      };

      $scope.change = function(cwForm, scopeForm, name) {
        sendChange(cwForm, scopeForm, name);
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
      };

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

          sendChange(cwForm, $scope, 'category');
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

      $scope.closeDialog = function (dialogName, success) {

        if( dialogName !== undefined ) {
          if($scope[dialogName] !== undefined) {
            $scope[dialogName].close([success, dialogName]);
            $scope.fromDialog = false;
          }
        }
      };


      $scope.sendChangeAndCommit = function(cwForm, scopeData, nameFieldChange) {
        sendChange(cwForm, scopeData, nameFieldChange);
        sendCommit(cwForm).then( function(response) {
          if( !response.hasOwnProperty('error') ) {
            $scope.closeDialog($scope.dialogName, true);
          }
        });
      };


  }]);

});

