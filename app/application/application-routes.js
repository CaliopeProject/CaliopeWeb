define(['angular', 'application-app'], function(angular, app) {
  'use strict';

  var ERROR_FORMTEMP_NOTFOUND = "FormTemplateNotFoundError";

  var pagesRoute = {
    'projects' : '/proyectomtv/form-proyectomtv-partial.html',
    'predialcards' : '/caliopeweb-forms/caliopeweb-form-partial.html',
    'FichaPredial' : '/caliopeweb-forms/caliopeweb-form-generic-partial.html',
    'ActaReciboPredios' : '/caliopeweb-forms/caliopeweb-form-generic-partial.html',
    'AplicacionTraslado' : '/caliopeweb-forms/caliopeweb-form-generic-partial.html',
    'ChequeoTrasladoProvision' : '/caliopeweb-forms/caliopeweb-form-generic-partial.html',
    'DerechoPreferencia' : '/caliopeweb-forms/caliopeweb-form-generic-partial.html',
    'FichaCatastral' : '/caliopeweb-forms/caliopeweb-form-generic-partial.html',
    'FichaPrejuridica' : '/caliopeweb-forms/caliopeweb-form-generic-partial.html',
    'FichaUrbanistica' : '/caliopeweb-forms/caliopeweb-form-generic-partial.html',
    'ViabilidadNormativa' : '/caliopeweb-forms/caliopeweb-form-generic-partial.html',
    'ConceptoViabilidad' : '/caliopeweb-forms/caliopeweb-form-generic-partial.html',
    'EvaluacionProducto' : '/caliopeweb-forms/caliopeweb-form-generic-partial.html',
    'ControlAjustes' : '/caliopeweb-forms/caliopeweb-form-generic-partial.html'
  };

  app.config(['$routeProvider','$locationProvider'
    ,function($routeProvider, $locationProvider, loginSecurity) {
    /*
      Routes for task and kanban
     */
    $routeProvider.when('/task', {
      templateUrl: '/task/partial-task-init.html'});
    /*
      Routes for projectmtv
    */
    $routeProvider.when('/list-proyectomtv', {
      templateUrl: '/proyectomtv/list-proyectomtv-partial.html'});

    $routeProvider.when('/form-proyectomtv/:entity/:mode', {
      templateUrl: '/proyectomtv/form-proyectomtv-partial.html'});

    /*
    Route for generic form
     */
    $routeProvider.when('/form-generic/:entity/:mode/:uuid', {
      templateUrl: '/caliopeweb-forms/caliopeweb-form-generic-partial.html'});

     /*
    Route for generic form based in VersionedNode
     */
    $routeProvider.when('/siim2_forms/:entity/:mode/:uuid', {
      templateUrl: '/caliopeweb-forms/siim2-form-generic-partial.html'});


    /*
      Dynamic route
     */
    $routeProvider.when('/form/:entity/:mode/:uuid',{
      templateUrl : function(routeParams) {
        console.log('/form/:entity/:mode/:uuid', routeParams);
        if( pagesRoute.hasOwnProperty(routeParams.entity) === false ) {
          var error = new Error("No route page find in configuration for entity " + routeParams.entity);
          error.name = ERROR_FORMTEMP_NOTFOUND;
          throw error;
        }
        return pagesRoute[routeParams.entity];
      }
    })

    .when('/summary-proyectomtv', {
      templateUrl: '/proyectomtv/proyectomtv-summary-partial.html'})

    .when('/gis', {
      templateUrl: '/tools-gis-viewer/partial-gis-init.html'})

    .when('/admin-users', {
      templateUrl :function(routeParams, $rootScope) {
        console.log('$rootScope', $rootScope);
        loginSecurity.havePermission(routeParams.entity).then(
          function(data) {
            console.log('/form/:entity/:mode/:uuid', routeParams);
            if( data === false ) {
              throw new Error("No route page find in configuration for entity " + routeParams.entity);
            }
            return '/admin-users/admin-users-partial.html';
          });
      }
    })

    .when('/login/:entity/:mode', {
      templateUrl: '/login/login-partial.html'})

    .when('/', {
      templateUrl: 'tools-kanban-board/kanban-board-partial.html'})

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
    .otherwise({redirectTo: '/'});
  }]);

  app.run(['$route', angular.noop]);

  app.run(['$rootScope','$route',function($rootScope, $route) {
    $rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {
      if( rejection !== undefined && rejection.name === ERROR_FORMTEMP_NOTFOUND ) {
        window.history.back()
      }
    });

  }]);

});

