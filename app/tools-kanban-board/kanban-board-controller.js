/*jslint browser: true*/
/*global define, console, $*/


define(['angular','angular-dragdrop'], function (angular) {
  'use strict';
  var dirmodule = angular.module('kanbanBoardCtrl', ['login-security-services','ngDragDrop']);

  dirmodule.controller("kanbanBoardCtrl",
    ["SessionSrv", "$scope","webSocket", "$log", 'taskService', 'caliopewebTemplateSrv',
      function(security, $scope, webSocket, $log, taskService, tempServices) {

        var uuid, tasks;
        var webSockets = webSocket.WebSockets();

        $scope.$on('openWebSocket', function(event, data) {
          uuid = security.getIdSession();
        });

        function updateKanban(uuid) {
          var params = {};
          var method = "tasks.getAll";

          params = {
            "uuid" : uuid
          };

          webSockets.serversimm.sendRequest(method, params).then(function(data){
            data[1] = ({"category":"Doing","tasks":[{"tarea":null,"uuid":"99cc7bdb-a8dc-4511-a94e-7f637c08148b","description":"dfasdfasfasdf\nadfasdf\nadsf asdf ads\nf"},{"tarea":null,"uuid":"860ffd57-672c-4491-ss86-62fe5a7f09bf","description":'la descrip 03'}]});
            $scope.data = data;
          });

          $scope.deleteTask = function( uuid ) {
            taskService.deleteTask(uuid);
          };
        }

        $scope.$on('updateKanban', function(event, data) {
          updateKanban(uuid);
        });

        updateKanban(uuid);

        $scope.dropCallback = function(event, ui) {

          var category , categ, uuid, findCateg, itemsbycateg, data;
          var params = {};
          var method = "tasks.edit";

          itemsbycateg = (function(){
            var i,j,categoryUiid = [];
            for(i=0; $scope.data.length > i; i++){
              for(j=0; $scope.data[i].tasks.length > j; j++){
                if($scope.data[i].tasks[j].uuid === undefined){
                  $scope.data[i].tasks.splice(j, 1);
                }else{
                  categoryUiid.push({uuid : $scope.data[i].tasks[j].uuid , categ :$scope.data[i].category});
                }
              }
            }

            return categoryUiid;
          }());

          findCateg = function (array, value) {
            var i, items;
            console.log('pase');
            for(i = 0; i<array.length; i++) {
                if(array[i].uuid === value){
                  return array[i].categ;
                }
            }
          };

          uuid         = ui.draggable.attr("uuid");
          categ        = findCateg(itemsbycateg, uuid);

          console.log('uuid',uuid);
          console.log('cagt',categ);

          if(categ !== undefined){
            data  = {
              "uuid"     : uuid,
              "category" : categ
            };
            tempServices.sendDataForm('asignaciones', 'tasks.edit', data, '', uuid );
          }
          // webSockets.serversimm.sendRequest(method, params);
        };

      }]);
});
