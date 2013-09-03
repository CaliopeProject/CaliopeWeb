define(['angular'], function(angular) {
  'use strict';

  var moduleControllers = angular.module('ProyectoControllers', []);

  moduleControllers.controller('ProyectomtvCtrl',
      ['caliopewebTemplateSrv','$scope', '$routeParams',
       function (caliopeWebTemplateSrv, $scope, $routeParams) {


         $scope.sendAction = function(form, formTemplateName, actionMethod, modelUUID, objID, paramsToSend) {

          console.log('ProyectomtvCtrl-sendAction')

         };


      }]
  );
});
