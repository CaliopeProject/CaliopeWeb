define(['angular'], function(angular) {
  'use strict';

  var moduleControllers = angular.module('LoginControllers', []);
  
  moduleControllers.controller('LoginCtrl', 
      ['LoginSrv','$scope', '$routeParams', 
       function (service, $scope, $routeParams) {
       
        $scope.authenticate = function () {                                          
          service.authenticate($scope.login); 
        };         
      }]
  ); 
});