/*jslint browser: true*/
/*global $scope, angular */

define(['angular','angular-ui-bootstrap-bower'], function(angular) {
  'use strict';
  var moduleControllers = angular.module('MenuTopControllers', ['ui.bootstrap']);

  moduleControllers.controller('alertCtrl',['$scope','HandlerResponseServerSrv',
    function($scope, handlerResServerSrv){

      //insert text body

    }
  ]);
});
