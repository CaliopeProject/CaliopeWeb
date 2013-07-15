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
          var resultError = dataToProcess['error-response-server'];
          if(resultError !== undefined){
            var error = dataToProcess['error-response-server'];
            return mensError(error['message'] + '-' + error['code']);
          }
          return mensOk();
        };

        addPromises = function(promise) {
          if( promise !== undefined ) {
            var promiseNew = promise.then( function(result) {
              console.log('Promise HandlerResponse:', result);
              if(result !== undefined) {
                dataToProcess = result;
                var msgSelector = selector();
                $rootScope.$broadcast('ChangeTextAlertMessage', [msgSelector]);
              }
              return result;
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
