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
      templateUrl   : "./task/partial-task-dialog.html",
      controller    : 'CaliopeWebTemplateCtrl'
    };

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

    // The public API of the service
    var service =  {

      // Show the modal task dialog
      showTask: function() {
        opentaskDialog();
      },

      // Attempt to authenticate a user by the given email and password
      newTask: function(username, password) {

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
