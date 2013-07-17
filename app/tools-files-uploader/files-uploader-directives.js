/*jslint browser: true*/
/*global define, console, $*/

define(['angular','jquery.fileupload'], function (angular) {
  'use strict';  
  
var dirmodule = angular.module('fileuploaderDirectives', []);

dirmodule.directive('myDirective', function() {
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

                progressall: function(e, data) {
                    var progress = parseInt(data.loaded / data.total * 100, 10);
                    scope.$apply(function() {
                        scope.progress = progress;
                    });

                },

                done: function(e, data) {

                    $.each(data.result, function(index, file) {
                        scope.$apply(function() {
                            scope.filename = file.name;
                        });
                    })

                }
            });
        }

    }
});

  
});

