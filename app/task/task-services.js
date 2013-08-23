/*jslint browser: true*/
/*global localStorage, Crypto, $scope*/
define(['angular', 'angular-ui-bootstrap-bower'], function(angular) {
  'use strict';

  var moduleServices = angular.module('task-services', ['ui.bootstrap.dialog']);

  moduleServices.factory('taskService',
               ['SessionSrv', '$log','$http', '$q', '$location', '$dialog', '$rootScope', 'webSocket'
      , function( security,    $log,  $http,   $q,   $location,   $dialog,   $rootScope,   webSocket) {

    var NAME_MODEL_TASK = 'tasks';
    var opts = {
      backdrop      : false,
      keyboard      : true,
      backdropClick : false,
      controller    : 'CaliopeWebTemplateCtrlDialog'
    };

    var ALLTASK;
    var DIALOG_NAME_CONF_DELETE = 'dialogConfirmDeleteTask';
    var DIALOG_NAME_FORM_TASK   = 'dialogFormTask';
    var WEBSOCKETS              = webSocket.WebSockets();
    var UUIDSESSION             = security.getIdSession();
    // task form dialog stuff
    var TASKDIALOG = null;


    // Redirect to the given url (defaults to '/')
    function redirect(url) {
      url = url || '/';
      $location.path(url);
    }


    function changTask (){
      $rootScope.$broadcast('taskServiceNewTask');
    }

    function onTaskDialogClose(result) {
      TASKDIALOG = null;
      var success = false;
      if( result !== undefined ) {
        if(result[0] !== undefined ) {
          success = result[0];
        }
        if( result[1] !== undefined ) {
          $rootScope[result[1]] = null;
          $rootScope.dialogName = null;
        }
      }
      if(success === true) {
        $rootScope.$broadcast('updateKanban', []);
      }
    }

    function opentaskDialog(dialogName) {
      if ( TASKDIALOG ) {
        throw new Error('Ya esta abierta!');
      }
      TASKDIALOG = $dialog.dialog(opts);
      TASKDIALOG.open().then(onTaskDialogClose);
      $rootScope[dialogName] = TASKDIALOG;
    }

    function closetaskDialog(success) {
      if (TASKDIALOG) {
        TASKDIALOG.close(success);
      }
    }

    function incompleteTasks(){
       return '';
    }

    // The public API of the service
    var service =  {

      loadData: function (){
        var params     = {};
        var method     = "tasks.getAll";
        WEBSOCKETS.serversimm.sendRequest(method, params).then(function(data){
          ALLTASK = data;
          changTask();
        });
      },

      // Show the modal task dialog
      createTask: function(parent, category) {
        opts.templateUrl = './task/partial-task-dialog.html';
        var data = {
                    template: NAME_MODEL_TASK,
                    mode  : 'create',
                    uuidparent: parent,
                    category: category,
                    dialogName : DIALOG_NAME_FORM_TASK
                   };
        opts.resolve = {
          action : function(){
              return angular.copy(data);
            }
        };
        opentaskDialog(DIALOG_NAME_FORM_TASK);
        changTask();
      },

      editTask: function(numuuid, category) {
        console.log(numuuid);
        opts.templateUrl = './task/partial-task-dialog.html';
        var data = {
                    template: NAME_MODEL_TASK,
                    mode    : 'edit',
                    uuid    : numuuid,
                    category: category,
                    dialogName : DIALOG_NAME_FORM_TASK
                  };
        opts.resolve = {
          action : function(){
            return angular.copy(data);
          }
        };
        opentaskDialog(DIALOG_NAME_FORM_TASK);
        changTask();
      },

      deleteTask: function(uuid) {
        opts.templateUrl = './task/partial-task-dialog-delete.html';

        var data = {
                    template      : NAME_MODEL_TASK,
                    actionMethod  : 'task.delete',
                    uuid          : uuid,
                    dialogName    : DIALOG_NAME_CONF_DELETE
                   };

        opts.resolve = {
          action : function(){
            return angular.copy(data);
          }
        };
        opentaskDialog(DIALOG_NAME_CONF_DELETE);
        changTask();
      },

      cancelTask: function() {
        closetaskDialog(false);
      },

      getTask: function(){
        return ALLTASK;
      },

      getTaskpend: function(){
        var taskNot = {};
        var allSubtask = 0;
        var alltask = 0;
        var pend    = 0;
        var subt    = 0;
        var porc    = 0;

        angular.forEach(ALLTASK, function(key){
          if(key.category !== 'Done'){
            pend = pend + key.tasks.length;
          }

          angular.forEach(key.tasks, function(valuetask){

            angular.forEach(valuetask.subtasks, function(valuesubtask){
              if(valuesubtask.complete.value){
                subt++;
              }
            });

            if(!angular.isUndefined(valuetask.subtasks)){
              allSubtask = allSubtask + valuetask.subtasks.length;
            }

          });
          alltask = alltask + key.tasks.length;
        });

        taskNot.porcTask    = 100 - ((pend * 100)/alltask);
        taskNot.porcSubTask = 100 - ((subt * 100)/allSubtask);
        taskNot.pend        = pend;
        taskNot.subt        = subt;
        return taskNot;
      }
    };

    return service;

  }]);
});
