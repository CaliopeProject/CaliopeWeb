/*jslint browser: true,  unparam: true*/
/*global define, console, $*/

define(['angular', 'application-constant', 'application-servicesWebSocket', 'context-services', 'context-directives', 'angular-ui-bootstrap-bower', 'ng-pdfviewer', 'caliopeweb-template-services','caliopeweb-formDirectives', 'application-commonservices', 'task-services'], function (angular, $caliope_constant) {
  'use strict';

  var treemodule = angular.module('treeController', ['webSocket', 'ContextServices', 'context-directives', 'ui.bootstrap', 'ngPDFViewer', 'CaliopeWebTemplatesServices', 'CaliopeWebFormDirectives', 'commonServices', 'task-services']);

  treemodule.config(function($sceDelegateProvider){
    //$sceDelegateProvider.resourceUrlWhitelist(['^(?:http(?:s)?:\/\/)?(?:[^\.]+\.)?$', 'self']);
    $sceDelegateProvider.resourceUrlWhitelist(['.*', 'self']);
  });

  treemodule.controller("treeCtrl", ["$scope", 'webSocket', 'contextService', 'PDFViewerService', 'caliopewebTemplateSrv', 'taskService', 'toolservices'

    ,function($scope, webSocket, contextService, pdf, ctempSrv, taskService, tool) {
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

          var METHOD     = "form.getHistory";
          var PARAMS     = {uuid: $scope.data[number].uuid};
          var USERLOAD   = taskService.getSerpublic;
          var USER       = [];
          var TAGS       = [];
          $scope.history = [];

          var itemhistory  = function (histobj){
                var exist = false;

                var datenew = new Date(histobj.changed.timestamp);
                histobj.datess = datenew.getTime();

                angular.forEach(USERLOAD, function(vInfo) {
                  if (vInfo.uuid === histobj.change_info){
                    histobj.change_info = vInfo;
                    exist = true;
                  }
                });

                if(!exist){
                  USER.push(histobj.change_info);
                }

                delete histobj.changed.timestamp;
                delete histobj.changed.uuid;
                return histobj;
          };


          var recurHistory = function (element, name){
            var patt1 = '[a-f0-9]{8}-?[a-f0-9]{4}-?4[a-f0-9]{3}-?[89ab][a-f0-9]{3}-?[a-f0-9]{12}';
            var reg   = new RegExp(patt1);
            if(name.match(reg)){
              var data  = itemhistory(element);
              data.tags = angular.copy(TAGS);
              angular.forEach(data, function(vdata, kdata){
                if(tool.isEmtpy(vdata)){
                  delete data[kdata];
                }
              });
              $scope.history.push(data);
            }else{
              switch(TAGS.length){
                case 0:
                  TAGS.push({name: name, label: 'inverse'});
                  break;
                case 1:
                  TAGS.push({name: name, label: 'important'});
                  break;
                case 2:
                  TAGS.push({name: name, label: 'success'});
                  break;
                case 3:
                  TAGS.push({name: name, label: 'warning'});
                  break;
                default:
                  TAGS.push({name: name, label: 'info'});
              }

              angular.forEach(element, function(velement, kelement) {
                if(!angular.isUndefined(velement.change_info)){
                  recurHistory(velement, kelement);
                }else{
                  angular.forEach(velement, function(vItem, kItem) {
                    recurHistory(vItem, kItem);
                  });
                  TAGS.pop();
                }
              });
              TAGS.pop();
            }
          };

          WEBSOCKETS.serversimm.sendRequest(METHOD, PARAMS).then(function(responseContexts){
            if(!angular.isUndefined(responseContexts)){

              angular.forEach(responseContexts, function(vResp, kResp) {
                recurHistory(vResp, kResp);
              });


              if(USER.length > 0){
                ctempSrv.loadData('accounts.getPublicInfo',[USER]).then(function(returnuser){
                angular.forEach(responseContexts, function(vResp2, kResp2) {
                    angular.forEach(returnuser, function(vRetuser) {
                      if (vRetuser.uuid === vResp2.change_info){
                          responseContexts[kResp2].change_info = vRetuser;
                          taskService.setSerpublic(vRetuser);
                      }
                    });
                  });
                });
              }

              $scope.itemattach = 'hist';
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
            var patt1;
            var patt2;
            var re;
            var mime       = obform.attachments[index].mime;
            var filesmime  = ['text', 'image', 'pdf'];
            var filteratta;
            for (i = 0; i < filesmime.length; i++){
              patt1      = "[^\n]*" + filesmime[i] + "/[^\n]*($|\n)";
              patt2      = "." + filesmime[i] + "$";
              re         = new RegExp(patt1);
              if(mime.match(re)){
                filteratta =  filesmime[i];
              }
              re         = new RegExp(patt2);
              if(mime.match(re)){
                filteratta =  filesmime[i];
                break;
              }
            }

            switch(filteratta) {
              case 'image':
                $scope.itemattach = 'image';
                $scope.imgdata    = serverFile + obform.attachments[index].id;
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
