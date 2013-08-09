/*jslint browser: true*/
/*global localStorage, Crypto, $scope*/
define(['angular', 'angular-ui-bootstrap-bower'], function(angular) {
  'use strict';

  var moduleServices = angular.module('task-services', ['ui.bootstrap.dialog']);

  moduleServices.factory('taskService', ['$log','$http', '$q', '$location', '$dialog', '$rootScope',
    'webSocket', function($log, $http, $q, $location, $dialog, $rootScope,  webSocket) {

    var opts = {
      backdrop      : false,
      keyboard      : true,
      backdropClick : false,
      controller    : 'CaliopeWebTemplateCtrlDialog'
    };

    var DIALOG_NAME_CONF_DELETE = 'dialogConfirmDeleteTask';
    var DIALOG_NAME_FORM_TASK = 'dialogFormTask';


    // task form dialog stuff
    var taskDialog = null;

    // Redirect to the given url (defaults to '/')
    function redirect(url) {
      url = url || '/';
      $location.path(url);
    }

    function onTaskDialogClose(success) {
      taskDialog = null;
    }

    function opentaskDialog(dialogName) {
      if ( taskDialog ) {
        throw new Error('Ya esta abierta!');
      }
      taskDialog = $dialog.dialog(opts);
      taskDialog.open().then(onTaskDialogClose);
      $rootScope[dialogName] = taskDialog;
    }


    function closetaskDialog(success) {
      if (taskDialog) {
        taskDialog.close(success);
      }
    }

    // The public API of the service
    var service =  {

      // Show the modal task dialog
      createTask: function(parent, category) {
        opts.templateUrl = './task/partial-task-dialog.html';
        var data = {
                    template: 'asignaciones',
                    mode  : 'create',
                    uuidparent: parent,
                    categoria: category,
                    dialogName : DIALOG_NAME_FORM_TASK
                   };
        opts.resolve = {
          action : function(){
              return angular.copy(data);
            }
        };
        opentaskDialog(DIALOG_NAME_FORM_TASK);
      },

      editTask: function(numuuid, category) {
        console.log(numuuid);
        opts.templateUrl = './task/partial-task-dialog.html';
        var data = {
                    template: 'asignaciones',
                    mode    : 'edit',
                    uuid    : numuuid,
                    categoria: category,
                    dialogName : DIALOG_NAME_FORM_TASK
                  };
        opts.resolve = {
          action : function(){
            return angular.copy(data);
          }
        };
        opentaskDialog(DIALOG_NAME_FORM_TASK);
      },

      deleteTask: function(uuid) {
        opts.templateUrl = './task/partial-task-dialog-delete.html'

        var data = {
                    template      : 'asignaciones',
                    actionMethod  : 'task.delete',
                    uuid          : uuid,
                    dialogName    : DIALOG_NAME_CONF_DELETE
                   }

        opts.resolve = {
          action : function(){
            return angular.copy(data);
          }
        };
        opentaskDialog(DIALOG_NAME_CONF_DELETE);

      },

      cancelTask: function() {
        closetaskDialog(false);
      }

    };

    return service;
  }]);
});
