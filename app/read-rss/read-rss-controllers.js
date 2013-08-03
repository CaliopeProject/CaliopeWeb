/*jslint browser: true*/
/*global define, console, $*/

define(['angular'], function (angular) {
  'use strict';

  var App = angular.module('read-rss-controllers', []);

  App.controller("reedControllers", ['$scope','FeedService', function ($scope,Feed) {
    $scope.loadButonText="Load";
    $scope.loadFeed=function(e){
      Feed.parseFeed($scope.feedSrc).then(function(res){
        $scope.loadButonText=angular.element(e.target).text();
        $scope.feeds=res.data.responseData.feed.entries;
      });
    };
  }]);

});
