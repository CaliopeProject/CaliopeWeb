/*jslint browser: true,  unparam: true*/
/*global define, console, $*/

define(['angular', 'application-servicesWebSocket', 'context-services', 'context-directives'], function (angular) {
  'use strict';

  var treemodule = angular.module('treeController', ['webSocket', 'ContextServices', 'context-directives']);

  treemodule.controller("treeCtrl", ["$scope", 'webSocket', 'contextService'

    ,function($scope, webSocket, contextService) {
        var WEBSOCKETS = webSocket.WebSockets();
        var params     = {};
        var method     = "form.getAll";
        WEBSOCKETS.serversimm.sendRequest(method, params).then( function( responseContexts) {
          $scope.text = responseContexts;
        });
    }
  ]);
});
