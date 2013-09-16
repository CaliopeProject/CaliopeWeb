define(['angular', 'application-app'], function(angular, app) {
  'use strict';

  return app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/task', {
      templateUrl: '/task/partial-task-init.html'});
    $routeProvider.when('/view2', {
      templateUrl: '/application/view-partial2.html'    });

    /*
      Routes for projectmtv
    */
    $routeProvider.when('/list-proyectomtv', {
      templateUrl: '/proyectomtv/list-proyectomtv-partial.html'});
    $routeProvider.when('/form-proyectomtv/:plantilla/:mode', {
      templateUrl: '/proyectomtv/form-proyectomtv-partial.html'});
    $routeProvider.when('/summary-proyectomtv', { 
      templateUrl: '/proyectomtv/proyectomtv-summary-partial.html'}); 
    $routeProvider.when('/gis', {
      templateUrl: '/tools-gis-viewer/partial-gis-init.html'});
    $routeProvider.when('/login/:plantilla/:mode', {
      templateUrl: '/login/login-partial.html'});
    $routeProvider.when('/kanban', {
      templateUrl: 'tools-kanban-board/kanban-board-partial.html'});
    $routeProvider.when('/caliopeweb-forms/:plantilla/:mode', {
      templateUrl: '/caliopeweb-forms/caliopeweb-form-partial.html'});
    $routeProvider.when('/caliopeweb-forms/:plantilla/:mode/:uuid', {
      templateUrl: '/caliopeweb-forms/caliopeweb-form-partial.html'});
    $routeProvider.when('/tools/upload/files', {
      templateUrl: '/tools-files-uploader/files-uploader-partial.html'});
    $routeProvider.when('/caliopeweb-grids/:plantilla', {
      templateUrl: '/caliopeweb-forms/caliopeweb-grid-partial.html'});
    $routeProvider.when('/tools/wysihtml5-editor', {
      templateUrl: 'tools-wysiwyg-editor/wysiwyg-editor-partial.html'});
  }]);

});

