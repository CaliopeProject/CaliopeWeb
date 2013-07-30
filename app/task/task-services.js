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
      templateUrl   : './task/partial-task-dialog.html',
      controller    : 'CaliopeWebTemplateCtrlDialog'
    };

    // Login form dialog stuff
    var loginDialog = null;

    // task form dialog stuff
    var taskDialog = null;

    // Redirect to the given url (defaults to '/')
    function redirect(url) {
      url = url || '/';
      $location.path(url);
    }

    function opentaskDialog() {
      if ( taskDialog ) {
        throw new Error('Ya esta abierta!');
      }
      taskDialog = $dialog.dialog(opts);
      taskDialog.open();
    }

    function closetaskDialog(success) {
      if (taskDialog) {
        taskDialog.close(success);
      }
    }

    function closeLoginDialog(success) {
      if (loginDialog) {
        loginDialog.close(success);
      }
    }

    // The public API of the service
    var service =  {

      // Show the modal task dialog
      createTask: function() {
        var data = {template: 'asignaciones',
                      mode    : 'create'};
        opts.resolve = {action : function(){ return angular.copy(data);}};
        opentaskDialog();
      },

      // Attempt to authenticate a user by the given email and password
      editTask: function(numuuid) {
        var data = {template: 'asignaciones',
                    mode    : 'edit',
                    uuid    : numuuid};
        opts.resolve = {action : function(){ return angular.copy(data);}};
        opentaskDialog();
      },

      // Give up trying to task and clear the retry queue
      cancelTask: function() {
        closetaskDialog(false);
        redirect();
      },

      currentTask: null

    };

    return service;
  }]);
});
