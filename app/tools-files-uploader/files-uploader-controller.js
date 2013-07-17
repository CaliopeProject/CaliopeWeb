/*jslint browser: true*/
/*global define, console, $*/

define(['angular','jquery.fileupload'], function (angular) {
  'use strict';  
  
var dirmodule = angular.module('fileuploaderCtrl', []);

dirmodule.controller("fileuploaderCtrl", function($scope) {
    $scope.myModel = {};
});
  
});

