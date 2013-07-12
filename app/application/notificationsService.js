/*jslint browser: true*/
/*global $rootscope, define*/

define(['angular'], function (angular) {
  'use strict';

  var  moduleservice = angular.module('NotificationsServices', []);

  return moduleservice.factory('HandlerResponseServerSrv',
      ['$rootScope', function ($rootScope) {

        var dataToProcess, selector, mensOk, mensError;

        mensError = function (data){
          return data;
        };

        mensOk = function (data){
          var d = new Date();
          return d + 'Tx Exitosa';
        };

        selector = function (){
          var result = dataToProcess.result;
          if(result === 'error'){
            return mensError(dataToProcess.msg);
          }
          return mensOk();
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
          }
        };

      }]);
});
