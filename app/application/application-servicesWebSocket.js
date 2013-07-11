/*jslint browser: true*/
/*global UUIDjs, WebSocket, WebSocketCaliope*/

define(['angular', 'uuid'], function(angular, uuid) {
  'use strict';
  angular.module('webSocket', []).factory('webSocket',
    ['$q', '$rootScope', function($q, $rootScope, uuid) {

      var Service = {};
      var webSockets = {};


      function WebSocketCaliope(Url) {

        // Keep all pending requests here until they get responses
        var callbacks = {};
        // Create a unique callback ID to map requests to responses
        var currentCallbackId = 0;

        var ws  = new WebSocket(Url);
        var url = "url";



        function getStatus() {
          return ws.readyState;
        }

        function getUrl() {
          return url;
        }

        function sendRequest (request) {
          var defer = $q.defer();
          var callbackId = UUIDjs.create().hex;
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
              callbacks[messageObj.callback_id].cb.resolve(messageObj)
            );
            delete callbacks[messageObj.callbackID];
          }
        };

        this.sendRequest = sendRequest;
        this.getStatus   = getStatus;
        this.getUrl      = getUrl;

        ws.onopen = function(){
          console.log("Socket has been opened! ", ws.url);
        };

        ws.onmessage = function(message) {
          listener(JSON.parse(message.data));
        };

        ws.onerror = function(errorEvent) {
          console.log("Error en ws! ", errorEvent);
        };
      }

      function initWebSockets() {
        var wsTemplates = new WebSocketCaliope('ws://' + document.domain + ':' + location.port + '/api/ws'
        );
        webSockets.templates = wsTemplates;
        //webSockets.login = wsLogin;
        //webSockets.templatesLayout = wsTemplateLayout;
      }

      Service.WebSockets = function() {
        return webSockets;
      };

      Service.initWebSockets = function() {
        initWebSockets();
      };

      return Service;

    }]);
});
