/*jslint browser: true*/
/*global define, console, $*/

define(['angular','files-uploader-directives'], function (angular) {
  'use strict';

var dirmodule = angular.module('fileuploaderCtrl', ['fileuploaderDirectives']);

dirmodule.controller("fileuploaderCtrl", function($scope){
    $scope.myModel = {};
});

});

