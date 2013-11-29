/*jslint browser: true*/
/*global localStorage, define, Crypto, $scope*/
define(['angular', 'angular-ui-bootstrap-bower','caliopeweb-template-services'], function(angular){
  'use strict';

  var moduleServices = angular.module('task-services', ['CaliopeWebTemplatesServices', 'ui.bootstrap.dialog']);

  moduleServices.factory('taskService',
    ['loginSecurity', '$dialog', '$rootScope', 'webSocket', 'caliopewebTemplateSrv'
      , function(loginSecurity,  $dialog,   $rootScope,   webSocket, tempServices) {

        var NAME_MODEL_TASK = 'tasks';
        var MODEL_TASK;
        var opts = {
          backdrop      : false,
          keyboard      : true,
          backdropClick : false,
          controller    : 'TaskFormCtrl'
        };

        var ALLTASK;
        var INFOUSERPUBLIC = [];
        var DIALOG_NAME_CONF_DELETE = 'dialogConfirmDeleteTask';
        var DIALOG_NAME_CONF_ARCHIV = 'dialogConfirmArchivTask';
        var DIALOG_NAME_FORM_TASK   = 'dialogFormTask';
        var WEBSOCKETS              = webSocket.WebSockets();
        // task form dialog stuff
        var TASKDIALOG = null;
        var MESSAGE_TASK_DELETE = '¿Está seguro que desea eliminar la información?';
        var MESSAGE_TASK_ARCHIV = '¿Está seguro que desea archivar la información?';


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

        function infoUpdate(){
          $rootScope.$broadcast('taskServiceNewTask');
        }

        function loadTask(context){

          var data1    = {};
          data1.params = {
            context : context
          };
          data1.method = "tasks.getCurrentUserKanban";

          WEBSOCKETS.serversimm.sendRequest(data1.method, data1.params).
          then(function (valueData){
                ALLTASK = valueData;
                var getuser = {};
                getuser.users = getUserTask();
                tempServices.loadData('accounts.getPublicInfo',getuser)
                .then(function(data){
                  INFOUSERPUBLIC = data;
                  if(!angular.isUndefined(data)){
                    angular.forEach(ALLTASK, function(value1, key1){
                      if(!angular.isUndefined(value1.tasks)){
                        angular.forEach(value1.tasks, function(value2, key2){
                          if(!angular.isUndefined(value2.comments)){
                            angular.forEach(value2.comments, function(value3, key3){
                              var tempUser = {};
                              angular.forEach(data, function(valUser){
                                if (valUser.uuid === value3.user) {
                                  tempUser.image = valUser.image;
                                  tempUser.uuid  = valUser.uuid;
                                  tempUser.name  = valUser.name;
                                }
                              });
                              ALLTASK[key1].tasks[key2].comments[key3].user = tempUser;
                            });
                          }
                        });
                      }
                    });
                  }
                  infoUpdate();
                });
            });
          MODEL_TASK = tempServices.createForm(NAME_MODEL_TASK, 'create', '');
          tempServices.loadForm(MODEL_TASK, {});
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

          tempServices.sendDataForm(entidad,metodo,sendDato,uuidEntidad);
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
            infoUpdate();
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

        // The public API of the service
        var service =  {

          loadData: loadTask,

          getAll: getAllTask,

          // Show the modal task dialog
          createTask: function(targetTask, category) {
            opts.templateUrl = './task/partial-task-dialog.html';
            var data = {
              template              : NAME_MODEL_TASK,
              mode                  : 'create',
              targetTask            : targetTask,
              category              : category,
              dialogName            : DIALOG_NAME_FORM_TASK,
              loopback_notification : true
            };
            opts.resolve = {
              action : function(){
                return angular.copy(data);
              }
            };
            opentaskDialog(DIALOG_NAME_FORM_TASK);
          },


          addTask:  function(loadTaskd){
            var category;
            var uuid = loginSecurity.currentUser.user_uuid;
            loadTaskd.notification = 'notification';
            if(!angular.isUndefined(loadTaskd)){
              category = loadTaskd.holders[uuid].category;
              angular.forEach(ALLTASK, function(value, key){
                if(value.category === category){
                  ALLTASK[key].tasks.push(loadTaskd);
                }
              });
            }
          },

          closeNotification: function(loadTaskd){
            angular.forEach(ALLTASK, function(vAlltask,kAlltask){
              angular.forEach(vAlltask.tasks, function(vTasks, kTasks) {
                if (vTasks.uuid === loadTaskd) {
                  delete  ALLTASK[kAlltask].tasks[kTasks].notification;
                }
              });
            });
          },

          updateTask:  function(updateTask){
            if(!angular.isUndefined(updateTask)){
              angular.forEach(ALLTASK, function(vAlltask,kAlltask){
                angular.forEach(vAlltask.tasks, function(vTasks, kTasks) {
                  vAlltask.tasks[kTasks].notification = 'notification';
                  if (vTasks.uuid === updateTask.uuid) {
                    if(angular.isUndefined(vTasks[updateTask.field])){
                      vTasks[updateTask.field] ={};
                    }
                    if(!angular.isUndefined(vTasks[updateTask.field][updateTask.subfield_id])){
                      if(updateTask.delete === true){
                        delete vTasks[updateTask.field][updateTask.subfield_id];
                      }else{
                        angular.forEach(updateTask.value, function(vNewSubtask, kNewSubtask) {
                          vTasks[updateTask.field][updateTask.subfield_id][kNewSubtask] = vNewSubtask;
                        });
                      }
                    }else{
                      vTasks[updateTask.field][updateTask.subfield_id] = updateTask.value;
                      var exist = false;
                      if (updateTask.field === 'comments') {
                         angular.forEach(INFOUSERPUBLIC, function(vInfo) {
                           if (vInfo.uuid === updateTask.value.user){
                             exist = true;
                             ALLTASK[kAlltask].tasks[kTasks][updateTask.field][updateTask.subfield_id].user = vInfo;
                           }
                         });
                         if(!exist){
                           tempServices.loadData('accounts.getPublicInfo', [updateTask.value.user]).then(
                             function(data){
                               ALLTASK[kAlltask].tasks[kTasks][updateTask.field][updateTask.subfield_id].user = data;
                             }
                           );
                         }
                      }
                    }
                    infoUpdate();
                  }
                });
              });
            }
          },


          archiveTask: function(item) {
            opts.templateUrl = './task/partial-task-dialog-acction.html';
            item.category = 'archived';
            MODEL_TASK.setModelUUID(item.uuid);
            var data = {
              message       : MESSAGE_TASK_ARCHIV,
              dialogName    : DIALOG_NAME_CONF_ARCHIV,
              cwForm          : MODEL_TASK,
              nameFieldChange : 'category',
              scopeData       : item
            };

            opts.resolve = {
              action : function(){
                return angular.copy(data);
              }
            };
            opentaskDialog(DIALOG_NAME_CONF_ARCHIV);
            infoUpdate();
          },


          deleteTask: function(item) {
            opts.templateUrl = './task/partial-task-dialog-acction.html';
            item.category = 'deleted';
            MODEL_TASK.setModelUUID(item.uuid);
            var data = {
              message         : MESSAGE_TASK_DELETE,
              dialogName      : DIALOG_NAME_CONF_DELETE,
              cwForm          : MODEL_TASK,
              nameFieldChange : 'category',
              scopeData       : item
            };
            opts.resolve = {
              action : function(){
                return angular.copy(data);
              }
            };
            opentaskDialog(DIALOG_NAME_CONF_DELETE);
            infoUpdate();
          },

          deleteUpdateTask: function(uuidtask) {
            angular.forEach(ALLTASK, function(vAlltask, kAlltask){
              angular.forEach(vAlltask.tasks, function(vTasks, kTasks){
                if (vTasks.uuid === uuidtask) {
                  delete ALLTASK[kAlltask].tasks[kTasks];
                }
              });
            });
            infoUpdate();
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
            infoUpdate();
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

            angular.forEach(ALLTASK, function(key){
              alltask = alltask + key.tasks.length;

              if(key.category !== 'Done'){
                pend = pend + key.tasks.length;
              }

              angular.forEach(key.tasks, function(valuetask){
                if(angular.isObject(valuetask.subtasks)){
                  angular.forEach(valuetask.subtasks, function(valuesubtask){
                    allSubtask++;
                    if(valuesubtask.complete){
                      subt++;
                    }
                  });
                }
              });

            });

            taskNot.porcTask    = 100 - ((pend * 100)/alltask);
            taskNot.porcSubTask = 100 - ((subt * 100)/allSubtask);
            taskNot.pend        = pend || 0;
            taskNot.subt        = subt || 0;

            return taskNot;

          },


          checkSubtask : function(task, uuidsub, complete){

            var subData =  {
              complete     : complete
            };

            var data = {
               field_name   : "subtasks"
              ,subfield_id  : uuidsub
              ,value        : subData
              ,metadata     : 'kanban'
            };

            sendData('tasks', 'tasks.updateField', data, task.uuid);
            sendData('tasks', 'tasks.commit', {} , task.uuid);
          },




          removeSubtask: function(task, uuidsub){
            var data = {
               field_name    : "subtasks"
              ,subfield_id   : uuidsub
              ,metadata      : 'kanban'
            };
            sendData('tasks', 'tasks.clearField', data, task.uuid);
            sendData('tasks', 'tasks.commit', {} , task.uuid);
            delete task.subtasks[uuidsub];
          },


          addSubtask : function(parentTask, description) {
            var idsubtask = Date.now().toString();
            var data = {};
            var subta= {   'description'  : description
                          ,'complete'     : false
                          ,'uuid_user'    : loginSecurity.currentUser.user_uuid
                          ,'uuid_subtask' : idsubtask
                       };
            data = {
               field_name    : "subtasks"
              ,subfield_id   : idsubtask
              ,value         : subta
              ,metadata      : 'kanban'
            };

            if( parentTask.subtasks === undefined) {
              parentTask.subtasks = {};
            }

            sendData('tasks', 'tasks.updateField', data, parentTask.uuid);
            sendData('tasks', 'tasks.commit', {} , parentTask.uuid);

            parentTask.subtasks[idsubtask] = {};
            parentTask.subtasks[idsubtask] = subta;
          },


          countSubtask : function(task) {
            var remaining = 0;
            if (angular.isObject(task)){
              angular.forEach(task, function(value){
                if(value.complete === false){
                  remaining++;
                }
              });
              return remaining;
            }
            return 0;
          },


          addComment : function(parentTask, text) {
            var data;
            var timeall   = new Date();
            var idcomme   = Date.now().toString();
            var uuid_user = loginSecurity.currentUser.user_uuid;
            var image     = loginSecurity.currentUser.image;
            var name      = loginSecurity.currentUser.name;

            var commentext = {
               text         : text
              ,user         : uuid_user
              ,time         : timeall
              ,uuid_comment : idcomme
            };

            data = {
               field_name    : "comments"
              ,subfield_id   : idcomme
              ,value         : commentext
              ,metadata      : 'kanban'
            };

            sendData('tasks', 'tasks.updateField', data, parentTask.uuid);
            sendData('tasks', 'tasks.commit', {} , parentTask.uuid);

            //after to send data, put the complete content to show
            commentext.user = {uuid: uuid_user, image: image, name: name};

            if( parentTask.comments === undefined) {
              parentTask.comments = {};
            }

            parentTask.comments[idcomme] = commentext;

          },

          changeCategory: function(taskDrag, category){
            if(!angular.isUndefined(taskDrag)){
              var data = {new_properties: {'category': category},
                          rel_name:'holders',
                          target_uuid: loginSecurity.currentUser.user_uuid
                        };
              sendData('tasks', 'tasks.updateRelationship', data, taskDrag.uuid);
              sendData('tasks', 'tasks.commit', {} , taskDrag.uuid);
              infoUpdate();
            }
          }

        };

        return service;

      }]);
});
