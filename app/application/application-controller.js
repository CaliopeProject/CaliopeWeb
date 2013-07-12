define(['angular', 'application-servicesWebSocket'], function(angular, webSocket) {
  'use strict';

  var module = angular.module('CaliopeController', ['webSocket']);
  
  module.controller('CaliopeController', 
      ['webSocket', '$scope', 
      function(webSocket, $scope) {
        
        $scope.init = function () {
          webSocket.initWebSockets();
          $scope.alertMessage = "";
          
          /*
          $scope.$watch('alertMessage', function(value){
            console.log('Change alertMessage', value);
          });
          */
          
          
          $scope.$on('ChangeTextAlertMessage', function (info) {
            console.log('On ChangeTextAlertMessage', info);
            $scope.alertMessage = info;
          });
                           
        };
        
      }]
  );
  
  module.controller('firstForm', ['$scope','MyService', function($scope, MyService){
    $scope.customers = MyService.getCustomers();
    $scope.undato    = MyService.getUndato();
  }]);
    
});