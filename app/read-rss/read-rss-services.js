/*jslint browser: true*/
/*global define, console, $*/

define(['angular'], function (angular) {
  'use strict';
  var App = angular.module('read-rss-services', []);

  App.factory('reedService',['$http',function($http){
    return {
      parseFeed : function(url){
        return $http.jsonp('//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=6&callback=JSON_CALLBACK&q=' + encodeURIComponent(url));
      }
    };
  }]);
});
