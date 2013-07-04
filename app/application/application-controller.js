<<<<<<< HEAD
define(['angular', 'application-servicesWebSocket'], function(angular, webSocket) {
  'use strict';

  var module = angular.module('CaliopeController', ['webSocket']);
  
  module.controller('CaliopeController', 
      ['webSocket', '$scope', 
      function(webSocket, $scope) {
        
        $scope.init = function() {
          webSocket.initWebSockets();
        }
        
      }]
  );
  
  module.controller('firstForm', ['$scope','MyService', function($scope, MyService){
    $scope.customers = MyService.getCustomers();
    $scope.undato    = MyService.getUndato();
  }]);
    
});