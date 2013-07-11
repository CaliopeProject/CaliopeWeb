/*jslint browser: true*/
/*global $rootscope*/
define(['angular'], function(angular) {

  var moduleservice = angular.module('notificationServices', []);

  var myservice = (function(){
    var var1local = xxx ;
    var var2local = xxx ;
    var var13ocal = xxx ;

    var varfunc1 = function (argument) {
      // body...
    };

    var varfunc2 = function (argument) {
      // body...
    };

    return {

      nomb2 : function (argument) {
        // body...
      },

      nomb1 : function (argument) {
        // body...
      }
    };
  }());

  return  moduleservice.factory('notificationServices',[myservice]);

});
