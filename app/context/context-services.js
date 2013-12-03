/*jslint browser: true,  unparam: true*/
/*global define, console, $*/

define(['angular', 'application-servicesWebSocket'], function(angular) {
  'use strict';

  var moduleServices = angular.module('ContextServices', ['webSocket']);

  moduleServices.factory('contextService', ['webSocket','$rootScope',
    function(websocketSrv, $rootScope) {

      var services = {};
      var CONTEXTS ;
      var defaultContext;
      var WEBSOCKETS = websocketSrv.WebSockets();

      function infoUpdate(){
        $rootScope.$broadcast('loadContexts');
      }

      /**
       * Load CONTEXTS from server.
       * @returns {promise}
       */

      services.loadUserContexts = function () {
        var method = "tasks.getCurrentUserContexts";
        var params = {};

        WEBSOCKETS.serversimm.sendRequest(method, params).then( function( responseContexts) {
          if( !responseContexts.hasOwnProperty('error') ) {
            CONTEXTS = responseContexts;
            if( angular.isArray(CONTEXTS) && CONTEXTS.length > 0 ) {
              defaultContext = CONTEXTS[0];
              infoUpdate();
            }
          }
        });
      };

      /**
       * Get the users context loaded from server
       * @returns {array}
       */

      services.getUserContexts = function () {
        return CONTEXTS;
      };

      /**
       * Get the default context
       * @returns {object}
       */
      services.getDefaultContext = function() {
        return defaultContext;
      };

      /**
       * Change the current context
       * @returns {object}
       */
      services.changeCurrentContext = function(context){
        if(defaultContext !== context){
          defaultContext = context;
          infoUpdate();
        }
      };

      return services;

    }
  ]);
});
