/*jslint browser: true*/
/*global localStorage, Crypto, $scope*/
define(['angular', 'angular-ui-bootstrap-bower'], function(angular) {
  'use strict';

  var moduleServices = angular.module('task-services', ['ui.bootstrap.dialog']);

  moduleServices.factory('taskService',
    ['SessionSrv', 'loginSecurity', '$log','$http', '$q', '$location', '$dialog', '$rootScope', 'webSocket', 'caliopewebTemplateSrv'
      , function(security, loginSecurity,   $log,  $http,   $q,   $location,   $dialog,   $rootScope,   webSocket, tempServices) {

        var NAME_MODEL_TASK = 'tasks';
        var opts = {
          backdrop      : false,
          keyboard      : true,
          backdropClick : false,
          controller    : 'CaliopeWebTemplateCtrlDialog'
        };

        var ALLTASK;
        var DIALOG_NAME_CONF_DELETE = 'dialogConfirmDeleteTask';
        var DIALOG_NAME_CONF_ARCHIV = 'dialogConfirmArchivTask';
        var DIALOG_NAME_FORM_TASK   = 'dialogFormTask';
        var WEBSOCKETS              = webSocket.WebSockets();
        var UUIDSESSION             = security.getIdSession();
        // task form dialog stuff
        var TASKDIALOG = null;
        var MESSAGE_TASK_DELETE = '¿Está seguro que desea eliminar la información?';
        var MESSAGE_TASK_ARCHIV = '¿Está seguro que desea archivar la información?';


        // Redirect to the given url (defaults to '/')
        function redirect(url) {
          url = url || '/';
          $location.path(url);
        }

        function getUserTask(){
          var alluser = [];
          angular.forEach(ALLTASK, function(value){
            if(!angular.isUndefined(value.tasks)){
              angular.forEach(value.tasks, function(value){
                if(!angular.isUndefined(value.ente_asignado)){
                  angular.forEach(value.ente_asignado, function(value){
                    if(alluser.indexOf(value) === -1){
                      alluser.push(value);
                    }
                  });
                }
                if(!angular.isUndefined(value.comments)){
                  angular.forEach(value.comments, function(value){
                    if(alluser.indexOf(value.user) === -1){
                      alluser.push(value.user);
                    }
                  });
                }
              });
            }
          });
          return alluser;
        }

        function loadTask(){
          var params     = {};
          var method     = "tasks.getAll";
          WEBSOCKETS.serversimm.sendRequest(method, params)
                    .then(function(data){
                      ALLTASK = data;
                      var getuser = {};
                      getuser.users = getUserTask();
                      tempServices.loadData('accounts.getThumbnailList',getuser)
                              .then(function(data){
                                var tempALLTASK = angular.copy(ALLTASK);

                                if(!angular.isUndefined(data)){
                                  angular.forEach(ALLTASK, function(value1, key1){
                                    if(!angular.isUndefined(value1.tasks)){
                                      angular.forEach(value1.tasks, function(value2, key2){
                                        if(!angular.isUndefined(value2.ente_asignado)){
                                          angular.forEach(value2.ente_asignado, function(value3, key3){
                                            var tempUser = {};
                                            tempUser.login = value3;
                                            angular.forEach(data, function(valUser, key4User){
                                              angular.forEach(valUser, function(valNomb, key4Face){
                                                if(key4Face === value3){
                                                  tempUser.face = valNomb;
                                                }
                                              });
                                            });
                                            tempALLTASK[key1].tasks[key2].ente_asignado[key3] = tempUser;
                                          });
                                        }
                                        if(!angular.isUndefined(value2.comments)){
                                          angular.forEach(value2.comments, function(value3, key3){
                                            var tempUser = {};
                                            tempUser.login = value3.user;
                                            angular.forEach(data, function(valUser, key4User){
                                              angular.forEach(valUser, function(valNomb, key4Face){
                                                if(key4Face === value3.user){
                                                  tempUser.face = valNomb;
                                                }
                                              });
                                            });
                                            tempALLTASK[key1].tasks[key2].comments[key3].user = tempUser;
                                          });
                                        }
                                      });
                                    }
                                  });
                                }

                                ALLTASK = tempALLTASK;

                            });
                      $rootScope.$broadcast('taskServiceNewTask');
                    });
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
            loadTask();
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

        function findCateg(array, value) {
          var i, items;
          for(i = 0; i<array.length; i++) {
            if(array[i].uuid === value){
              return array[i].categ;
            }
          }
        }


        // The public API of the service
        var service =  {

          loadData: loadTask,

          // Show the modal task dialog
          createTask: function(target, category) {
            opts.templateUrl = './task/partial-task-dialog.html';
            var data = {
              template: NAME_MODEL_TASK,
              mode  : 'create',
              target: target,
              category: category,
              dialogName : DIALOG_NAME_FORM_TASK
            };
            opts.resolve = {
              action : function(){
                return angular.copy(data);
              }
            };
            opentaskDialog(DIALOG_NAME_FORM_TASK);
          },

          archiveTask: function(uuid) {
            opts.templateUrl = './task/partial-task-dialog-acction.html';

            var data = {
              message       : MESSAGE_TASK_ARCHIV,
              template      : NAME_MODEL_TASK,
              actionMethod  : 'tasks.archive',
              uuid          : uuid,
              dialogName    : DIALOG_NAME_CONF_ARCHIV
            };

            opts.resolve = {
              action : function(){
                return angular.copy(data);
              }
            };
            opentaskDialog(DIALOG_NAME_CONF_ARCHIV);
            loadTask();
          },

          deleteTask: function(uuid) {
            opts.templateUrl = './task/partial-task-dialog-acction.html';

            var data = {
              message       : MESSAGE_TASK_DELETE,
              template      : NAME_MODEL_TASK,
              actionMethod  : 'tasks.delete',
              uuid          : uuid,
              dialogName    : DIALOG_NAME_CONF_DELETE
            };

            opts.resolve = {
              action : function(){
                return angular.copy(data);
              }
            };
            opentaskDialog(DIALOG_NAME_CONF_DELETE);
            loadTask();
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
            loadTask();
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
                  if(valuesubtask.complete){
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

          },

          checkSubtask : function(task, category){
            task.category = category;
            tempServices.sendDataForm('tasks', 'tasks.edit', task, task.uuid, task.uuid);
          },

          removeSubtask: function(task, category, index){
            task.category = category;
            task.subtasks.splice(index,1);
            tempServices.sendDataForm('tasks', 'tasks.edit', task, task.uuid, task.uuid);
          },

          addSubtask : function(parentTask, description, category) {
            var subTask = {
              description : description,
              complete : false
            };

            if( parentTask.subtasks === undefined) {
              parentTask.subtasks = [];
            }

            parentTask.subtasks.push(subTask);
            parentTask.category = category;

            tempServices.sendDataForm('tasks', 'tasks.edit', parentTask, parentTask.uuid, parentTask.uuid);
          },

          countSubtask : function(task) {
            var remaining = 0;
            angular.forEach(task, function(value, key){
              if(value.complete === false){
                remaining++;
              }
            });
            return remaining;
          },

          addComment : function(parentTask, text, category) {
            var timeall = new Date();
            var user    = loginSecurity.currentUser.user;
            var commentext = {
              text : text,
              user : user,
              time : timeall
            };

            if( parentTask.comments === undefined) {
              parentTask.comments = [];
            }

            parentTask.comments.push(commentext);
            parentTask.category = category;

            tempServices.sendDataForm('tasks', 'tasks.edit', parentTask, parentTask.uuid, parentTask.uuid);
          },

          changeCategory: function(uiElement, taskDrag){

            var category , categ, uuid, itemsbycateg, data;
            var params = {};
            var method = "tasks.edit";

            itemsbycateg = (function(){
              var i,j,categoryUiid = [];
              angular.forEach(ALLTASK, function(value, key){
                var category, tasksCategory;
                category = value.category;
                for(j=0; value.tasks.length > j; j++){
                  if(!angular.isUndefined(value.tasks[j].uuid)){
                    categoryUiid.push({uuid : value.tasks[j].uuid, categ: category});
                  }
                }
              });

              return categoryUiid;

            }());

            uuid         = uiElement.draggable.attr("uuid");
            categ        = findCateg(itemsbycateg, uuid);

            if(!angular.isUndefined(categ)){
              data = taskDrag;
              data.category = categ;
              tempServices.sendDataForm('tasks', 'tasks.edit', data, uuid, uuid).then(function(data){
                loadTask();
              });
            }
          }

        };

        return service;

      }]);
});
