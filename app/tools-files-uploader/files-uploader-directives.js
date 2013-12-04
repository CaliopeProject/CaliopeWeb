/*jslint browser: true*/
/*global define, console, $*/

define(['angular', 'application-constant', 'jquery.fileupload', 'login-security-services'],
  function (angular, $caliope_constant) {
    'use strict';

    var dirmodule = angular.module('fileuploaderDirectives',
        ['login-security-services', 'CaliopeWebTemplatesServices']);

    dirmodule.directive('ngFileuploader', ['SessionSrv', 'caliopewebTemplateSrv',
      function(security, cwFormService) {
        return {
            templateUrl: 'tools-files-uploader/files-uploader-directives.html',
            replace: true,
            restrict: 'E',
            scope: {
                filename: '=ngModel'
            },

            link: function($scope, $element, $attrs) {


              var scopeData = $element.scope().$parent;
              if( scopeData !== undefined ) {

                var uuidsFiles = [];
                angular.forEach(scopeData[$attrs.name], function(vAttachment, kAttachment){
                  uuidsFiles.push(kAttachment);
                });

                //$scope.filelist = scopeData[$attrs.name];
                if( uuidsFiles.length > 0 ) {
                  cwFormService.loadAttachments(uuidsFiles).then( function(attachements) {
                        $scope.filelist = attachements;
                      }
                  );
                }
              }

              $scope.deleteFile = function(data) {

                if( data.hasOwnProperty('id') ) {
                  var promise = cwFormService.deleteAttachment(scopeData.modelUUID, data.id);
                  if( promise !== undefined ) {
                    promise.then( function (responseDelete) {
                      if( !responseDelete.hasOwnProperty('error') ) {
                        var index = $scope.filelist.indexOf(data);
                        if( index > 0 ) {
                          $scope.filelist.splice(index,1)
                        }
                      }
                    });
                  }
                }

              };


              var nid = 'progres' + Math.floor((Math.random()*100)+1);
              $($element).find('#progress').attr('id', nid);
              $($element).fileupload({
                  method : 'POST',
                  url     : $caliope_constant.hyperion_server_address ,
                  dataType: 'json',
                  paramName: 'files[]',
                  sequentialUploads: true,
                  formData : {
                     uuid         : $attrs.modeluuid,
                     session_uuid : security.getIdSession(),
                     field        : $attrs.fieldattch
                  },
                  //TODO: to check
                  add: function (e, data) {
                      $scope.$apply(function() {
                          $('#progress .bar').css(
                                  'width','0%'
                          );
                      });
                    data.submit();
                  },
                  progress: function(e, data) {

                  },
                  progressall: function(e, data) {
                      var progress = parseInt(data.loaded / data.total * 100, 10);

                      $scope.$apply(function() {
                          $('#' + nid +' .bar').css(
                                  'width',
                                  progress + '%'
                          );
                      });
                  },

                  done: function(e, data) {
                      var i;
                      var filelist = $scope.filelist;
                      if (filelist === undefined ){
                          filelist = [];
                      }
                      for (i = 0; i < data.result.length; i++) {
                          filelist.push(data.result[i]);
                      }

                      $scope.filelist = filelist;
                      $scope.$apply();
                  }
              });
            }

        };
    }]);

});
