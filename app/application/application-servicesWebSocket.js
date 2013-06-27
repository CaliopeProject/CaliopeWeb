define(['angular'], function(angular) {
  'use strict';
  angular.module('webSocket', []).factory('webSocket', 
      ['$q', '$rootScope', function($q, $rootScope) {
        
    var Service = {};   

    Service.WebSocketCaliope = function(Url) {
      var ws = new WebSocket(Url);
      
      ws.onopen = function(){
        console.log("Socket has been opened! ", ws.url);
      };
    
      ws.onmessage = function(message) {
        listener(JSON.parse(message.data));
      }; 
      
      var sendRequest = function (request) {
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
        if(callbacks.hasOwnProperty(messageObj.callback_id)) {
          $rootScope.$apply(callbacks[messageObj.callback_id].cb.resolve(messageObj.data));
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
      
      return this;
    }
    
    Service.WebSockets = function() {
      var config = "esto";
      /*
          templates : new WebSocketCaliope("ws://127.0.0.1:8080/WebSocketTest/Templates"),
          templatesLogin : new WebSocketCaliope("ws://127.0.0.1:8080/WebSocketTest/Templates1")
      };
      */
      var getConfig = function() {
        return this.config;
      }
      
      return this;
    }
        

    // Keep all pending requests here until they get responses
    var callbacks = {};
    // Create a unique callback ID to map requests to responses
    var currentCallbackId = 0;
    // Create our websocket object with the address to the websocket
    var ws = {};
    
    var ws = new WebSocket("ws://127.0.0.1:8080/WebSocketTest/Templates");
    
    
    ws.onopen = function(){
      console.log("Socket has been opened! ", ws.url);
    };

    ws.onmessage = function(message) {
      listener(JSON.parse(message.data));
    }; 
    
//    Service.openWebSocket = function(URL) {
//   
//      return ws;
//    }


    

    Service.sendRequest = function(request) {
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

    function listener(data) {
      var messageObj = data;
      console.log("Received data from websocket: ", messageObj);
      // If an object exists with callback_id in our callbacks object, resolve it
      if(callbacks.hasOwnProperty(messageObj.callback_id)) {
        $rootScope.$apply(callbacks[messageObj.callback_id].cb.resolve(messageObj.data));
        delete callbacks[messageObj.callbackID];
      }
    }
    // This creates a new callback ID for a request
    function getCallbackId() {
      currentCallbackId += 1;
      if(currentCallbackId > 10000) {
        currentCallbackId = 0;
      }
      return currentCallbackId;
    }         
    
    return Service;

  }])
});
