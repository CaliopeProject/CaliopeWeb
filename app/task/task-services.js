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

    function opentaskDialog() {
      if ( taskDialog ) {
        throw new Error('Ya esta abierta!');
      }
      taskDialog = $dialog.dialog(opts);
      taskDialog.open().then(onTaskDialogClose);
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
        var data = {
                    template: 'asignaciones',
                    mode  : 'create',
                    uuidparent: parent,
                    category: category
                   };
        opts.resolve = {action : function(){ return angular.copy(data);}};
        opentaskDialog();
      },

      editTask: function(numuuid) {
        console.log(numuuid);
        var data = {template: 'asignaciones',
                    mode    : 'edit',
                    uuid    : numuuid};
        opts.resolve = {action : function(){ return angular.copy(data);}};
        opentaskDialog();
      },

      cancelTask: function() {
        closetaskDialog(false);
      }

    };

    return service;
  }]);
});
