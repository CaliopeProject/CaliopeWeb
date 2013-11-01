/*jslint browser: true*/
/*global define, console, $*/

define(['angular', 'application-constant', 'jquery.fileupload', 'login-security-services'], function (angular, $caliope_constant) {
  'use strict';

var dirmodule = angular.module('fileuploaderDirectives', ['login-security-services']);

dirmodule.directive('ngFileuploader', ['SessionSrv', function(security) {
    return {
        templateUrl: 'tools-files-uploader/files-uploader-directives.html',
        replace: true,
        restrict: 'E',
        scope: {
            filename: '=ngModel'
        },

        link: function(scope, elm, attrs) {
            var nid = 'progres' + Math.floor((Math.random()*100)+1);
            $(elm).find('#progress').attr('id', nid);
            $(elm).fileupload({
                method : 'POST',
                url     : $caliope_constant.hyperion_server_address ,
                dataType: 'json',
                paramName: 'files[]',
                sequentialUploads: true,
                formData : {
                   id: 'parent',//attrs['formuuid'],
                   session_uuid: security.getIdSession()
                  //field: attrs['fieldattch']
                },
                //TODO: to check
                //https://github.com/blueimp/jQuery-File-Upload/wiki/Options
                add: function (e, data) {
                    scope.$apply(function() {
                        $('#progress .bar').css(
                                'width','0%'
                        );
                    });
                  data.submit();
                },
                progress: function(e, data) {
                    var progress = parseInt(data.loaded / data.total * 100, 10);
                },
                progressall: function(e, data) {
                    var progress = parseInt(data.loaded / data.total * 100, 10);

                    scope.$apply(function() {
                        $('#' + nid +' .bar').css(
                                'width',
                                progress + '%'
                        );
                    });
                },

                done: function(e, data) {
                    var i;
                    var filelist = scope.filelist;
                    if (filelist === undefined){
                        filelist = [];
                    }
                    for (i = 0; i < data.result.length; i++) {
                        filelist.push(data.result[i]);
                    }

                    scope.filelist = filelist;
                    scope.$apply();
                }
            });
        }

    };
}]);

});
