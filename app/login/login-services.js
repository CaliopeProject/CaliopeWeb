define(['angular', 'CryptoSHA256'], function(angular) {
  'use strict';
  
  var moduleServices = angular.module('LoginServices', []);
  
  moduleServices.factory('LoginSrv', 
      ['$q', '$rootScope', '$http', 'webSocket', 
       function($q, $rootScope, $http, webSocket) {
        
        return {
          authenticate : function(login) {  
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
        };
      }
     ]
  );
});
