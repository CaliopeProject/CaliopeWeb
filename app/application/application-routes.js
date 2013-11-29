/*jslint browser: true*/
/*global define, window*/
define(['angular', 'application-app'], function(angular, app) {
  'use strict';

  var ERROR_FORMTEMP_NOTFOUND = "FormTemplateNotFoundError";
  var ERROR_FORMTEMP_NOTLOADED  = "FormTemplateNotLoadedError";
  var PAGE_GENERIC_PARTIAL = '/caliopeweb-forms/caliopeweb-form-generic-partial.html';

  var pagesRoute = {
    'projects'                 : '/proyectomtv/form-proyectomtv-partial.html'
  };

  var loadedForms = false;

  /**
   * Load the forms defined in server to pagesRoutes.
   */
  app.run(['$rootScope', '$timeout', 'webSocket', function($rootScope, $timeout, webSocket) {

    $rootScope.$on('openWebSocket', function(event) {
      var method = "form.getForms";
      var params = {};
      webSocket.WebSockets().serversimm.sendRequest(method, params).then( function processLoadForms(result) {
        angular.forEach(result, function(vForm, kForm) {
          if( !pagesRoute.hasOwnProperty(vForm.formId) ) {
            pagesRoute[vForm.formId] = PAGE_GENERIC_PARTIAL;
          }
        });
        loadedForms = true;
      });
    });

  }]);

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

        if( loadedForms === false ) {
          var error = new Error("Forms no loaded ");
          error.name = ERROR_FORMTEMP_NOTLOADED;
          throw error;
        } else {
          if( pagesRoute.hasOwnProperty(routeParams.entity) === false ) {
            var error = new Error("No route page find in configuration for entity " + routeParams.entity);
            error.name = ERROR_FORMTEMP_NOTFOUND;
            throw error;
          }

          return pagesRoute[routeParams.entity];
        }
      }
    })

    .when('/adminUser', {
      templateUrl: 'admin-users/admin-users-partial.html'})

    .when('/summary-proyectomtv', {
      templateUrl: '/proyectomtv/proyectomtv-summary-partial.html'
      ,controller: 'summaryProyectoCtrl'})

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

  app.run(['$rootScope','$route', '$timeout', '$location', function($rootScope, $route, $timeout, $location) {
    $rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {
      if( rejection !== undefined && rejection.name === ERROR_FORMTEMP_NOTFOUND ) {
        window.history.back();
      }
      var attempts = 0;
      var MAXATTEMPTS = 5;


      function reload() {
        attempts++;
        if( attempts >= MAXATTEMPTS ) {
          window.history.back();
        }
        if( loadedForms === false) {
          var promiseTO = $timeout(function() {
            reload();
          },200);
        } else {
          if (promiseTO !== undefined) {
            $timeout.cancel(promiseTO);
          }
          $location.path($location.$$path + "/");
        }
      }

      if( rejection !== undefined && rejection.name === ERROR_FORMTEMP_NOTLOADED ) {
        reload();
      }

    });
  }]);

});

