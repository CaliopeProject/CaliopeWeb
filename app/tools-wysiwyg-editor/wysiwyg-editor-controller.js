/*jslint browser: true*/
/*global define, console, $*/

define(['angular','ckeditor'], function (angular) {
  'use strict';  
  
var dirmodule = angular.module('wysiwygEditorCtrl', []);

dirmodule.controller("wysiwygEditorCtrl", function($scope) {
    $scope.myModel = {};
});
  
});

