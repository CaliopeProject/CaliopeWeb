define(['angular'], function(angular) {
  'use strict';
  
  var moduleServices = angular.module('CaliopeWebTemplatesServices', []);
  
  moduleServices.factory('caliopewebTemplateSrv', 
      ['$q', '$rootScope', '$http', 'webSocket',  
       function($q, $rootScope, $http, webSocket) {
    
 // We return this object to anything injecting our service
    var Service = {};

    // Define a "getter" for getting customer data
    Service.load = function(caliopeForm) {
      var request = {};    
      request.header = {};
      request.body = {};
      
      request.body = {      	
	        "template" :  caliopeForm.id,
  	      "uid" : null
				};
      var promise = {};
      var webSocketCaliope = webSocket.WebSocketCaliope("ws://127.0.0.1:8080/WebSocketTest/Templates");      
      var webSocketTemplates = webSocket.WebSockets("templates");
      //console.log("getConfig", webSocketTemplates.getConfig());

      //alert('esperar');
      promise = webSocketCaliope.sendRequest(request);
      //promise = webSocket.sendRequest(request);
      return promise;
    }

    return Service;    
    
  }]);       
  
});