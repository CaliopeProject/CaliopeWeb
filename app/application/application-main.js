/*jslint browser: true*/
/*global windows, $*/

require.config({
  waitSeconds: 60,
  paths: {
    'jquery'                           : 'libs-js-thirdparty/jquery/jquery',
    'dform'                            : 'libs-js-thirdparty/jquery.dform/dist/jquery.dform-1.1.0',
    'angular'                          : 'libs-js-thirdparty/angular-unstable/angular',
    'uuid'                             : 'libs-js-thirdparty/uuid-js/lib/uuid',
    'Crypto'                           : 'libs-js-thirdparty/cryptojs/lib/Crypto',
    'CryptoSHA256'                     : 'libs-js-thirdparty/cryptojs/lib/SHA256',
    'application-app'                  : 'application/application-app',
    'application-servicesWebSocket'    : 'application/application-servicesWebSocket',
    'application-controller'           : 'application/application-controller',
    'caliopeweb-templateServices'      : 'caliopeweb-forms/caliopeweb-template-services',
    'caliopeweb-templateControllers'   : 'caliopeweb-forms/caliopeweb-template-controllers',
    'caliopeweb-formDirectives'        : 'caliopeweb-forms/caliopeweb-form-directives',
    'proyectosmtv-controller'          : 'proyectosmtv/proyectomtv-controller',
    'proyectosmtv-service'             : 'proyectosmtv/proyectomtv-service',
    'security-services'                   : 'login/security-services',
    'login-controllers'                : 'login/login-controllers',
    'application-routes'               : 'application/application-routes',

    'tools-filesuploader-ctrl'         : 'tools-files-uploader/files-uploader-controller',
    'jquery.fileupload'                : 'libs-js-thirdparty/jquery-file-upload/js/jquery.fileupload',
    'jquery.ui.widget'                 : 'libs-js-thirdparty/jquery-file-upload/js/vendor/jquery.ui.widget',
    'fileupload-ui'                    : 'libs-js-thirdparty/jquery-file-upload/js/jquery.fileupload-ui',
    'tmpl'                             : 'libs-js-thirdparty/blueimp-tmpl/js/tmpl',
    'jquery.fileupload-image'          : 'libs-js-thirdparty/jquery-file-upload/js/jquery.fileupload-image',
    'jquery.fileupload-audio'          : 'libs-js-thirdparty/jquery-file-upload/js/jquery.fileupload-audio',
    'jquery.fileupload-video'          : 'libs-js-thirdparty/jquery-file-upload/js/jquery.fileupload-video',
    'jquery.fileupload-validate'       : 'libs-js-thirdparty/jquery-file-upload/js/jquery.fileupload-validate',
    'canvas-to-blob'                   : 'libs-js-thirdparty/blueimp-canvas-to-blob/js/canvas-to-blob',
    'load-image-exif-map'              : 'libs-js-thirdparty/blueimp-load-image/js/load-image-exif-map',
    'load-image-exif'                  : 'libs-js-thirdparty/blueimp-load-image/js/load-image-exif',
    'load-image-meta'                  : 'libs-js-thirdparty/blueimp-load-image/js/load-image-meta',
    'load-image.min'                   : 'libs-js-thirdparty/blueimp-load-image/js/load-image.min',
    'load-image'                       : 'libs-js-thirdparty/blueimp-load-image/js/load-image',
    'load-image-ios'                   : 'libs-js-thirdparty/blueimp-load-image/js/load-image-ios',
    'jquery.fileupload-process'        : 'libs-js-thirdparty/jquery-file-upload/js/jquery.fileupload-process',
    'jquery.fileupload-angular'        : 'libs-js-thirdparty/jquery-file-upload/js/jquery.fileupload-angular',
    
    'gis-layout'                       : 'tools-gis-viewer/Layout',
    'gis-options'                      : 'tools-gis-viewer/Options',
    'gis-init'                         : 'tools-gis-viewer/Init',
    'gis-view-ctrl'                    : 'tools-gis-viewer/gis-viewer-controller',
    'gis-ext-all'                      : 'libs-js-thirdparty/compiled-gis/ext-all',
    'gis-ext-base'                     : 'libs-js-thirdparty/compiled-gis/ext-base',
    'gis-heron'                        : 'libs-js-thirdparty/heron-mc/heron',
    'gis-geoext'                       : 'libs-js-thirdparty/compiled-gis/GeoExt',
    'gis-openlayers'                   : 'libs-js-thirdparty/compiled-gis/OpenLayers'
     //'w8-elements.min'                 : 'application/w8-elements.min',
     //'w8.min'                          : 'application/w8.min'
  },
  baseUrl: '/',
  shim: {
    'jquery'                         : {'exports' : 'jquery'},
    'angular'                        : {'exports' : 'angular'},
    'application-app'                : {'exports' : 'app'},
    'application-servicesWebSocket'  : {'exports' : 'webSocket'},
    'application-routes'             : {'exports' : 'routes'},
    'application-controller'         : {'exports' : 'appcontroller'},
    'jquery.fileupload'              : {'exports' : 'fileupload'},
    'tools-filesuploader-ctrl'       : {'exports' : 'tools-filesuploader-ctrl'},
    //'w8-elements.min'                : {deps      : ['jquery']},
    //'w8.min'                         : {deps      : ['jquery']},
    'CryptoSHA256'                   : {deps      : ['Crypto']},
    
    'fileupload'                     : {deps      : [  'fileupload-ui',
                                                       'jquery.ui.widget', 
                                                       'tmpl'
                                                    ]},

    'tools-filesuploader-ctrl'       : {deps      : ['angular', 
                                                     'jquery', 
                                                     'jquery.fileupload', 
                                                     'jquery.fileupload-angular']},
    'dform'                          : {deps      : ['jquery']},

    'gis-ext-all'                    : {deps      : ['gis-ext-base']},
    'gis-geoext'                     : {deps      : ['gis-ext-all','gis-openlayers']},
    'gis-init'                       : {deps      : ['gis-geoext','gis-ext-all']},
    'gis-heron'                      : {deps      : ['gis-init']},
    'gis-view-ctrl'                  : {deps      : ['gis-heron']},

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
  'application-routes',
  'gis-view-ctrl',
  'tools-filesuploader-ctrl'
  //'w8-elements.min',
  //'w8.min'
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
