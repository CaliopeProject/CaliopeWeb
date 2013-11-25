/*jslint browser: true*/
/*global $rootscope, define*/

define(['angular', 'application-commonservices'], function (angular) {
  'use strict';

  var  moduleservice = angular.module('NotificationsServices', ['commonServices']);

  moduleservice.factory('HandlerResponseServerSrv',
      ['$rootScope', 'toolservices', function ($rootScope, toolservices) {

        var dataToProcess, selector, addPromises;


        selector = function (){
          var resultError = dataToProcess.error;
          if(resultError !== undefined){
            var errortoshow = resultError.message + '-' + resultError.code;
            var data = {msg: errortoshow, type: 'error'};
            $rootScope.$broadcast('ChangeTextAlertMessage', data);
            return errortoshow;
          }
        };

        addPromises = function(promise) {
          if( promise !== undefined ) {
            var promiseNew = promise.then( function(dataResponse) {

              var dataResponseDef = {};

              if(dataResponse !== undefined) {

                dataToProcess =  dataResponse;

                var result =  dataResponse.result;
                var error = dataResponse.error;
                if( result !== undefined ) {
                  //process json whit common service
                  dataResponseDef = toolservices.rmValue(result);
                }
                if( error !== undefined ) {
                  dataResponseDef.error = error;
                }
              }
              return dataResponseDef;
            });
            promise = promiseNew;
          }
          return promise;
        };

        return {
          process : function (responseSrv) {
            dataToProcess = responseSrv;
            console.log('Manejar Respuesta', dataToProcess);
          },

          message : function(){
            if (dataToProcess !== undefined) {
              return selector();
            }
            return '';
          },

          addPromisesHandlerRespNotif : function(promise) {
            var promiseNew = addPromises(promise);
            return promiseNew;
          }
        };

  }]);

  moduleservice.factory('HandlerNotification', ['$rootScope', 'toolservices'
    ,function ($rootScope,  toolservices){

    var service = {};
    var actions = {

      'message': function(data){
        $rootScope.$broadcast('ChangeTextAlertMessage', data);
      },

      'createTask': function(data){
        $rootScope.$broadcast('createTask', data);
      },

      'updateField': function(data){
        switch(data.metadata){

          case 'kanban':
            $rootScope.$broadcast('updateTask', data);
            break;

          default:
            $rootScope.$broadcast('updateFormField', data);
        }
      }
    };

    var sendmessage = function(mssage){
      var jobToDo =  actions[mssage.method];
      if(!angular.isUndefined(jobToDo)){
        jobToDo(toolservices.rmValue(mssage.params));
      }else{
        console.log("notifications Services Error dont be set", mssage);
      }
    };

    service = {
      sendinfo: sendmessage
    };

    return service;
  }]);

  return moduleservice;
});
