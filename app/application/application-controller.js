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
                    
          $scope.$on('ChangeTextAlertMessage', function (event, data) {
            console.log('On ChangeTextAlertMessage', data);
            $scope.alertMessage = data[0];
          });
                           
        };
        
      }]
  );
  
  module.controller('firstForm', ['$scope','MyService', function($scope, MyService){
    $scope.customers = MyService.getCustomers();
    $scope.undato    = MyService.getUndato();
  }]);
    
});