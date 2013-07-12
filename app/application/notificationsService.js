/*jslint browser: true*/
/*global $rootscope, define*/

define(['angular'], function (angular) {
  'use strict';
  
  var moduleservice = angular.module('NotificationsServices', []);
  

  var handlerResponseServer = (function () {
    var var1local = 'xxx';
    var var2local = 'xxx';
    var var13ocal = 'xxx';

    var varfunc1 = function (argument) {
      //body...
    };

    var varfunc2 = function (argument) {
      // body...
    };

    return {
      process : function (responseSrv) {                      
        console.log('Manejar Respuesta', responseSrv);
        // body...
      },
      nomb1 : function (argument) {
        // body...
      }
    };
  }());
  

  moduleservice.factory('HandlerResponseServerSrv', 
      ['$rootScope', function ($rootScope) {
        var Services = {};
        Services.handle = handlerResponseServer;        
        return Services;
      }]);

  
  
  
});
