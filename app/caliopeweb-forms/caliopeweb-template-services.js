define(['angular'], function(angular) {
  'use strict';
  
  angular.module('caliopeweb-templateService', []).factory('caliopeweb-templateService', function($q, $rootScope, $http) {
    
    var ws = null;
    var callbacks = {};  
    var currentCallbackId = 0;
    var promise = null;
    var messageClient = null;
    
    var URL = 'ws://127.0.0.1:8080/WebSocketTest/Templates';
    
    if ('WebSocket' in window) {
        ws = new WebSocket(URL);
    } else if ('MozWebSocket' in window) {
        ws = new MozWebSocket(URL);
    } else {
        alert('Navegador no soporta WebSockets');
        return;
    }
    
    ws.onopen = function () {
      console.log("WebSocket is open...");
      try {
        promise = sendMessage(messageClient);
      } catch (e) {
        console.log('Error..:', e);
      }    
    };
    ws.onmessage = function (messageServer) {
      console.log("Received message from WebSocket... ", messageServer.data);    
      listener(messageServer);
    };
    ws.onclose = function () {
      console.log("WebSocket is close...");
    };
    ws.onerror = function (event) {
      console.log("WebSocket error...", event.error);
    };  
    
    function getCallbackId() {
      currentCallbackId += 1;
      if(currentCallbackId > 10000) {
        currentCallbackId = 0;
      }
      return currentCallbackId;
    } 
     
    function disconnect() {
        if (ws != null) {
            ws.close();
            ws = null;
        }
    }
         
    function sendMessage(message) { 
      if(ws != null ) {
        
          var defer = $q.defer();
          var callbackId = getCallbackId();
          callbacks[callbackId] = {
              time: new Date(),
              cb:defer
          };
          
          message.callback_id = callbackId;     
          ws.send(JSON.stringify(message));
          console.log("Send message...", message);
          return defer.promise;                               
              
      }   
    }
    
    function listener(messageServer) {
      if(callbacks.hasOwnProperty(messageServer.callback_id)) {
        console.log(callbacks[messageServer.callback_id]);
        $rootScope.$apply(callbacks[messageServer.callback_id].cb.resolve(messageServer.data));
        delete callbacks[messageServer.callbackID];
      }     
    }   
    
    
    return {
      load : function (caliopeForm) {
        messageClient = {
            "template" :  caliopeForm.id        
        };    
        var jsonPlantilla = '{"ng-controller" : "ProyectoCtrl","html" :[{"type" : "p","html" : "Registrar Proyecto"},{"name" : "id","id" : "txt-id","caption" : "Id","type" : "text","ng-model" : "proyecto.id"},{"name" : "nombre","caption" : "Nombre","type" : "text","ng-model" : "proyecto.nombre"},{"type" : "button","ng-click" : "create(proyecto)","html" : "Crear Proyecto Angular"}]}';        
        return jsonPlantilla;
      }
    };
    
  });    
});

/*
var moduleServices = Application.Services;

moduleServices.factory('caliopeFormsSrv', function($q, $rootScope, $http) {
	
	var ws = null;
	var callbacks = {};  
	var currentCallbackId = 0;
	var promise = null;
  var messageClient = null;
  
  var URL = 'ws://127.0.0.1:8080/WebSocketTest/Templates';
  
  if ('WebSocket' in window) {
      ws = new WebSocket(URL);
  } else if ('MozWebSocket' in window) {
      ws = new MozWebSocket(URL);
  } else {
      alert('Navegador no soporta WebSockets');
      return;
  }
	
  ws.onopen = function () {
    console.log("WebSocket is open...");
    try {
      promise = sendMessage(messageClient);
    } catch (e) {
      console.log('Error..:', e);
    }    
  };
  ws.onmessage = function (messageServer) {
    console.log("Received message from WebSocket... ", messageServer.data);    
    listener(event);
  };
  ws.onclose = function () {
    console.log("WebSocket is close...");
  };
  ws.onerror = function (event) {
    console.log("WebSocket error...", event.error);
  };	
	
  function getCallbackId() {
    currentCallbackId += 1;
    if(currentCallbackId > 10000) {
      currentCallbackId = 0;
    }
    return currentCallbackId;
  }	
	 
	function disconnect() {
	    if (ws != null) {
	        ws.close();
	        ws = null;
	    }
	}
	     
	function sendMessage(message) {	
	  if(ws != null ) {
	    
	      var defer = $q.defer();
	      var callbackId = getCallbackId();
	      callbacks[callbackId] = {
	          time: new Date(),
	          cb:defer
	      };
	      
	      message.callback_id = callbackId;     
	      ws.send(JSON.stringify(message));
	      console.log("Send message...", message);
	      return defer.promise;                               
	    	    
	  }		
	}
	
	function listener(messageServer) {
    if(callbacks.hasOwnProperty(messageServer.callback_id)) {
      console.log(callbacks[messageServer.callback_id]);
      $rootScope.$apply(callbacks[messageServer.callback_id].cb.resolve(messageServer.data));
      delete callbacks[messageServer.callbackID];
    }    	
	}		
	
	
	return {
		load : function (caliopeForm) {
		  messageClient = {
		      "template" :  caliopeForm.id        
		  };    
		  console.log(ws.readyState);								
			var jsonPlantilla = '{"ng-controller" : "ProyectoCtrl","html" :[{"type" : "p","html" : "Registrar Proyecto"},{"name" : "id","id" : "txt-id","caption" : "Id","type" : "text","ng-model" : "proyecto.id"},{"name" : "nombre","caption" : "Nombre","type" : "text","ng-model" : "proyecto.nombre"},{"type" : "button","ng-click" : "create(proyecto)","html" : "Crear Proyecto Angular"}]}';			
			return jsonPlantilla;
		}
	};
	
});
*/