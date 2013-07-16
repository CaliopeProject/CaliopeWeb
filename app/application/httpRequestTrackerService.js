define(['angular'], function (angular) {
  angular.module('httpRequestTrackerService', []);
  angular.module('httpRequestTrackerService').factory('httpRequestTrackerService', ['$http', function($http){

    var httpRequestTracker = {};
    httpRequestTracker.hasPendingRequests = function() {
      return $http.pendingRequests.length > 0;
    };

    return httpRequestTracker;

  }]);
});
