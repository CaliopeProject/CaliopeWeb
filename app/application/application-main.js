/*jslint browser: true*/
/*global require, $*/

require.config({
  waitSeconds: 0,
  paths: {
    'jquery'                         : 'libs-js-thirdparty/jquery/jquery',
    'angular'                        : 'libs-js-thirdparty/angular-unstable/angular',
    'dform'                          : 'libs-js-thirdparty/jquery.dform/dist/jquery.dform-1.1.0',
    'onResourceLoad'                 : 'application/onResourceLoad',
    'angular-route-unstable'         : 'libs-js-thirdparty/angular-route-unstable/angular-route',
    'angular-ui-bootstrap-bower'     : 'libs-js-thirdparty/angular-ui-bootstrap-bower/ui-bootstrap-tpls',
    'angular-ui-ng-grid'             : 'libs-js-thirdparty/ng-grid/ng-grid-2.0.7.debug',
    'uuid'                           : 'libs-js-thirdparty/uuid-js/lib/uuid',
    'Crypto'                         : 'libs-js-thirdparty/cryptojs/lib/Crypto',
    'CryptoSHA256'                   : 'libs-js-thirdparty/cryptojs/lib/SHA256',

    'jquery-ui'                      : 'libs-js-thirdparty/jquery-ui/ui/jquery-ui',
    'angular-dragdrop'               : 'libs-js-thirdparty/angular-dragdrop/src/angular-dragdrop',

    'jquery.fileupload'              : 'libs-js-thirdparty/jquery-file-upload/js/jquery.fileupload',
    'jquery-ui-widget'               : 'libs-js-thirdparty/jquery-file-upload/js/vendor/jquery.ui.widget',

    'files-uploader-controller'      : 'tools-files-uploader/files-uploader-controller',
    'files-uploader-directives'      : 'tools-files-uploader/files-uploader-directives',

    'gis-layout'                     : 'tools-gis-viewer/Layout',
    'gis-options'                    : 'tools-gis-viewer/Options',
    'gis-init'                       : 'tools-gis-viewer/Init',
    'gis-view-ctrl'                  : 'tools-gis-viewer/gis-viewer-controller',
    'gis-directives'                 : 'tools-gis-viewer/gis-directives',
    'seeinmap-directives'            : 'tools-gis-viewer/seeinmap-directives',
    'seeinmap-services'              : 'tools-gis-viewer/seeinmap-services',
    'gis-ext-all'                    : 'libs-js-thirdparty/compiled-gis/ext-all',
    'gis-ext-base'                   : 'libs-js-thirdparty/compiled-gis/ext-base',
    'gis-heron'                      : 'libs-js-thirdparty/heron-mc/heron',
    'gis-geoext'                     : 'libs-js-thirdparty/compiled-gis/GeoExt',
    'gis-openlayers'                 : 'libs-js-thirdparty/compiled-gis/OpenLayers',

    'application-app'                : 'application/application-app',
    'application-servicesWebSocket'  : 'application/application-servicesWebSocket',
    'application-commonservices'     : 'application/application-commonservices',
    'application-controller'         : 'application/application-controller',
    'application-routes'             : 'application/application-routes',
    'notificationsService'           : 'application/notificationsService',
    'httpRequestTrackerService'      : 'application/httpRequestTrackerService',
    'breadcrumbsService'             : 'application/breadcrumbsService',
    'application-event'              : 'application/application-event',

    'caliopeWebForms'                : 'caliopeweb-forms/CaliopeWebForms',
    'caliopeWebGrids'                : 'caliopeweb-forms/CaliopeWebGrids',
    'caliopeweb-template-services'   : 'caliopeweb-forms/caliopeweb-template-services',
    'caliopeweb-templateControllers' : 'caliopeweb-forms/caliopeweb-template-controllers',
    'caliopeweb-formDirectives'      : 'caliopeweb-forms/caliopeweb-form-directives',

    'admin-users-controller'         : 'admin-users/admin-users-controller',

    'proyectomtv-controller'         : 'proyectomtv/proyectomtv-controller',
    'proyectomtv-summary-controller' : 'proyectomtv/proyectomtv-summary-controller',
    'proyectomtv-service'            : 'proyectomtv/proyectomtv-service',

    'login-security-services'        : 'login/login-security-services',
    'login-controllers'              : 'login/login-controllers',
    'login-controllers-form'         : 'login/login-controllers-form',
    'login-directives'               : 'login/login-directives',
    'login-retryQueue'               : 'login/login-retryQueue',

    'menu-top-controller'            : 'menu-top/menu-top-controllers',

    'menu-right-controller'          : 'menu-right/menu-right-controller',

    'ckeditor'                       : 'libs-js-thirdparty/ckeditor/ckeditor',
    'wysiwyg-editor-directive'       : 'tools-wysiwyg-editor/wysiwyg-editor-directive',
    'wysiwyg-editor-controller'      : 'tools-wysiwyg-editor/wysiwyg-editor-controller',

    'kanban-board-controller'        : 'tools-kanban-board/kanban-board-controller',
    'task-controllers'               : 'task/task-controllers',
    'task-services'                  : 'task/task-services',
    'task-directives'                : 'task/task-directives',

    'read-rss-services'              : 'read-rss/read-rss-services',
    'read-rss-controllers'           : 'read-rss/read-rss-controllers'
  },
  baseUrl: '/',
  shim: {
    'jquery'                      : {'exports' : 'jquery'}
    ,'angular'                    : {'exports' : 'angular'}
    ,'angular-ui-bootstrap-bower' : {'exports' : 'ui-bootstrap', 'deps' : ['angular']}
    ,'angular-route-unstable'     : {'deps'    : ['angular']}
    ,'application-app'            : {'exports' : 'app'}
    ,'caliopeWebForms'                : {'exports' : 'cwForm'}
    ,'angular-ui-ng-grid'             : {'exports' : 'ui-ng-grid', 'deps': ['jquery']}
    ,'application-controller'         : {'exports' : 'appcontroller'}
    ,'application-commonservices'     : {'exports' : 'appcommonservices'}
    ,'application-routes'             : {'exports' : 'routes'}
    ,'uuid'                           : {'exports' : 'UUIDjs'}
    ,'application-servicesWebSocket'  : {'exports' : 'webSocket', 'deps': ['notificationsService','uuid']}
    ,'notificationsService'           : {'deps'    : ['application-commonservices']}
    ,'jquery-ui'                      : {'deps'    : ['jquery']}
    ,'jquery.fileupload-angular'      : {'deps'    : ['jquery', 'angular', 'jquery.ui.widget']}

    ,'angular-dragdrop'               : {'deps'    : ['angular', 'jquery-ui']}
    ,'application-event'              : {'deps'    : ['jquery']}

    ,'CryptoSHA256'                   : {'deps'    : ['Crypto']}

    ,'wysiwyg-editor-directive'       : {'deps'    : ['jquery','angular','ckeditor']}

    ,'dform'                          : {'deps'      : ['jquery']}

    ,'gis-ext-all'                    : {'deps'      : ['gis-ext-base']}
    ,'gis-geoext'                     : {'deps'      : ['gis-ext-all','gis-openlayers']}
    ,'gis-init'                       : {'deps'      : ['gis-geoext','gis-ext-all']}
    ,'gis-heron'                      : {'deps'      : ['gis-init']}
    ,'gis-view-ctrl'                  : {'deps'      : ['gis-heron']}
    ,'seeinmap-services'              : {'deps'      : ['angular', 'jquery-ui']}

    ,'angularMocks'                   : {'deps'      : ['angular'], 'exports' : 'angular.mock'}
  },
  priority: [
     "onResourceLoad"
  ]
});


//show de
require(['onResourceLoad'], function () {
  require([
    'jquery'
    ,'angular'
    ,'application-app'
    ,'application-routes'
  ], function(jQuery, angular, app, routes) {
    'use strict';
    $(document).ready(function () {
      var $html = $('html');
      angular.bootstrap($html, [app.name]);
      // Because of RequireJS we need to bootstrap the app app manually
      // and Angular Scenario runner won't be able to communicate with our app
      // unless we explicitely mark the container as app holder
      // More info: https://groups.google.com/forum/#!msg/angular/yslVnZh9Yjk/MLi3VGXZLeMJ
      $html.addClass('ng-app');
    });
  });
});
