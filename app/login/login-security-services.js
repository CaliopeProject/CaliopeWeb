/*jslint browser: true*/
/*global localStorage, Crypto, $scope*/
define(['angular', 'CryptoSHA256'], function(angular) {
  'use strict';

  var moduleServices = angular.module('login-security-services', []);

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
          var _login = {};
          _login.login = user;
          _login.password = pwdSHA256;

          var params = {};
          var method = "authentication";
          params = {
            "login" : _login.login,
            "password" : _login.password
          };
          var promise = {};

          var webSockets = webSocket.WebSockets();
          promise = webSockets.serversimm.sendRequest(method, params);
          return promise;
        };

        return Services;
      }
    ]
  );


  moduleServices.factory('security', ['$http', '$q', '$location', 'securityRetryQueue', '$dialog', function($http, $q, $location, queue, $dialog) {

    $scope.opts = {
      backdrop: true,
      keyboard: true,
      backdropClick: false,
      templateUrl:   "./login/partial-login-form.html",
      controller: 'login-controllers-form'
    };

    // Login form dialog stuff
    var loginDialog = null;

    function onLoginDialogClose(success) {
      loginDialog = null;
      if ( success ) {
        queue.retryAll();
      } else {
        queue.cancelAll();
        redirect();
      }
    }

    // Redirect to the given url (defaults to '/')
    function redirect(url) {
      url = url || '/';
      $location.path(url);
    }

    function openLoginDialog() {
      if ( loginDialog ) {
        throw new Error('Ya esta abierta!');
      }
      loginDialog = $dialog.dialog($scope.opts);
      loginDialog.open().then(onLoginDialogClose);
    }

    function closeLoginDialog(success) {
      if (loginDialog) {
        loginDialog.close(success);
      }
    }

    // Register a handler for when an item is added to the retry queue
    queue.onItemAddedCallbacks.push(function(retryItem) {
      if ( queue.hasMore() ) {
        service.showLogin();
      }
    });


    // The public API of the service
    return {

      // Get the first reason for needing a login
      getLoginReason: function() {
        return queue.retryReason();
      },

      // Show the modal login dialog
      showLogin: function() {
        openLoginDialog();
      },

      // Attempt to authenticate a user by the given email and password
      login: function(email, password) {
        var request = $http.post('/login', {email: email, password: password});
        return request.then(function(response) {
          service.currentUser = response.data.user;
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
        $http.post('/logout').then(function() {
          service.currentUser = null;
          redirect(redirectTo);
        });
      },

      // Ask the backend to see if a user is already authenticated - this may be from a previous session.
      requestCurrentUser: function() {
        if ( service.isAuthenticated() ) {
          return $q.when(service.currentUser);
        } else {
          return $http.get('/current-user').then(function(response) {
            service.currentUser = response.data.user;
            return service.currentUser;
          });
        }
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
  };
});
