/*jslint browser: true*/
/*global UUIDjs, WebSocket, WebSocketCaliope*/

define(['angular', 'uuid'], function(angular) {
  'use strict';

  var moduleWebSocket = angular.module('webSocket', ['NotificationsServices']);

  moduleWebSocket.constant('JsonRpcConst', {
    'version-att-name'  : 'jsonrpc',
    'version-att-value' : '2.0',
    'callback-att-name' : 'id',
    'method-att-name'   : 'method',
    'params-att-name'   : 'params',
    'result-att-name'   : 'result',
    'error-att-name'    : 'error'
  });

  moduleWebSocket.factory('webSocket',
    ['$q', '$rootScope', 'JsonRpcConst','global_constants', 'HandlerResponseServerSrv', '$timeout',
      function($q, $rootScope, jsonRpcConst, global_constants, handlerResponseSrv, $timeout) {

        var Service = {};
        var webSockets = {};

        /**
        * Init the statics websocket for application.
        */
        function initWebSockets() {
          var wsTemplates = new WebSocketCaliope(
            'ws://' + document.domain + ':' + location.port + '/api/ws'
            //'ws://' + '192.168.0.11' + ':' + location.port + '/api/ws'
            //'ws://' + '192.168.50.57' + ':' + location.port + '/api/ws'
          );
          webSockets.serversimm = wsTemplates;
        }

        function WebSocketCaliope(Url) {

          // Keep all pending requests here until they get responses
          var callbacks = {};

          var ws  = new WebSocket(Url);
          var url = "url";

          /*
          Declaring variables with values constants of json rpc.
          */
          var versionAttName  = jsonRpcConst['version-att-name'];
          var versionAttValue = jsonRpcConst['version-att-value'];
          var callbackAttName = jsonRpcConst['callback-att-name'];
          var methodAttName   = jsonRpcConst['method-att-name'];
          var paramsAttName   = jsonRpcConst['params-att-name'];
          var resultAttName   = jsonRpcConst['result-att-name'];
          var errorAttName    = jsonRpcConst['error-att-name'];

          /**
          * Return the status of websocket connection.
          * @returns {number} State of websocket.
          */
          function getStatus() {
            return ws.readyState;
          }

          /**
          * Return the url of connection in the websocket.
          * @returns {string}
          */
          function getUrl() {
            return url;
          }

          /**
          * Create the request message to send to the server side websocket.
          * @param method Name of method.
          * @param params Parameters to send to the server.
          * @param callbackId Identification of request to send.
          * @returns {{}} Object request message to send the server.
          */
          function createRequest (method, params, callbackId) {
            var request = {};

            request[versionAttName] = versionAttValue;
            request[methodAttName] = method;
            request[paramsAttName] = params;
            request[callbackAttName] = callbackId;

            return request;
          }

          /**
           * Send message to the server, this prevent the utilization of websocket when this is not open.
           * @param request Data to send.
           */
          function send(request) {
            if( getStatus() === 0 ) {
              var promiseTO = $timeout(function() {
                if(getStatus() === 0) {
                  send();
                } else {
                  $timeout.cancel(promiseTO);
                }
              },200);
            } else {
              console.log('Sending request application-servicesWebsocket 102', (request));
              ws.send(JSON.stringify(request));
            }
          }


          /**
          * Send a message to the server.
          * @param method Method name to be invoked in the server.
          * @param params Parameters that need the server for processing the request.
          * @returns {Function|promise} Promise of response.
          */
          function sendRequest (method, params) {

            var defer = $q.defer();
            var output;
            var callbackId = UUIDjs.create().hex;
            var request = createRequest(method, params, callbackId);
            callbacks[callbackId] = {
              time: new Date(),
              cb:defer
            };

            //fix remove $$hashKey
            output = angular.toJson(request);
            output = angular.fromJson(output);
            send(output);
            var promise = handlerResponseSrv.addPromisesHandlerRespNotif(defer.promise);
            return promise;
          }


          /**
          * Send a message to the server.
          * @param obj many object to send with method and params.
          * @returns {Function|promise} Promise of response.
          */
          function sendRequestBatch () {

            var request = [];
            var promise = [];
            var output;

            angular.forEach(arguments, function(value){
              var callbackId = UUIDjs.create().hex;
              var defer      = $q.defer();
              request.push(createRequest(value.method, value.params, callbackId));
              callbacks[callbackId] = {
                time: new Date(),
                cb:defer
              };
              promise.push(handlerResponseSrv.addPromisesHandlerRespNotif(defer.promise));
            });

            //fix remove $$hashKey
            output = angular.toJson(request);
            output = angular.fromJson(output);
            send(output);
            return $q.all(promise);
          }
          /**
          * Define a listener for process the response of server side websocket. Apply
          * the response to the root scope of angular.
          * @param data Data to process.
          */
          var listener = function (data) {
            var messageObj = data;
            console.log("Received data from websocket 109: ", messageObj);
            // If an object exists with callback_id in our callbacks object, resolve it
            // console.log("messageObj.data:", messageObj.data);
            if(angular.isArray(messageObj)){
              angular.forEach(messageObj, function(value){
                if(callbacks.hasOwnProperty(value[callbackAttName])) {
                  $rootScope.$apply(
                    callbacks[value[callbackAttName]].cb.resolve(value)
                  );
                  delete callbacks[value[callbackAttName]];
                }
              });
            }else{
              if(callbacks.hasOwnProperty(messageObj[callbackAttName])) {
                $rootScope.$apply(
                  callbacks[messageObj[callbackAttName]].cb.resolve(messageObj)
                );
                delete callbacks[messageObj[callbackAttName]];
              }
            }
          };

          this.sendRequest      = sendRequest;
          this.sendRequestBatch = sendRequestBatch;
          this.getStatus        = getStatus;
          this.getUrl           = getUrl;

          /**
          * Override the method of WebSocket object when the connection is established
          */
          ws.onopen = function() {
            console.log("Socket has been opened! ", ws.url);
            $rootScope.openWebSocket = true;
            $rootScope.$broadcast('openWebSocket', []);
          };

          /**
          * Override the method of WebSocket object when a message is received
          * @param message Message from server
          */
          ws.onmessage = function(message) {
            var datares = JSON.parse(message.data);
            if(angular.isArray(datares)){
              angular.forEach(datares, function(value){
                listener(datares);
              });
            }else{
              listener(datares);
            }
          };

          /**
          * Override the method of WebSocket object when an error is producing in the
          * communication between client and server.
          * @param errorEvent
          */
          ws.onerror = function(errorEvent) {
            console.log("Error en ws! ", errorEvent);
          };

          ws.onclose = function(event) {
            console.log("Socket has been closed! ");
            $rootScope.$broadcast('closeWebSocket', []);
            initWebSockets();
          };

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
