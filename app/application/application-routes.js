define(['application-app'], function(app) {
  'use strict';

  return app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view1', {
      templateUrl: '/application/view-partial1.html'    });
    $routeProvider.when('/view2', {
      templateUrl: '/application/view-partial2.html'    });
    $routeProvider.otherwise({redirectTo: '/view1'});
  }]);

});
