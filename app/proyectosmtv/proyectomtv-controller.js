define(['angular'], function(angular) {
  'use strict';

  var moduleControllers = angular.module('ProyectoControllers', []);

  moduleControllers.controller('ProyectomtvCtrl',
      ['caliopewebTemplateSrv','$scope', '$routeParams',
       function (caliopeWebTemplateSrv, $scope, $routeParams) {

        $scope.create = function () {
          var formAng = $scope[$scope.caliopeForm.id];
          var inputs = $scope.elementsFormTemplate;
          var obj = {};
          for( var i = 0; i < inputs.length; i++) {
            obj[inputs[i]] = $scope[inputs[i]];
          }
          caliopeWebTemplateSrv.sendDataForm(obj, $scope.caliopeForm.id);
        };
      }]
  );
});
