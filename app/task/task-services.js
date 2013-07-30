/*jslint browser: true*/
/*global localStorage, Crypto, $scope*/
define(['angular', 'angular-ui-bootstrap-bower'], function(angular) {
  'use strict';

  var moduleServices = angular.module('task-services', ['ui.bootstrap.dialog']);

  moduleServices.factory('taskService', ['$log','$http', '$q', '$location', '$dialog', 'webSocket', function($log, $http, $q, $location, $dialog,  webSocket) {

    var opts = {
      backdrop      : false,
      keyboard      : true,
      backdropClick : false,
      controller    : 'CaliopeWebTemplateCtrlDialog'
    };

    // task form dialog stuff
    var taskDialog = null;

    // Redirect to the given url (defaults to '/')
    function redirect(url) {
      url = url || '/';
      $location.path(url);
    }


    function opentaskDialog(url) {
      if ( taskDialog ) {
        throw new Error('Ya esta abierta!');
      }
      opts.templateUrl = url;
      taskDialog = $dialog.dialog(opts);
      taskDialog.open();
    }

    function closetaskDialog(success) {
      if (taskDialog) {
        taskDialog.close(success);
      }
    }

    // The public API of the service
    var service =  {

      // Show the modal task dialog
      showTask: function() {
        var url = "./task/partial-task-dialog.html";
        opentaskDialog(url);
      },

      // Attempt to authenticate a user by the given email and password
      editTask: function(uuid) {
        var url = "./task/partial-task-dialog.html";
        $log.info('Ingreso a editar tarea ', uuid);
        opentaskDialog(url);
      },

      // Give up trying to task and clear the retry queue
      cancelTask: function() {
        closetaskDialog(false);
        redirect();
      },

      // Logout the current user and redirect
      saveTask: function(redirectTo) {
      },

      currentTask: null

    };

    return service;
  }]);
});
