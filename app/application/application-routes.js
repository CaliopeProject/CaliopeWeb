define(['angular', 'application-app'], function(angular, app) {
  'use strict';

  return app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view1', {
      templateUrl: '/application/view-partial1.html'    });
    $routeProvider.when('/view2', {
      templateUrl: '/application/view-partial2.html'    });
    $routeProvider.when('/proyectomtv/:plantilla/:mode', {
      templateUrl: '/proyectosmtv/proyecto-form.html'});
    $routeProvider.when('/gis', {
      templateUrl: '/tools-gis-viewer/gis-partial.html'});
    $routeProvider.when('/login/:plantilla/:mode', {
      templateUrl: '/login/login-partial.html'});
    $routeProvider.when('/caliopeweb-forms/:plantilla/:mode', {
      templateUrl: '/caliopeweb-forms/caliopeweb-form-partial.html'});        
    $routeProvider.when('/tools/upload/files', {
      templateUrl: '/tools-files-uploader/files-uploader-partial.html'});
    $routeProvider.when('/tools/wysihtml5-editor', {
      templateUrl: 'tools-wysihtml5-editor/wysihtml5-editor-partial.html'});    
    
    
    //$routeProvider.otherwise({redirectTo: '/view1'});
  }]);

});

