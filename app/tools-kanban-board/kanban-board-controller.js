/*jslint browser: true*/
/*global define, console, $*/


define(['angular','angular-dragdrop'], function (angular) {
  'use strict';
var dirmodule = angular.module('kanbanBoardCtrl', ['login-security-services','ngDragDrop']);
dirmodule.controller("kanbanBoardCtrl",
  ["SessionSrv", "$scope","webSocket", "$log", 'taskService',
  function(security, $scope, webSocket, $log, taskService) {
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
     data[1] = ({"category":"Doing","tasks":[{"tarea":null,"uuid":"99cc7bdb-a8dc-4511-a94e-7f637c08148b","description":"dfasdfasfasdf\nadfasdf\nadsf asdf ads\nf"},{"tarea":null,"uuid":"860ffd57-672c-4491-ss86-62fe5a7f09bf","description":null}]});
     data[2] = ({"category":"Doing","tasks":[{"tarea":null,"uuid":"99cc7bdb-a8dc-4511-a94e-7f637c08148b","description":"dfasdfasfasdf\nadfasdf\nadsf asdf ads\nf"},{"tarea":null,"uuid":"860ffd57-672c-4491-ss86-62fe5a7f09bf","description":null}]});

     $scope.data = data;
    });

    $scope.editTask = function ( uuid, category ){
      taskService.editTask(uuid, category);
    };

    $scope.deleteTask = function( uuid ) {
      taskService.deleteTask(uuid);
    };

    $scope.startCallback = function(event, ui) {
      console.log('You started draggin');
    };

    $scope.stopCallback = function(event, ui) {
      console.log('Why did you stop draggin me?');
    };

    $scope.dragCallback = function(event, ui) {
      console.log('hey, look I`m flying');
    };

    $scope.dropCallback = function(event, ui) {
      console.log('hey, you dumped me :-(');
    };

    $scope.overCallback = function(event, ui) {
      console.log('Look, I`m over you');
    };

    $scope.outCallback = function(event, ui) {
      console.log('I`m not, hehe');
    };


  }]);
});
