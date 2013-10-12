/*jslint browser: true*/
/*global define, console, $*/

define(['angular'], function (angular) {
  'use strict';

  var App = angular.module('read-rss-controllers', ['read-rss-services']);

  App.controller("reedControllers", ['$scope','reedService', function ($scope, Feed) {
    Feed.parseFeed('http://www.metrovivienda.gov.co/index.php?format=feed&type=rss').then(function(res){
      $scope.feeds1=res.data.responseData.feed.entries;
    });
    Feed.parseFeed('http://www.correlibre.org/co/index.php?format=feed&type=rss').then(function(res){
      $scope.feeds2=res.data.responseData.feed.entries;
    });
  }]);
});
