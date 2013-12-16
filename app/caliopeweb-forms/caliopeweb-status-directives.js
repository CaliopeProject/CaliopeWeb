/*jslint browser: true, unparam: true */
/*global define, $scope, angular, Crypto*/

define(['angular', 'caliopeweb-template-services'], function(angular) {
  'use strict';

  var moduleStatus = angular.module('status-directives',['CaliopeWebTemplatesServices']);

  moduleStatus.controller('statusController', ['$scope', '$attrs', function($scope, $attrs){
    console.log('atributos directive status',$attrs);
    console.log('scope directive status',$scope);
  }]);

  moduleStatus.directive('widgetStatus', ['caliopewebTemplateSrv', function(caltemsrv) {

    return {

      controller:'statusController',
      templateUrl: 'caliopeweb-forms/caliopeweb-status-partial.html',
      restrict: 'E',
      replace: true,
      link: function($scope, $element, $attrs) {

        $scope.options = [ 'Realizado'
                        , 'Proceso' 
                        ,  'Guardado'
                        ,  'Abierto' ];

        if($attrs.hasOwnProperty('targetUuid')) {
          $scope.$watch($attrs.targetUuid, function(value){
            $scope.uuid = value;
          });
        }

        if($attrs.hasOwnProperty('targetEntity')) {
          $scope.$watch($attrs.targetEntity, function(value){
            $scope.entity = value;
          });
        }

        $scope.changeStatus  = function(){
          var data = {
            field_name : 'status'
           ,value      : $scope.status.name
          };
          caltemsrv.sendDataForm($scope.entity, 'form' + '.updateField', data, $scope.targetTask.uuid);
          caltemsrv.sendDataForm($scope.entity, 'form' + '.commit', {}, $scope.targetTask.uuid);
        };
      }
    };

  }]);
});
