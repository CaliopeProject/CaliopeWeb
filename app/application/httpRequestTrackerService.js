define(['angular', 'application-servicesWebSocket'], function (angular, webSocket) {
  angular.module('httpRequestTrackerService', []);
  angular.module('httpRequestTrackerService').factory('httpRequestTrackerService', ['$http', 'webSocket', function($http, webSocket){

    var httpRequestTracker = {};
    var firstEvent = false;

    hasPending = function() {
      firstEvent = true;
      return $http.pendingRequests.length > 0;
    };

    return {
      first:firstEvent,
      hasPendingRequests : hasPending
    };

  }]);
});
