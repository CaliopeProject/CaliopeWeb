require.config({
  paths: {    
    jquery                           : 'libs-js-thirdparty/jquery/jquery',
    dform                            : 'libs-js-thirdparty/jquery.dform/dist/jquery.dform-1.1.0',
    angular                          : 'libs-js-thirdparty/angular-unstable/angular',
    uuid                             : 'libs-js-thirdparty/uuid-js/lib/uuid',
    Crypto                           : 'libs-js-thirdparty/cryptojs/lib/Crypto',    
    CryptoSHA256                     : 'libs-js-thirdparty/cryptojs/lib/SHA256',    
    'application-app'                : 'application/application-app',
    'application-servicesWebSocket'  : 'application/application-servicesWebSocket',
    'application-controller'         : 'application/application-controller',
    'application-routes'             : 'application/application-routes',
    'caliopeweb-templateServices'    : 'caliopeweb-forms/caliopeweb-template-services',    
    'caliopeweb-templateControllers' : 'caliopeweb-forms/caliopeweb-template-controllers',
    'caliopeweb-formDirectives'      : 'caliopeweb-forms/caliopeweb-form-directives',
    'proyectosmtv-controller'        : 'proyectosmtv/proyectomtv-controller',
    'proyectosmtv-service'           : 'proyectosmtv/proyectomtv-service',
    'login-services'                 : 'login/login-services',
    'login-controllers'              : 'login/login-controllers',    
    'application-routes'             : 'application/application-routes'
  },
  baseUrl: '/',
  shim: {
    'jquery'                         : {'exports' : 'jquery'},
    'jquery'                         : {'exports' : 'jQuery'},
    'angular'                        : {'exports' : 'angular'},
    'application-app'                : {'exports' : 'app'},
    'application-servicesWebSocket'  : {'exports' : 'webSocket'},
    'application-routes'             : {'exports' : 'routes'},    
    'application-controller'         : {'exports' : 'appcontroller'},    
    'angularMocks'                   : {deps      : ['angular'], 'exports' : 'angular.mock'}
  },
  priority: [
    "angular"
  ]
});

require([
  'jquery',
  'dform',
  'Crypto',  
  'CryptoSHA256',
  'angular',   
  'application-app',
  'application-routes'
], function($, dform, crypto, CryptoSHA256, angular, app, routes) {
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
