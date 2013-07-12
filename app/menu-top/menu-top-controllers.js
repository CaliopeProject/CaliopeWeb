/*jslint browser: true*/
/*global $scope, angular */

define(['angular','angular-ui-bootstrap-bower'], function(angular) {
  'use strict';
  var moduleControllers = angular.module('MenuTopControllers', []);


  moduleControllers.constant('messageGeneric', {
    administrador: 'Por favor informe al administrador del sistema'
  });

  moduleControllers.controller('alertCtrl',['$scope','HandlerResponseServerSrv',
    function($scope, handlerResServerSrv){

      $scope.$on('ChangeTextAlertMessage', function(text) {
        console.log('Onxx ChangeTextAlertMessage', text);
        console.log('servcioNotifica',handlerResServerSrv);
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
