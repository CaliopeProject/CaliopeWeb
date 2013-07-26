/*jslint browser: true*/
/*global define, console, $*/

define(['angular'], function (angular) {
  'use strict';

  var dirmodule = angular.module('kanbanBoardCtrl', ['login-security-services']);

  dirmodule.controller("kanbanBoardCtrl",["SessionSrv", "$scope","webSocket", "$log", function(security, $scope, webSocket, $log) {
    var uuid;

    $scope.$on('openWebSocket', function(event, data) {
      uuid = security.getIdSession();
    });

    var params = {};
    var method = "task.getAll";

    params = {
      "uuid" : uuid
    };

    var webSockets = webSocket.WebSockets();
    var request = webSockets.serversimm.sendRequest(method, params);

    $log.info(request);

    $scope.columns = [
      {
        name: 'To Do',
        notes: [
          {description: 'Buscar que hacer'},
          {description: 'El ser o el ente?'},
          {description: 'Salvar al mundo (con la panza llena)'},
          {description: 'Adoptar una directiva sin controlador'}
        ]
      },
      {
        name: 'Doing',
        notes: [
          {description: 'plantilla de tareas'}
        ]
      },
      {
        name: 'Done',
        notes: [
          {description: 'Perder muchoooo tiempo contando llaves, corchetes y paréntesis'},
          {description: 'hablar mal de JS'},
          {description: 'desterrar a Java'}
        ]
      }
    ];

  }]);

});
