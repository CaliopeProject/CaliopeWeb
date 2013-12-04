/*jslint browser: true,  unparam: true*/
/*global define, console, $*/

define(['angular', 'application-constant', 'application-servicesWebSocket', 'context-services', 'context-directives', 'angular-ui-bootstrap-bower', 'ng-pdfviewer'], function (angular, $caliope_constant) {
  'use strict';

  var treemodule = angular.module('treeController', ['webSocket', 'ContextServices', 'context-directives', 'ui.bootstrap', 'ngPDFViewer' ]);

  treemodule.controller("treeCtrl", ["$scope", 'webSocket', 'contextService', 'PDFViewerService'

    ,function($scope, webSocket, contextService, pdf) {
        var WEBSOCKETS = webSocket.WebSockets();
        var method     = "form.getAll";
        var serverFile = $caliope_constant.hyperion_server_address_d;

        $scope.$watch(function(){return contextService.getDefaultContext();}, function(value){
          if(!angular.isUndefined(value)){
            var params     = {context: value.uuid};
            WEBSOCKETS.serversimm.sendRequest(method, params).then( function(responseContexts){
              $scope.data = responseContexts;
            });
          }
        });

        //$scope.pdfURL = "../../context/test.pdf";
        $scope.pdfURL = serverFile + "ece79476-ee33-4592-ad7e-0174cc1a4c6b";

        $scope.instance = pdf.Instance("viewer");

        $scope.nextPage = function() {
          $scope.instance.nextPage();
        };

        $scope.prevPage = function() {
          $scope.instance.prevPage();
        };

        $scope.gotoPage = function(page) {
          $scope.instance.gotoPage(page);
        };

        $scope.pageLoaded = function(curPage, totalPages) {
          $scope.currentPage = curPage;
          $scope.totalPages = totalPages;
        };

        $scope.loadProgress = function(loaded, total, state) {
          console.log('loaded =', loaded, 'total =', total, 'state =', state);
        };

    }
  ]);
});
