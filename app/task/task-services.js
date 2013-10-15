/*jslint browser: true*/
/*global localStorage, Crypto, $scope*/
define(['angular', 'angular-ui-bootstrap-bower'], function(angular) {
  'use strict';

  var moduleServices = angular.module('task-services', ['ui.bootstrap.dialog']);

  moduleServices.factory('taskService',
    ['SessionSrv', 'loginSecurity', '$log','$http', '$q', '$location', '$dialog', '$rootScope', 'webSocket', 'caliopewebTemplateSrv', 'toolservices'
      , function(security, loginSecurity,   $log,  $http,   $q,   $location,   $dialog,   $rootScope,   webSocket, tempServices, tools) {

        var NAME_MODEL_TASK = 'tasks';
        var MODEL_TASK;
        var opts = {
          backdrop      : false,
          keyboard      : true,
          backdropClick : false,
          controller    : 'TaskFormCtrl'
        };

        var ALLTASK, MODEL;
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

        function getUserTask(tasktoprocess){
          var alluser = [];
          var adduser = function(userNew){
            if((alluser.indexOf(userNew) === -1) && !angular.isUndefined(userNew)){
              alluser.push(userNew);
            }
          };

          tasktoprocess = (tasktoprocess === undefined)? ALLTASK : tasktoprocess;

          angular.forEach(tasktoprocess, function(valueAllTask){
            if(!angular.isUndefined(valueAllTask.tasks)){
              angular.forEach(valueAllTask.tasks, function(valueTask){
                if(!angular.isUndefined(valueTask.holders.target)){
                  angular.forEach(valueTask.holders.target, function(valueHolders){
                    adduser(valueHolders.entity_data.uuid);
                  });
                }
                if(!angular.isUndefined(valueTask.comments)){
                  angular.forEach(valueTask.comments, function(value){
                    adduser(value.user);
                  });
                }
              });
            }
            if(!angular.isUndefined(valueAllTask.holders)){
              angular.forEach(valueAllTask.holders.target, function(valueHolders){
                adduser(valueHolders.entity_data.uuid);
              });
            }
            if(!angular.isUndefined(valueAllTask.comments)){
              angular.forEach(valueAllTask.comments, function(value){
                adduser(value.user);
              });
            }
          });
          return alluser;
        }

        function loadTask(){

          var data1    = {};
          var data2    = {};
          data1.params = data2.params = {};
          data1.method = "tasks.getCurrentUserKanban";
          data2.method = "tasks.getModel";

          WEBSOCKETS.serversimm.sendRequestBatch(data1, data2).
          then(function (returnValues){
            angular.forEach(returnValues, function(valueII, keyII){
              if(keyII === 0){
                ALLTASK = valueII;
                var tempALLTASK = angular.copy(ALLTASK);
                var getuser = {};
                getuser.users = getUserTask();
                tempServices.loadData('accounts.getPublicInfo',getuser)
                .then(function(data){
                  if(!angular.isUndefined(data)){
                    angular.forEach(ALLTASK, function(value1, key1){
                      if(!angular.isUndefined(value1.tasks)){
                        angular.forEach(value1.tasks, function(value2, key2){
                          if(!angular.isUndefined(value2.comments)){
                            angular.forEach(value2.comments, function(value3, key3){
                              var tempUser = {};
                              tempUser.uuid = value3.user;
                              angular.forEach(data, function(valUser, key4User){
                                if (valUser.uuid === value3.user) {
                                  tempUser.face = valUser.image;
                                  tempUser.name = valUser.name;
                                }
                              });
                              tempALLTASK[key1].tasks[key2].comments[key3].user = tempUser;
                            });
                          }
                        });
                      }
                    });
                  }
                  ALLTASK = tempALLTASK;
                  $rootScope.$broadcast('taskServiceNewTask');
                });
              }
              if(keyII === 1){
                if( valueII !== undefined ) {
                  MODEL_TASK = valueII.form;
                }
              }
            });
          });

        }

        function getAllTask(){
          var params     = {};
          var method     = "tasks.getAll";
          return WEBSOCKETS.serversimm.sendRequest(method, params)
          .then(function(allTaskValues){
            var getuser = {};
            if(!angular.isUndefined(allTaskValues)){
              getuser.users = getUserTask(allTaskValues);
              return tempServices.loadData('accounts.getPublicInfo',getuser)
              .then(function(data){
                angular.forEach(allTaskValues, function(vtask, ktask){
                  angular.forEach(vtask.holders.target, function(ventity, kentity){
                    angular.forEach(data, function(vdata){
                      if(vdata.uuid === ventity.entity_data.uuid){
                        allTaskValues[ktask].holders.target[kentity].entity_data = vdata;
                      }
                    });
                  });
                });
                return allTaskValues;
              });
            }
          });
        }

        function sendData(entidad,metodo,datos,uuidEntidad){
          var sendDato = angular.copy(datos);
          if(!angular.isUndefined(sendDato.comments)){
            angular.forEach(sendDato.comments, function(value, key){
              var user = value.user.uuid;
              sendDato.comments[key].user = user;
            });
          }

          tempServices.sendDataForm(entidad,metodo,sendDato,uuidEntidad,uuidEntidad);
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
          createTask: function(targetTask, category) {
            opts.templateUrl = './task/partial-task-dialog.html';
            var data = {
              template: NAME_MODEL_TASK,
              mode  : 'create',
              targetTask: targetTask,
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

          archiveTask: function(item) {
            opts.templateUrl = './task/partial-task-dialog-acction.html';

            var data = {
              message       : MESSAGE_TASK_ARCHIV,
              template      : NAME_MODEL_TASK,
              actionMethod  : 'tasks.archive',
              uuid          : item.uuid,
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

          deleteTask: function(item) {
            opts.templateUrl = './task/partial-task-dialog-acction.html';

            var data = {
              message       : MESSAGE_TASK_DELETE,
              template      : NAME_MODEL_TASK,
              actionMethod  : 'tasks.delete',
              uuid          : item.uuid,
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

          getAll: getAllTask,


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
            taskNot.pend        = pend || 0;
            taskNot.subt        = subt || 0;

            return taskNot;

          },

          checkSubtask : function(task, category){
            task.category = category;
            sendData('tasks', 'tasks.edit', task, task.uuid);
          },

          removeSubtask: function(task, category, index){
            task.category = category;
            task.subtasks.splice(index,1);
            sendData('tasks', 'tasks.edit', task, task.uuid);
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

            sendData('tasks', 'tasks.edit', parentTask, parentTask.uuid);
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
            var uuid    = loginSecurity.currentUser.user_uuid;
            var face    = loginSecurity.currentUser.image;
            var commentext = {
              text : text,
              user : {uuid: uuid, face: face},
              time : timeall
            };

            if( parentTask.comments === undefined) {
              parentTask.comments = [];
            }

            parentTask.comments.push(commentext);
            parentTask.category = category;

            sendData('tasks', 'tasks.edit', parentTask, parentTask.uuid);
          },

          changeCategory: function(taskDrag, category){
            if(!angular.isUndefined(taskDrag)){
              taskDrag.category = category;
              var target = {};
              target.uuid = tools.getValueAttInObject(taskDrag, 'target.target.0.entity_data.uuid', '.');
              var data =  tempServices.getDataToServer(MODEL_TASK, taskDrag);
              data.target = target;
              sendData('tasks', 'tasks.edit', data, taskDrag.uuid);
            }
            loadTask();
          }
        };

        return service;

      }]);
});
