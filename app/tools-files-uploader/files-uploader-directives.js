/*jslint browser: true*/
/*global define, console, $*/

define(['angular','jquery.fileupload'], function (angular) {
  'use strict';  
  
var dirmodule = angular.module('fileuploaderDirectives', []);

dirmodule.directive('ngFileuploader', function() {
    return {
        templateUrl: 'tools-files-uploader/files-uploader-directives.html',
        replace: true,
        restrict: 'E',
        scope: {
            filename: '=ngModel'
        },

        link: function(scope, elm, attrs) {

            $(elm).fileupload({
                dataType: 'json',
                paramName: 'files[]',
                sequentialUploads: true,
                formData : {id:'12212'},

                //TODO: to check
                //          https://github.com/blueimp/jQuery-File-Upload/wiki/Options    
                add: function (e, data) {
                    //TODO: show preview 
                    //console.log(data);
                    data.submit();
                },
                
                progressall: function(e, data) {
                    var progress = parseInt(data.loaded / data.total * 100, 10);
                    //console.log(data.bitrate/1024+"k/s");
                    scope.$apply(function() {
                        $('#progress .bar').css(
                                'width',
                                progress + '%'
                        );
                    });

                },

                done: function(e, data) {
                    var filelist = scope.filelist;
                    if (filelist === undefined) 
                        filelist = [];

                    for (var i = 0; i < data.result.length; i++) {
                        filelist.push(data.result[i]);
                    }

                    scope.filelist = filelist;
                }
            });
        }

    }
});

  
});

