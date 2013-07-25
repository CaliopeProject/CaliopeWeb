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

        var params = {};
        var method = "task.authenticate";
        params = {
          "username" : 'text',
        };

        var webSockets = webSocket.WebSockets();
        var request = webSockets.serversimm.sendRequest(method, params);

        return request.then(function(data) {
          if(data.user !== undefined){
            service.currentTask = data.task;
          }else{
            service.currentTask = null;
          }

        });
      },

      // Give up trying to task and clear the retry queue
      cancelTask: function() {
        closetaskDialog(false);
        redirect();
      },

      // Logout the current user and redirect
      saveTask: function(redirectTo) {
        var params = {};
        var method = "task.authenticate";

        params = {
          "uuid"     : ''
        };

        redirect(redirectTo);

        var webSockets = webSocket.WebSockets();
        var request    = webSockets.serversimm.sendRequest(method, params);
      },

      // Information about the current user
      currentTask: null,

    };

    return service;
  }]);
});
