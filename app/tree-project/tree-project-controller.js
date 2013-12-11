/*jslint browser: true,  unparam: true*/
/*global define, console, $*/

define(['angular', 'application-constant', 'application-servicesWebSocket', 'context-services', 'context-directives', 'angular-ui-bootstrap-bower', 'ng-pdfviewer', 'caliopeweb-template-services','caliopeweb-formDirectives', 'application-commonservices'], function (angular, $caliope_constant) {
  'use strict';

  var treemodule = angular.module('treeController', ['webSocket', 'ContextServices', 'context-directives', 'ui.bootstrap', 'ngPDFViewer', 'CaliopeWebTemplatesServices', 'CaliopeWebFormDirectives', 'commonServices']);

  treemodule.config(function($sceDelegateProvider){
    $sceDelegateProvider.resourceUrlWhitelist(['^(?:http(?:s)?:\/\/)?(?:[^\.]+\.)?$', 'self']);
  });

  treemodule.controller("treeCtrl", ["$scope", 'webSocket', 'contextService', 'PDFViewerService','caliopewebTemplateSrv'

    ,function($scope, webSocket, contextService, pdf, ctempSrv) {
        var WEBSOCKETS  = webSocket.WebSockets();
        var serverFile  = $caliope_constant.hyperion_server_address_d;
        $scope.form     = {};


        $scope.$watch('bigCurrentPage + itemsPerPage', function() {
          if(!angular.isUndefined($scope.data)){
            var begin = (($scope.bigCurrentPage - 1) * $scope.itemsPerPage)
            ,end = begin + $scope.itemsPerPage;
            $scope.data.slice(begin, end);
          }
        });

        $scope.$watch(function(){
          return contextService.getDefaultContext();
        }, function(value){

          if(!angular.isUndefined(value)){
            var method     = "form.getAllWithThumbnails";
            var params     = {context: value.uuid};

            WEBSOCKETS.serversimm.sendRequest(method, params).then(function(responseContexts){
              var tempALLFORM  = responseContexts[0].instances;
              var tempALLMODEL = responseContexts[1].models;

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
                                var datafi = tempALLFORM[kALLFORM].data[velements];
                                if(!angular.isUndefined(datafi)){
                                  showinfo.push({
                                     name    : vhtml.caption
                                    ,content : datafi
                                  });
                                }
                              }
                            });
                          });
                        });
                      }
                    }
                    if(!angular.isUndefined(vAllFORM.attachments)){
                      if(vAllFORM.attachments.length > 0){
                        tempALLFORM[kALLFORM].attachments.show = false;
                      }else{
                        delete tempALLFORM[kALLFORM].attachments;
                      }
                    }
                  });
                  if(showinfo.length > 0){
                    tempALLFORM[kALLFORM].filter = showinfo;
                  }
                }else{
                  tempALLFORM.splice(kALLFORM, 1);
                }
              });
              $scope.data = tempALLFORM;
            });
          }
        });


        /*show history*/
        $scope.showHistory = function(number) {
          var method     = "form.getHistory";
          var params     = {uuid: $scope.data[number].uuid};

          WEBSOCKETS.serversimm.sendRequest(method, params).then(function(responseContexts){
            if(!angular.isUndefined(responseContexts)){
              $scope.data[number].history = responseContexts;
            }
          });
        };

        /*show attachment*/
        $scope.showAttach = function(number) {
          var dataform  = $scope.data[number].attachments;
          var params    = [];

          angular.forEach(dataform, function(vDATA, kDATA){
            params.push(vDATA.uuid);
          });

          dataform.show = true;

          ctempSrv.loadAttachments(params).then(function(resthumbs){
            angular.forEach(dataform, function(vDATA2, kDATA2){
              angular.forEach(resthumbs, function(vTHUMB, kTHUMB){
                if(vDATA2.uuid === vTHUMB.id){
                  $scope.data[number].attachments[kDATA2] = vTHUMB;
                }
              });
            });
          });
        };

        /* Manage the form link */
        $scope.showLink = function (type, obform, index) {

          if(type === 'form'){
              $scope.form.name         = obform.classname;
              $scope.form.mode         = 'edit';
              $scope.form.entity       = obform.classname;
              $scope.form.uuid         = obform.uuid;
              $scope.form.generic      = true;
              $scope.form.templateName = 'jsonTemplate';
              $scope.itemattach = 'form';
          }else{
            var i;
            var mime       = obform.attachments[index].mime;
            var filesmime  = ['text', 'image', 'pdf'];
            var filteratta;
            for (i = 0; i < filesmime.length; i++){
              var patt1      = "[^\n]*" + filesmime[i] + "/[^\n]*($|\n)";
              var patt2      = "." + filesmime[i] + "$";
              var re         = new RegExp(patt1);
              if(mime.match(re)){
                filteratta =  filesmime[i];
              }
              var re         = new RegExp(patt2);
              if(mime.match(re)){
                filteratta =  filesmime[i];
                break;
              }
            };

            switch(filteratta) {
              case 'image':
                $scope.itemattach = 'image';
                $scope.imgdata    = obform.attachments[index].thumbnail.data;
                break;
              case 'pdf':
                $scope.itemattach = 'pdf';
                $scope.pdfURL     = serverFile + obform.attachments[index].id;
                $scope.instance   = pdf.Instance("viewer");
                break;
            }
          }
        };

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
