require.config({
  paths: {
    jquery                           : 'libs-js-thirdparty/jquery/jquery',
    angular                          : 'libs-js-thirdparty/angular-unstable/angular',
    'application-app'                : 'application/application-app',
    'application-servicesWebSocket'  : 'application/application-servicesWebSocket',
    'application-routes'             : 'application/application-routes'
  },
  baseUrl: '/',
  shim: {
    'angular'                        : {'exports' : 'angular'},
    'application-app'                : {'exports' : 'app'},
    'application-routes'             : {'exports' : 'routes'},
    'application-servicesWebSocket'  : {'exports' : 'webSocket'},
    'angularMocks'                   : {deps      : ['angular'], 'exports' : 'angular.mock'}
  },
  priority: [
    "angular"
  ]
});

require([
  'jquery',
  'angular',
  'application-app',
  'application-routes'
], function($, angular, app, routes) {
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
