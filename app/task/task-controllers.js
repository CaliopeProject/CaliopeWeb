/*jslint browser: true*/
/*global define, console, $*/

define(['angular', 'caliopeweb-formDirectives', 'task-services'], function (angular) {
  'use strict';

  var module = angular.module('task-controllers', ['CaliopeWebFormDirectives', 'task-services']);

  module.controller("TaskFormCtrl", ['$scope', '$location', 'caliopewebTemplateSrv',
    'caliopeWebFormNotification', 'loginSecurity', 'action', 'taskService', 'contextService',
    function($scope, $location, cwFormService, cwFormNotif, loginSecurity, action,
             taskServices, contextService) {

      function putActionDataInScope() {
        angular.forEach(action, function(value, key){
          $scope[key] = value;
        });
      }


      function sendChange(cwForm, scopeForm, name, newValue) {

        var oHolders;
        var oCategory;
        var uuidUser;
        var holdersToSend = [];

        if( name === 'category' ) {
          uuidUser = loginSecurity.currentUser.user_uuid;
          oHolders = angular.copy(scopeForm.holders);
          holdersToSend.push({uuid : uuidUser});
          scopeForm.holders = holdersToSend;
        }

        if( name === 'holders' ) {
          /*
          angular.forEach(scopeForm.holders, function(vHolder){
            vHolder.uuid = vHolder.value.uuid;
          });
          */
          var holderToSend = newValue;
          var categoryToSend = 'ToDo';
          uuidUser = loginSecurity.currentUser.user_uuid;
          holderToSend.uuid = holderToSend.value.uuid;
          if( uuidUser !== holderToSend.uuid ) {
            oCategory = scopeForm.category;
            scopeForm.category = categoryToSend;
          }
          holdersToSend.push(holderToSend);
          scopeForm.holders = holdersToSend;
        }

        cwFormNotif.sendChange(cwForm, scopeForm, name);

        if(oHolders !== undefined) {
          scopeForm.holders = oHolders;
        }
        if(oCategory !== undefined) {
          scopeForm.category = oCategory;
        }
      }

      function sendDelete(cwForm, scopeForm, name, deletedValue) {

        var oHolders = undefined;

        if( name === "holders" ) {
          var holders = [];
          holders.push({'uuid': deletedValue.uuid});
          var data = {
            holders : holders
          };

          cwFormNotif.sendDelete(cwForm, data, name);
        }
        if(oHolders !== undefined) {
          scopeForm.holders = oHolders;
        }
      }

      function sendCommit(cwForm) {
        return cwFormNotif.sendCommit(cwForm);
      }

      $scope.change = function(cwForm, scopeForm, name, newValue) {
        sendChange(cwForm, scopeForm, name, newValue);
      };

      $scope.sendDelete = function(cwForm, scopeForm, name, deletedValue) {
        sendDelete(cwForm, scopeForm, name, deletedValue);
      };

      $scope.initFromDialogAction = function() {
        putActionDataInScope();
        $scope.form         = action.template;
        $scope.fromDialog   = true;
      };

      $scope.preLoadForm = function(cwForm) {
        var methodSupport = cwForm.getEntityModel().concat('.').concat("commit");
        var methodSupport1 = cwForm.getEntityModel().concat('.').concat("discardDraft");

        cwForm.setActionsMethodToShow([methodSupport, methodSupport1]);
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
              $scope.target = [];
            }
            $scope.target[0] = {
              uuid : action.targetTask.uuid
            };
          }

          /**
           * Se envía la notificación de la categoria seleccionada si es un formulario para
           * crear una nueva tarea
           */
          if( cwForm.getMode() === 'create' ) {
            sendChange(cwForm, $scope, 'category');
            if( $scope.formtask !== undefined ) {
              sendChange(cwForm, $scope, 'formtask');
            }
            if( $scope.target !== undefined ) {
              sendChange(cwForm, $scope, 'target');
            }
          }
        }
      };

      $scope.$on('actionComplete', function(event, result) {
        /*
        result[0] -> Method sent to server
        result[1] -> Status of call to server (true or false)
        result[2] -> response from server
        result[3] -> cwform processed
         */
        if( result[1] === true && result[2].hasOwnProperty('uuid') ) {

          /*
           * Logic for call taskService to delete or update task before action is completed.
          */
          if( contextService.getDefaultContext() !== undefined && event.targetScope.contexts[0].uuid != undefined) {
            if( contextService.getDefaultContext().uuid !== event.targetScope.contexts[0].uuid ) {

              /*
              Delete task
               */
              taskServices.deleteUpdateTask(result[2].uuid);

            } else {
              /*
               Update Task
               */
              if( result[3] !== undefined ) {
                var task = result[3].getData();
                task.uuid = result[3].getModelUUID();
                var taskInKanban = taskServices.searchTask(task.category, task.uuid);
                if( taskInKanban !== undefined && taskInKanban.target !== undefined &&
                    task.target.length !== undefined && task.target.length <= 0 ) {
                  task.target = taskInKanban.target;
                }
                taskServices.deleteUpdateTask( result[2].uuid, true, task );
              }
            }
          }

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
            taskServices.deleteUpdateTask(scopeData.uuid);
          }
        });
      };


  }]);

});

