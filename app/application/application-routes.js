define(['angular', 'application-app'], function(angular, app) {
  'use strict';

  var pagesRoute = {
    'projects' : '/proyectomtv/form-proyectomtv-partial.html',
    'predialcards' : '/caliopeweb-forms/caliopeweb-form-partial.html'
  }


  return app.config(['$routeProvider',
    function($routeProvider) {

    $routeProvider.when('/task', {
      templateUrl: '/task/partial-task-init.html'});
    $routeProvider.when('/view2', {
      templateUrl: '/application/view-partial2.html'    });

    /*
      Routes for projectmtv
    */
    $routeProvider.when('/list-proyectomtv', {
      templateUrl: '/proyectomtv/list-proyectomtv-partial.html'});

    $routeProvider.when('/form-proyectomtv/:entity/:mode', {
      templateUrl: '/proyectomtv/form-proyectomtv-partial.html'});

    $routeProvider.when('/form-generic/:entity/:mode/:uuid', {
      templateUrl: '/caliopeweb-forms/caliopeweb-form-partial.html'});

    $routeProvider.when('/form/:entity/:mode/:uuid',{
      templateUrl : function(routeParams) {
          console.log('/form/:entity/:mode/:uuid', routeParams);
          if( pagesRoute.hasOwnProperty(routeParams.entity) == false ) {
            throw new Error('No route page find in configuration for entity ' + routeParams.entity);
          }
          return pagesRoute[routeParams.entity]
        }
      }
    );
    $routeProvider.when('/summary-proyectomtv', {
      templateUrl: '/proyectomtv/proyectomtv-summary-partial.html'}); 

    $routeProvider.when('/gis', {
      templateUrl: '/tools-gis-viewer/partial-gis-init.html'});
    $routeProvider.when('/login/:entity/:mode', {
      templateUrl: '/login/login-partial.html'});
    $routeProvider.when('/kanban', {
      templateUrl: 'tools-kanban-board/kanban-board-partial.html'});
    $routeProvider.when('/caliopeweb-forms/:entity/:mode', {
      templateUrl: '/caliopeweb-forms/caliopeweb-form-partial.html'});
    $routeProvider.when('/caliopeweb-forms/:entity/:mode/:uuid', {
      templateUrl: '/caliopeweb-forms/caliopeweb-form-partial.html'});
    $routeProvider.when('/tools/upload/files', {
      templateUrl: '/tools-files-uploader/files-uploader-partial.html'});
    $routeProvider.when('/caliopeweb-grids/:entity', {
      templateUrl: '/caliopeweb-forms/caliopeweb-grid-partial.html'});
    $routeProvider.when('/tools/wysihtml5-editor', {
      templateUrl: 'tools-wysiwyg-editor/wysiwyg-editor-partial.html'});
  }]);

});

