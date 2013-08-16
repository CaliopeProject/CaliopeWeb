/*jslint browser: true*/
/*global localStorage, Crypto, $scope*/
define(['angular', 'CryptoSHA256', 'angular-ui-bootstrap-bower'], function(angular) {
  'use strict';

  var moduleServices = angular.module('login-security-services', ['ui.bootstrap.dialog']);

  moduleServices.factory('SessionSrv',
    ['$q', '$rootScope', '$http', 'webSocket',
      function($q, $rootScope, $http, webSocket) {

        var keyIdSession = 'caliope_uuid_session';
        var keyUserSession = 'caliope_user_session';
        var Services = {};

        Services.createSession = function(uuid, username) {
          localStorage.setItem(keyIdSession, uuid);
          localStorage.setItem(keyUserSession, username);
        };

        Services.removeSession = function() {
          localStorage.removeItem(keyIdSession);
          localStorage.removeItem(keyUserSession);
        };

        Services.getIdSession = function() {
          return localStorage.getItem(keyIdSession);
        };

        Services.getUserNameSession = function () {
          return localStorage.getItem(keyUserSession);
        };

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
          //var pwdSHA256 = login.password;
          var _login = {};
          _login.login = user;
          _login.password = pwdSHA256;


          var params = {};
          var method = "login.authenticate";
          params = {
            "username" : _login.login,
            "password" : _login.password
          };

          var promise = {};

          var webSockets = webSocket.WebSockets();
          promise = webSockets.serversimm.sendRequest(method, params);
          return promise;
        };

        Services.currentAuthenticate = function(uuidLocalStorage) {
          var promise = {};
          if (uuidLocalStorage !== undefined){
            var method = "login.authenticate_with_uuid";
            var params = {
              "uuid" : uuidLocalStorage
            };
            var webSockets = webSocket.WebSockets();
            promise = webSockets.serversimm.sendRequest(method, params);
         }
         return  promise;
        };

        return Services;
      }
    ]
  );

  moduleServices.factory('loginSecurity', [
  '$http',
  '$q',
  '$location',
  'loginRetryQueue',
  '$dialog',
  'LoginSrv',
  'SessionSrv',
  'webSocket',
  function($http,
  $q,
  $location,
  queue,
  $dialog,
  LoginSrv,
  SessionSrv,
  webSocket) {

    var opts = {
      backdrop: true,
      keyboard: true,
      backdropClick: false,
      templateUrl:   "./login/partial-login-form.html",
      controller: 'login-controllers-form'
    };

    // Login form dialog stuff
    var loginDialog = null;

    // Redirect to the given url (defaults to '/')
    function redirect(url) {
      url = url || '/';
      $location.path(url);
    }

    function onLoginDialogClose(success) {
      loginDialog = null;
      if ( success ) {
        queue.retryAll();
      } else {
        queue.cancelAll();
        redirect();
      }
    }


    function openLoginDialog() {
      if ( loginDialog ) {
        throw new Error('Ya esta abierta!');
      }
      loginDialog = $dialog.dialog(opts);
      loginDialog.open().then(onLoginDialogClose);
    }

    function closeLoginDialog(success) {
      if (loginDialog) {
        loginDialog.close(success);
      }
    }

    // The public API of the service
    var service =  {

      // Get the first reason for needing a login
      getLoginReason: function() {
        return queue.retryReason();
      },

      // Show the modal login dialog
      showLogin: function() {
        openLoginDialog();
      },

      // Attempt to authenticate a user by the given email and password
      login: function(username, password) {

        var pwdSHA256 = Crypto.SHA256(password);
        var _login = {};

        _login.login = username;
        _login.password = pwdSHA256;

        var params = {};
        var method = "login.authenticate";
        params = {
          "username" : _login.login,
          "password" : _login.password
        };

        var webSockets = webSocket.WebSockets();
        var request    = webSockets.serversimm.sendRequest(method, params);

        return request.then(function(data) {
          if(data.user !== undefined){
            service.currentUser = data;
            SessionSrv.createSession(data.uuid,data.user);
          }else{
            service.currentUser = null;
          }

          if ( service.isAuthenticated() ) {
            closeLoginDialog(true);
          }
        });
      },

      // Give up trying to login and clear the retry queue
      cancelLogin: function() {
        closeLoginDialog(false);
        redirect();
      },

      // Logout the current user and redirect
      logout: function(redirectTo) {
        var uuid = SessionSrv.getIdSession();
        var params = {};
        var method = "login.logout";

        params = {
          "uuid"     : uuid
        };

        SessionSrv.removeSession();
        service.currentUser = null;
        redirect(redirectTo);

        var webSockets = webSocket.WebSockets();
        var request = webSockets.serversimm.sendRequest(method, params);
      },

      // Ask the backend to see if a user is already authenticated - this may be from a previous session.
      requestCurrentUser: function(uuidLocalStorage) {
        if ( service.isAuthenticated() ) {
          return $q.when(service.currentUser);
        }
        return LoginSrv.currentAuthenticate(uuidLocalStorage).then(function(data) {
          if(data.user !== undefined){
            service.currentUser = data;
          }else{
            service.currentUser = null;
          }
          return service.currentUser;
        });
      },

      // Information about the current user
      currentUser: null,

      // Is the current user authenticated?
      isAuthenticated: function(){
        return !!service.currentUser;
      },

      // Is the current user an adminstrator?
      isAdmin: function() {
        return !!(service.currentUser && service.currentUser.admin);
      }
    };

    // Register a handler for when an item is added to the retry queue
    queue.onItemAddedCallbacks.push(function(retryItem) {
      if ( queue.hasMore() ) {
        service.showLogin();
      }
    });

    return service;

  }]);
});
