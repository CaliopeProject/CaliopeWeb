/*jslint browser: true*/
/*global require, $*/

require.config({
  paths: {
    'jquery'                           : 'libs-js-thirdparty/jquery/jquery',
    'dform'                            : 'libs-js-thirdparty/jquery.dform/dist/jquery.dform-1.1.0',
    'angular'                          : 'libs-js-thirdparty/angular-unstable/angular',
    'angular-ui-bootstrap-bower'       : 'libs-js-thirdparty/angular-ui-bootstrap-bower/ui-bootstrap-tpls',
    'angular-ui-ng-grid'               : 'libs-js-thirdparty/ng-grid/ng-grid-2.0.7.debug',
    'uuid'                             : 'libs-js-thirdparty/uuid-js/lib/uuid',
    'Crypto'                           : 'libs-js-thirdparty/cryptojs/lib/Crypto',
    'CryptoSHA256'                     : 'libs-js-thirdparty/cryptojs/lib/SHA256',
    'jquery.fileupload'                : 'libs-js-thirdparty/jquery-file-upload/js/jquery.fileupload',
    'jquery.ui.widget'                 : 'libs-js-thirdparty/jquery-file-upload/js/vendor/jquery.ui.widget',
    'jquery.fileupload-ui'             : 'libs-js-thirdparty/jquery-file-upload/js/jquery.fileupload-ui',
    'tmpl'                             : 'libs-js-thirdparty/blueimp-tmpl/js/tmpl',
    'jquery.fileupload-image'          : 'libs-js-thirdparty/jquery-file-upload/js/jquery.fileupload-image',
    'jquery.fileupload-audio'          : 'libs-js-thirdparty/jquery-file-upload/js/jquery.fileupload-audio',
    'jquery.fileupload-video'          : 'libs-js-thirdparty/jquery-file-upload/js/jquery.fileupload-video',
    'jquery.fileupload-validate'       : 'libs-js-thirdparty/jquery-file-upload/js/jquery.fileupload-validate',
    'canvas-to-blob.min'               : 'libs-js-thirdparty/blueimp-canvas-to-blob/js/canvas-to-blob.min',

    'load-image-exif-map'              : 'libs-js-thirdparty/blueimp-load-image/js/load-image-exif-map',
    'load-image-exif'                  : 'libs-js-thirdparty/blueimp-load-image/js/load-image-exif',
    'load-image-meta'                  : 'libs-js-thirdparty/blueimp-load-image/js/load-image-meta',
    'load-image.min'                   : 'libs-js-thirdparty/blueimp-load-image/js/load-image.min',
    'load-image'                       : 'libs-js-thirdparty/blueimp-load-image/js/load-image',
    'load-image-ios'                   : 'libs-js-thirdparty/blueimp-load-image/js/load-image-ios',
    'jquery.blueimp-gallery'           : 'libs-js-thirdparty/blueimp-gallery/js/jquery.blueimp-gallery.min',
    'blueimp-gallery'                  : 'libs-js-thirdparty/blueimp-gallery/js/blueimp-gallery.min',
    'blueimp-helper'                   : 'libs-js-thirdparty/blueimp-gallery/js/blueimp-helper',
    'jquery.iframe-transport'          : 'libs-js-thirdparty/jquery-file-upload/js/jquery.iframe-transport',
    'jquery.fileupload-process'        : 'libs-js-thirdparty/jquery-file-upload/js/jquery.fileupload-process',
    'jquery.fileupload-angular'        : 'libs-js-thirdparty/jquery-file-upload/js/jquery.fileupload-angular',
    'files-uploader-controller'        : 'tools-files-uploader/files-uploader-controller',
    'files-uploader-directives'        : 'tools-files-uploader/files-uploader-directives',

    'gis-layout'                       : 'tools-gis-viewer/Layout',
    'gis-options'                      : 'tools-gis-viewer/Options',
    'gis-init'                         : 'tools-gis-viewer/Init',
    'gis-view-ctrl'                    : 'tools-gis-viewer/gis-viewer-controller',
    'gis-ext-all'                      : 'libs-js-thirdparty/compiled-gis/ext-all',
    'gis-ext-base'                     : 'libs-js-thirdparty/compiled-gis/ext-base',
    'gis-heron'                        : 'libs-js-thirdparty/heron-mc/heron',
    'gis-geoext'                       : 'libs-js-thirdparty/compiled-gis/GeoExt',
    'gis-openlayers'                   : 'libs-js-thirdparty/compiled-gis/OpenLayers',

    'application-app'                  : 'application/application-app',
    'application-servicesWebSocket'    : 'application/application-servicesWebSocket',
    'application-controller'           : 'application/application-controller',
    'application-routes'               : 'application/application-routes',
    'notificationsService'             : 'application/notificationsService',
    'httpRequestTrackerService'        : 'application/httpRequestTrackerService',
    'breadcrumbsService'               : 'application/breadcrumbsService',
    'application-event'                : 'application/application-event',
    'caliopeWebForms'                  : 'caliopeweb-forms/CaliopeWebForms',
    'caliopeWebGrids'                  : 'caliopeweb-forms/CaliopeWebGrids',
    'caliopeweb-templateServices'      : 'caliopeweb-forms/caliopeweb-template-services',
    'caliopeweb-templateControllers'   : 'caliopeweb-forms/caliopeweb-template-controllers',
    'caliopeweb-formDirectives'        : 'caliopeweb-forms/caliopeweb-form-directives',

    'proyectosmtv-controller'          : 'proyectosmtv/proyectomtv-controller',
    'proyectosmtv-service'             : 'proyectosmtv/proyectomtv-service',

    'login-security-services'          : 'login/login-security-services',
    'login-retryQueue'                 : 'login/login-retryQueue',
    'login-controllers'                : 'login/login-controllers',
    'login-controllers-form'           : 'login/login-controllers-form',
    'login-directives'                 : 'login/login-directives',

    'menu-top-controller'              : 'menu-top/menu-top-controllers',

    'menu-right-controller'            : 'menu-right/menu-right-controller',
    'menu-right-directives'            : 'menu-right/menu-right-directives',

    'ckeditor'                         : 'libs-js-thirdparty/ckeditor/ckeditor',
    'wysiwyg-editor-directive'         : 'tools-wysiwyg-editor/wysiwyg-editor-directive',
    'wysiwyg-editor-controller'        : 'tools-wysiwyg-editor/wysiwyg-editor-controller',

    'kanban-board-controller'          : 'tools-kanban-board/kanban-board-controller',
    'task-controllers-init'            : 'task/task-controllers-init',
    'task-services'                    : 'task/task-services',
    'task-directives'                  : 'task/task-directives'

  },
  baseUrl: '/',
  shim: {
    'jquery'                         : {'exports' : 'jquery'},
    'angular'                        : {'exports' : 'angular'},
    'angular-ui-bootstrap-bower'     : {'exports' : 'ui-bootstrap'},
    'angular-ui-ng-grid'             : {'exports' : 'ui-ng-grid'},
    'application-app'                : {'exports' : 'app'},
    'application-servicesWebSocket'  : {'exports' : 'webSocket'},
    'application-routes'             : {'exports' : 'routes'},
    'application-controller'         : {'exports' : 'appcontroller'},
    'application-event'              : {'deps'      : ['jquery']},

    'CryptoSHA256'                   : {'deps'      : ['Crypto']},

    'wysiwyg-editor-directive'       : {'deps'      : ['jquery','angular','ckeditor']},
    'jquery.fileupload-angular'      : {'deps'      :
                                        [
                                        'jquery',
                                        'angular',
                                        'jquery.ui.widget',
                                        'load-image.min',
                                        'canvas-to-blob.min',
                                        //'bootstrap.min',
                                        'blueimp-gallery',
                                        'jquery.blueimp-gallery',
                                        'jquery.iframe-transport',
                                        'jquery.fileupload',
                                        'jquery.fileupload-process',
                                        'jquery.fileupload-image',
                                        'jquery.fileupload-audio',
                                        'jquery.fileupload-video',
                                        'jquery.fileupload-validate'
                                        ]},

    'dform'                          : {'deps'      : ['jquery']},

    'gis-ext-all'                    : {'deps'      : ['gis-ext-base']},
    'gis-geoext'                     : {'deps'      : ['gis-ext-all','gis-openlayers']},
    'gis-init'                       : {'deps'      : ['gis-geoext','gis-ext-all']},
    'gis-heron'                      : {'deps'      : ['gis-init']},
    'gis-view-ctrl'                  : {'deps'      : ['gis-heron']},


    'angularMocks'                   : {'deps'      : ['angular'], 'exports' : 'angular.mock'}
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
  'gis-view-ctrl'
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
