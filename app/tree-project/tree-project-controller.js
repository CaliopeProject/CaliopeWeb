/*jslint browser: true,  unparam: true*/
/*global define, console, $*/

define(['angular', 'context-services'], function (angular) {
  'use strict';

  var treemodule = angular.module('treeController', ['ContextServices']);

  treemodule.controller("treeCtrl", ["$scope", 'contextService', 'webSocket'

    ,function($scope, contextService, webSocket) {
        var WEBSOCKETS = webSocket.WebSockets();
        var params     = {};
        var method     = "form.getAll";
        WEBSOCKETS.serversimm.sendRequest(method, params).then( function( responseContexts) {
          $scope.text = responseContexts;
        });
    }

  ]);
});
