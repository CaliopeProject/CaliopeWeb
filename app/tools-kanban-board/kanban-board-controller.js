/*jslint browser: true*/
/*global define, console, $*/

define(['angular'], function (angular) {
  'use strict';
var dirmodule = angular.module('kanbanBoardCtrl', ['login-security-services']); dirmodule.controller("kanbanBoardCtrl",["SessionSrv", "$scope","webSocket", "$log", function(security, $scope, webSocket, $log) {
    var uuid, tasks;

    $scope.$on('openWebSocket', function(event, data) {
      uuid = security.getIdSession();
      $scope.uuid    = uuid;
    });

    var params = {};
    var method = "tasks.getAll";

    params = {
      "uuid" : uuid
    };

    var webSockets = webSocket.WebSockets();
    webSockets.serversimm.sendRequest(method, params).then(function(data){
      $scope.data = data;
    });

  }]);
});
