define(['angular', 'application-app'], function(angular, app) {
  'use strict';
  
  return app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view1', {
      templateUrl: '/application/view-partial1.html'    });
    $routeProvider.when('/view2', {
      templateUrl: '/application/view-partial2.html'    });
    $routeProvider.when('/proyectomtv/:plantilla/:mode', {
      templateUrl: '/proyectosmtv/proyecto-form.html'});
    $routeProvider.when('/login/:plantilla/:mode', {
      templateUrl: '/login/login-partial.html'});    
    //$routeProvider.otherwise({redirectTo: '/view1'});
  }]);

});
