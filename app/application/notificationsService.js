/*jslint browser: true*/
/*global $rootscope, define*/

define(['angular'], function (angular) {
  'use strict';

  var  moduleservice = angular.module('NotificationsServices', []);

  return moduleservice.factory('HandlerResponseServerSrv',
      ['$rootScope', function ($rootScope) {

        var dataToProcess, selector, mensOk, mensError, addPromises;

        mensError = function (data){
          return data;
        };

        mensOk = function (data){
          var d = new Date();
          return d + 'Tx Exitosa';
        };

        selector = function (){
          var resultError = dataToProcess['error'];
          if(resultError !== undefined){
            return mensError(resultError['message'] + '-' + resultError['code']);
          }
          return mensOk();
        };

        addPromises = function(promise) {
          if( promise !== undefined ) {
            var promiseNew = promise.then( function(dataResponse) {

              var dataResponseDef = {};

              console.log('Promise HandlerResponse:', dataResponse);
              if(dataResponse !== undefined) {

                dataToProcess =  dataResponse;
                var msgSelector = selector();
                $rootScope.$broadcast('ChangeTextAlertMessage', [msgSelector]);

                var result =  dataResponse['result'];
                var error = dataResponse['error'];
                if( result !== undefined ) {
                  dataResponseDef = result;
                }
                if( error !== undefined ) {
                  dataResponseDef['error'] = error;
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
              var msgSelector = selector();
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
});
