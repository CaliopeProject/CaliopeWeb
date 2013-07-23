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
                url     : '/upload/',
                dataType: 'json',
                paramName: 'files[]',
                sequentialUploads: true,
                formData : {
                  id: attrs['formuuid'],
                  field: attrs['fieldattch']
                },
                progressall: function(e, data) {
                    var progress = parseInt(data.loaded / data.total * 100, 10);
                    scope.$apply(function() {
                        //scope.progress = progress;
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
                    scope.$apply();
                }
            });
        }

    }
});

  
});

