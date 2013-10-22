define(['angular'], function (angular) {
  angular.module('httpRequestTrackerService', []);
  angular.module('httpRequestTrackerService').factory('httpRequestTrackerService', ['$http', function($http){

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
