define(['angular', 'application-servicesWebSocket'], function(app, webSocket) {
  'use strict';

  return angular.module('appcontroller',['webSocket']).
      controller('firstForm', ['$scope','MyService', function($scope, MyService){
          $scope.customers = MyService.getCustomers();
      }]);
});
