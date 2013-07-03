define(['angular'], function(angular) {
  'use strict';
  angular.module('webSocket', []).factory('webSocket', 
      ['$q', '$rootScope', function($q, $rootScope) {
    
      var Service = {}; 
      var webSockets = {};
      //initWebSockets();   
        
      function initWebSockets() {                
        var wsTemplates = new WebSocketCaliope(
            "ws://127.0.0.1:8080/WebSocketTest/Templates"
            //"ws://192.168.0.25:8099/api/ws"
          );
        /*
        var wsLogin = new WebSocketCaliope(
            "ws://127.0.0.1:8080/WebSocketTest/Templates"
          );
        var wsTemplateLayout = new WebSocketCaliope(
            "ws://127.0.0.1:8080/WebSocketTest/TemplatesLayout"
          );
        */
        webSockets.templates = wsTemplates;
        //webSockets.login = wsLogin;
        //webSockets.templatesLayout = wsTemplateLayout;
      }
      
      function WebSocketCaliope(Url) {
        
        // Keep all pending requests here until they get responses
        var callbacks = {};
        // Create a unique callback ID to map requests to responses
        var currentCallbackId = 0;
        
        var ws = new WebSocket(Url);
        var url = "url";
        this.sendRequest = sendRequest;
        this.getStatus = getStatus;
        this.getUrl = getUrl;
        
        
        ws.onopen = function(){
          console.log("Socket has been opened! ", ws.url);
        };
      
        ws.onmessage = function(message) {
          listener(JSON.parse(message.data));
        }; 
        
        ws.onerror = function(errorEvent) {
          console.log("Error en ws! ", errorEvent);
        }
        
        function getStatus() {
          return ws.readyState; 
        }
        
        function getUrl() {
          return url;
        }
        
        function sendRequest (request) {
          var defer = $q.defer();
          var callbackId = getCallbackId();
          callbacks[callbackId] = {
            time: new Date(),
            cb:defer
          };
          request.callback_id = callbackId;
          console.log('Sending request', request);
          ws.send(JSON.stringify(request));
          return defer.promise;
        }
      
        var listener = function (data) {
          var messageObj = data;
          console.log("Received data from websocket: ", messageObj);
          // If an object exists with callback_id in our callbacks object, resolve it
//          console.log("messageObj.callback_id:", messageObj.callback_id);
//          console.log("messageObj.data:", messageObj.data);
          if(callbacks.hasOwnProperty(messageObj.callback_id)) {
            $rootScope.$apply(
                callbacks[messageObj.callback_id].cb.resolve(messageObj.data)
              );
            delete callbacks[messageObj.callbackID];
          }
        }
        // This creates a new callback ID for a request
        var getCallbackId = function () {
          currentCallbackId += 1;
          if(currentCallbackId > 10000) {
            currentCallbackId = 0;
          }
          return currentCallbackId;
        } 
        
      }
    
      Service.WebSockets = function() {
        return webSockets;
      }
      
      Service.initWebSockets = function() {
        initWebSockets();
      }
    
   
      return Service;

  }])
});