/*jslint browser: true,  unparam: true*/
/*global define, console, $*/

define(['angular', 'application-constant', 'application-servicesWebSocket', 'context-services', 'context-directives', 'angular-ui-bootstrap-bower', 'ng-pdfviewer', 'caliopeweb-template-services','caliopeweb-formDirectives'], function (angular, $caliope_constant) {
  'use strict';

  var treemodule = angular.module('treeController', ['webSocket', 'ContextServices', 'context-directives', 'ui.bootstrap', 'ngPDFViewer', 'CaliopeWebTemplatesServices', 'CaliopeWebFormDirectives']);

  treemodule.config(function($sceDelegateProvider){
    $sceDelegateProvider.resourceUrlWhitelist(['^(?:http(?:s)?:\/\/)?(?:[^\.]+\.)?$', 'self']);
  });

  treemodule.controller("treeCtrl", ["$scope", 'webSocket', 'contextService', 'PDFViewerService','caliopewebTemplateSrv'

    ,function($scope, webSocket, contextService, pdf, ctempSrv) {
        var ALLFORM;
        var ALLMODEL;
        var WEBSOCKETS         = webSocket.WebSockets();
        var serverFile         = $caliope_constant.hyperion_server_address_d;
        $scope.form = {};

        //function getAttachmentInfo(dataToProcess){
          //var attachment = [];
          //angular.forEach(dataToProcess, function(vAllattach){
            //angular.forEach(vAllattach.attachment, function(vattach){
            //});
          //});
          //return alluser;
        //}

        $scope.$watch(function(){return contextService.getDefaultContext();}, function(value){

          if(!angular.isUndefined(value)){
            var method     = "form.getAllWithThumbnails";
            var params     = {context: value.uuid};

            WEBSOCKETS.serversimm.sendRequest(method, params).then(function(responseContexts){
              var tempALLFORM  = ALLFORM  = responseContexts[0].instances;
              var tempALLMODEL = ALLMODEL = responseContexts[1].models;

              angular.forEach(tempALLFORM, function(vAllFORM, kALLFORM){
                var showinfo = [];
                if(vAllFORM.browsable){
                  angular.forEach(tempALLMODEL, function(vAllMODEL){
                    if(vAllFORM.classname === vAllMODEL.form.name){
                      if(!angular.isUndefined(vAllMODEL.layout)){
                        angular.forEach(vAllMODEL.layout.columns, function(vcolumns){
                          angular.forEach(vcolumns.elements, function(velements){
                            angular.forEach(vAllMODEL.form.html, function(vhtml){
                              if(vhtml.name === velements){
                                showinfo.push({
                                  name    : vhtml.caption
                                  ,content : tempALLFORM[kALLFORM].data[velements]
                                });
                              }
                            });

                          });
                        });
                      }
                    }
                  });
                  tempALLFORM[kALLFORM].filter = showinfo;
                }else{
                  delete tempALLFORM[kALLFORM];
                }
              });

              $scope.data = tempALLFORM ;

            });
          }
        });


        /*show history*/
        $scope.showHistory = function(number) {
          var method     = "form.getHistory";
          var dataform   = $scope.data[number];
          var params     = {uuid: dataform.uuid};

          WEBSOCKETS.serversimm.sendRequest(method, params).then(function(responseContexts){
                $scope.history = responseContexts;
          });
        };

        /*show attachment*/
        $scope.showAttach = function(number) {
          var dataform        = $scope.data[number];
          ctempSrv.loadAttachments(getAttachmentInfo(dataform));
        };

        /* Manage the form link */
        $scope.showLink = function (type, number) {
          var dataform        = $scope.data[number];
          $scope.itemattach   = type;
          $scope.form.name    = dataform.classname;
          $scope.form.mode    = 'edit';
          $scope.form.entity  = dataform.classname;
          $scope.form.uuid    = dataform.uuid;
          $scope.form.generic = true;
          $scope.form.templateName = 'jsonTemplate';
        };


        /* Manage the pdf link */

        //$scope.pdfURL = "../../context/test.pdf";
        $scope.pdfURL   = serverFile + "ece79476-ee33-4592-ad7e-0174cc1a4c6b";

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
