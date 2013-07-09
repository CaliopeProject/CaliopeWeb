define(['angular', 'CryptoSHA256'], function(angular) {
  'use strict';
  
  var moduleServices = angular.module('SecurityServices', []);
  
  moduleServices.factory('SessionSrv', 
      ['$q', '$rootScope', '$http', 'webSocket', 
       function($q, $rootScope, $http, webSocket) {
        
        var keyIdSession = 'caliope_uuid_session';
        var keyUserSession = 'caliope_user_session';
        var Services = {};
        
        Services.createSession = function(uuid, username) {
          localStorage.setItem(keyIdSession, uuid);
          localStorage.setItem(keyUserSession, username);
        }
        
        Services.removeSession = function() {
          localStorage.removeItem(keyIdSession);
          localStorage.removeItem(keyUserSession)
        }
        
        Services.getIdSession = function() {
          return localStorage.getItem(keyIdSession);
        }
        
        Services.getUserNameSession = function () {
          return localStorage.getItem(keyUserSession);
        }
        
        return Services;
        
       }
      ]
  );
    
  moduleServices.factory('LoginSrv', 
      ['$q', '$rootScope', '$http', 'webSocket', 
       function($q, $rootScope, $http, webSocket) {
        
        var Services = {};
        
        Services.authenticate = function(login) {  
          var user = login.username;
          var pwdSHA256 = Crypto.SHA256(login.password);
          var _login = {};
          _login.login = user;
          _login.password = pwdSHA256;

          var request = {};
          request = { 
              "cmd" : "authentication",
              "login" : _login.login,
              "password" : _login.password
            };
          var promise = {};
          
          var webSockets = webSocket.WebSockets();
          promise = webSockets.templates.sendRequest(request);
          return promise;
        }
        
        return Services;
      }
     ]
  );
  
  
});