define(['angular'], function(angular) {
  'use strict';
  
  var moduleServices = angular.module('ContextServices', []);
  
  moduleServices.factory('contextService', ['$q', 'webSocket',
    function($q, websocketSrv) {

      var services = {};
      var contexts = undefined;
      var defaultContext = undefined;
      var WEBSOCKETS = websocketSrv.WebSockets();

      /**
       * Load contexts from server.
       * @returns {promise}
       */
      services.loadUserContexts = function () {
        var method = "tasks.getCurrentUserContexts";
        var params = {};
        var deferred = $q.defer();
        var promise = deferred.promise;

        WEBSOCKETS.serversimm.sendRequest(method, params).then( function( responseContexts) {
          if( !responseContexts.hasOwnProperty('error') ) {
            contexts = responseContexts;
            if( angular.isArray(contexts) && contexts.length > 0 ) {
              defaultContext = contexts[0];
            }
            deferred.resolve( {
              contexts : contexts,
              defaultContext : defaultContext
            } );
          }
        });

        return promise;
      }

      /**
       * Get the users context loaded from server
       * @returns {array}
       */
      services.getUserContexts = function () {
        return contexts;
      }

      /**
       * Get the default context
       * @returns {object}
       */
      services.getDefaultContext = function() {
        return defaultContext;
      }

      return services;

    }
  ]);
});
