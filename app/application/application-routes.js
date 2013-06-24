define(['angular', 'application-app'], function(angular, app) {
  'use strict';

  return app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view1', {
      templateUrl: '/app/partials/partial1.html'    });
    $routeProvider.when('/view2', {
      templateUrl: '/app/partials/partial2.html'    });
    $routeProvider.when('/proyectomtv/:plantilla/:mode', {
      templateUrl: '/proyectosmtv/proyecto-form.html'});   
    $routeProvider.otherwise({redirectTo: '/view1'});
  }]);

});
