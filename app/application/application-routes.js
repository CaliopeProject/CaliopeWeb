define(['angular', 'application-app'], function(angular, app) {
  'use strict';

  var pagesRoute = {
    'projects' : '/proyectomtv/form-proyectomtv-partial.html',
    'predialcards' : '/caliopeweb-forms/caliopeweb-form-partial.html'
  };

  app.config(['$routeProvider',
    function($routeProvider) {
    $routeProvider.when('/task', {
      templateUrl: '/task/partial-task-init.html'})
    .when('/view2', {
      templateUrl: '/application/view-partial2.html'})
    .when('/list-proyectomtv', {
      templateUrl: '/proyectomtv/list-proyectomtv-partial.html'})
    .when('/form-proyectomtv/:entity/:mode', {
      templateUrl: '/proyectomtv/form-proyectomtv-partial.html'})
    .when('/form-generic/:entity/:mode/:uuid', {
      templateUrl: '/caliopeweb-forms/caliopeweb-form-partial.html'})
    .when('/form/:entity/:mode/:uuid',{
      templateUrl : function(routeParams) {
        console.log('/form/:entity/:mode/:uuid', routeParams);
        if( pagesRoute.hasOwnProperty(routeParams.entity) === false ) {
          throw new Error('No route page find in configuration for entity ' + routeParams.entity);
        }
        return pagesRoute[routeParams.entity];
      }
    })
    .when('/summary-proyectomtv', {
      templateUrl: '/proyectomtv/proyectomtv-summary-partial.html'})
    .when('/gis', {
      templateUrl: '/tools-gis-viewer/partial-gis-init.html'})
    .when('/login/:entity/:mode', {
      templateUrl: '/login/login-partial.html'})
    .when('/kanban', {
      templateUrl: 'tools-kanban-board/kanban-board-partial.html'})
    .when('/caliopeweb-forms/:entity/:mode', {
      templateUrl: '/caliopeweb-forms/caliopeweb-form-partial.html'})
    .when('/caliopeweb-forms/:entity/:mode/:uuid', {
      templateUrl: '/caliopeweb-forms/caliopeweb-form-partial.html'})
    .when('/tools/upload/files', {
      templateUrl: '/tools-files-uploader/files-uploader-partial.html'})
    .when('/caliopeweb-grids/:entity', {
      templateUrl: '/caliopeweb-forms/caliopeweb-grid-partial.html'})
    .when('/tools/wysihtml5-editor', {
      templateUrl: 'tools-wysiwyg-editor/wysiwyg-editor-partial.html'})
    .otherwise({redirectTo: '/kanban'});
  }]);

});

