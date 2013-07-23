define(['angular', 'application-servicesWebSocket'], function (angular, webSocket) {
  angular.module('httpRequestTrackerService', []);
  angular.module('httpRequestTrackerService').factory('httpRequestTrackerService', ['$http', 'webSocket', function($http, webSocket){

    var httpRequestTracker = {};

    httpRequestTracker.hasPendingRequests = function() {
      return $http.pendingRequests.length > 0;
    };

    return httpRequestTracker;

  }]);
});
