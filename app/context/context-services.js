/*jslint browser: true,  unparam: true*/
/*global define, console, $*/

define(['angular', 'application-servicesWebSocket'], function(angular) {
  'use strict';

  var moduleServices = angular.module('ContextServices', ['webSocket']);

  moduleServices.factory('contextService', ['$q','webSocket','$rootScope', 'taskService',
    function($q, websocketSrv, $rootScope, taskService) {

      var services = {};
      var CONTEXTS ;
      var defaultContext;
      var WEBSOCKETS = websocketSrv.WebSockets();

      function infoUpdate(){
        $rootScope.$broadcast('loadedContexts');
      }

      /**
       * Load CONTEXTS from server.
       * @returns {promise}
       */
      services.loadUserContexts = function () {
        var method = "tasks.getCurrentUserContexts";
        var params = {};

        var deferred = $q.defer();
        var promise = deferred.promise;

        WEBSOCKETS.serversimm.sendRequest(method, params).then( function( responseContexts) {
          if( !responseContexts.hasOwnProperty('error') ) {
            CONTEXTS = responseContexts;
            if( angular.isArray(CONTEXTS) && CONTEXTS.length > 0 ) {
              defaultContext = CONTEXTS[0];
              infoUpdate();
            }

            deferred.resolve( {
              defaultContext : defaultContext
            });

          }
        });

        return promise;
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
      services.changeCurrentContext = function(context) {

        taskService.loadData(context.uuid);

        if(defaultContext !== context){
          defaultContext = context;
          infoUpdate();
        }
        return defaultContext;
      };

      return services;

    }
  ]);
});
