define(['angular'], function(angular) {
  'use strict';
  angular.module('webSocket', []).factory('MyService', ['$q', function($q) {
    // We return this object to anything injecting our service
    var Service = {};
    // Keep all pending requests here until they get responses
    var callbacks = {};
    // Create a unique callback ID to map requests to responses
    var currentCallbackId = 0;
    // Create our websocket object with the address to the websocket
    var ws = new WebSocket('ws://' + document.domain + ':' + location.port + '/api/ws');
        //ws.send(JSON.stringify(request));

      ws.onopen = function(){
        console.log("Socket has been opened!");
      };

      ws.onmessage = function(message) {
        console.log("respuesta!");
        listener(JSON.parse(message.data));
      };

      function sendRequest(request) {
        var defer = $q.defer();
        var callbackId = getCallbackId();
        callbacks[callbackId] = {
          time: new Date(),
          cb:defer
        };
        request.callback_id = callbackId;
        console.log('Sending request', request);
        ws.send("Here's some text that the server is urgently awaiting!"); 
        return defer.promise;
      }

      function listener(data) {
        var messageObj = data;
        console.log("Received data from websocket: ", messageObj);
        // If an object exists with callback_id in our callbacks object, resolve it
        if(callbacks.hasOwnProperty(messageObj.callback_id)) {
          console.log(callbacks[messageObj.callback_id]);
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

      // Define a "getter" for getting customer data
      Service.getCustomers = function() {
        var request = {
          type: "get_customers"
        }
        // Storing in a variable for clarity on what sendRequest returns
        var promise = sendRequest(request);
        return promise;
      }

      Service.getUndato = function(){
        return { midato : 'Un dato para mostrar'}
      }

      return Service;
  }])
});
