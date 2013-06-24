require.config({
  paths: {    
    jquery                           : 'libs-js-thirdparty/jquery/jquery',
    dform                            : 'libs-js-thirdparty/jquery.dform/src/dform',
    angular                          : 'libs-js-thirdparty/angular-unstable/angular',    
    'application-app'                : 'application/application-app',
    'application-servicesWebSocket'  : 'application/application-servicesWebSocket',
    'application-routes'             : 'application/application-routes',
    'caliopeweb-templateServices'    : 'caliopeweb-forms/caliopeweb-template-services',    
    'caliopeweb-templateControllers' : 'caliopeweb-forms/caliopeweb-template-controllers',
    'caliopeweb-formDirectives'      : 'caliopeweb-forms/caliopeweb-form-directives',
    'proyectosmtv-controller'        : 'proyectosmtv/proyectomtv-controller'
  },
  baseUrl: '/',
  shim: {
    'angular'                        : {'exports' : 'angular'},
    'application-app'                : {'exports' : 'app'},
    'application-routes'             : {'exports' : 'routes'},
    'application-servicesWebSocket'  : {'exports' : 'webSocket'},
    'caliopeweb-templateServices'    : {'exports' : 'caliopeweb-templateServices'},
    'caliopeweb-formDirectives'      : {'exports' : 'caliopeweb-formDirectives'},
    'caliopeweb-templateControllers' : {'exports' : 'caliopeweb-templateControllers'},
    'proyectosmtv-controller'        : {'exports' : 'proyectosmtv-controller'},
    'angularMocks'                   : {deps      : ['angular'], 'exports' : 'angular.mock'}
  },
  priority: [
    "angular"
  ]
});

require([
  'jquery',
  'dform',
  'angular',   
  'application-app',
  'application-routes'
], function($, $dForm, angular, app, routes) {
  'use strict';

  $(document).ready(function () {

    var $html = $('html');
    angular.bootstrap($html, [app['name']]);
    // Because of RequireJS we need to bootstrap the app app manually
    // and Angular Scenario runner won't be able to communicate with our app
    // unless we explicitely mark the container as app holder
    // More info: https://groups.google.com/forum/#!msg/angular/yslVnZh9Yjk/MLi3VGXZLeMJ
    $html.addClass('ng-app');
  });
});
