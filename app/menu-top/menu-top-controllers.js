/*jslint browser: true*/
/*global $scope, angular */

define(['angular','angular-ui-bootstrap-bower' ], function(angular) {
  'use strict';
  var moduleControllers = angular.module('MenuTopControllers', []);


  moduleControllers.constant('messageGeneric', {
    administrador: 'Por favor informe al administrador del sistema'
  });

  moduleControllers.controller('alertCtrl',['$scope',
    function($scope){

      $scope.$on('ChangeTextAlertMessage', function(text) {
        console.log('On ChangeTextAlertMessage', text);
        $scope.alertMessage = text;
      });
    
      $scope.$watch('processingResponse', function(value){
        console.log('Change processingResponse', value);
        if(value === true){
          $scope.alertMessage = 'Procesando';
        }else{
          //$scope.alertMessage = '';
        }
      });

      $scope.processingResponse  = false;
      $scope.alertMessage        = 'hola mundo';
    }
  ]);
});
