define(['angular'], function(angular) {
  'use strict';

  var module = angular.module('CaliopeController', ['webSocket']);
  
  module.controller('CaliopeController', 
      ['webSocket', '$scope', 
      function(webSocket, $scope) {
        
        $scope.init = function() {
          webSocket.initWebSockets();
          console.log('init');
        }
        
      }]
  )
    
});

