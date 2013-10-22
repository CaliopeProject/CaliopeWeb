/*jslint browser: true*/
/*global define*/
'use strict';

var dependencies = [
    'angular'
    ,'angular-route-unstable'
    ,'application-servicesWebSocket'
    //,'application-controller'
    //,'menu-right-controller'
    //,'read-rss-controllers'
    //,'kanban-board-controller'
    //,'proyectomtv-controller'
    //,'caliopeweb-templateControllers'
    //,'gis-view-ctrl'
    //,'proyectomtv-summary-controller'
    //,'menu-top-controller'
    //,'login-controllers'
    //,'httpRequestTrackerService'

    //'application-commonservices',
    //'caliopeweb-templateServices',
    //'caliopeweb-formDirectives',
    //'admin-users-controller',
    //'application-routes',
    //'proyectomtv-service',
    //'login-security-services',
    //'login-controllers-form',
    //'login-retryQueue',
    //'login-directives',
    //'seeinmap-directives',
    //'gis-directives',
    //'seeinmap-services',
    //'notificationsService',
    //'angular-ui-ng-grid',
    ,'angular-route-unstable'
    ,'application-controller'
    ,'application-servicesWebSocket'
    //'application-commonservices',
    //'caliopeweb-templateServices',
    //'caliopeweb-templateControllers',
    //'caliopeweb-formDirectives',

    //'admin-users-controller',

    //'proyectomtv-controller',
    //'proyectomtv-service',
    //'proyectomtv-summary-controller',

    //'login-security-services',
    //'login-controllers',
    //'login-controllers-form',
    //'login-retryQueue',
    //'login-directives',

    //'seeinmap-directives',
    //'menu-top-controller',
    //'gis-view-ctrl',
    //'gis-directives',
    //'seeinmap-services',
    //'notificationsService',
    //'httpRequestTrackerService',
    //'angular-ui-ng-grid',
    //'menu-right-controller',
    //'files-uploader-controller',
    //'files-uploader-directives',
    //'wysiwyg-editor-controller',
    //'wysiwyg-editor-directive',
    //'task-controllers',
    //'task-directives',
    //'task-services',
    //'read-rss-services',

    //'task-controllers',
    //'task-directives',
    //'task-services',

    //'kanban-board-controller',

    //'read-rss-services',
    //'read-rss-controllers'
  ];

var modulesAngular = [
     'ngRoute'
    ,'webSocket'
    ,'CaliopeController'
    //,'httpRequestTrackerService'
    //,'httpRequestTrackerService'
    //,'menu-right-controller'
    //,'read-rss-controllers'
    //,'kanbanBoardCtrl'
    //,'ProyectoControllers'
    //,'CaliopeWebTemplateControllers'
    //,'GisViewerController'
    //,'ProyectoSummary'
    //,'MenuTopControllers'
    //,'login-controllers-form'
    //,'httpRequestTrackerService'
    //,'CaliopeWebFormDirectives'
    //'ProyectoServices',
    //'LoginControllers',

    //'seeinmap-directives',
    //'gis-directives',
    //'seeinmap-services',
    //'NotificationsServices',
    //'ngGrid',
    //'fileuploaderCtrl',
    //'fileuploaderDirectives',
    //'wysiwygEditorDirective',

    //,'task-controllers'
    //'task-directives',
    //'task-services',

  ];
  define(dependencies, function (angular) {
    var moduleApp = angular.module('caliope', modulesAngular);

    moduleApp.constant('global_constants', {
        'caliope_server_address':  'ws://' + document.domain + ':' + location.port + '/api/ws',
        'hyperion_server_address': 'http://' + document.domain + ':' + '9020',
        'rexp_value_in_form' : "^{{2}[^{].*[^}]}{2}$",
        'rexp_value_in_form_inrep' : "^{{2}",
        'rexp_value_in_form_firep' : "}{2}$"
    });

    moduleApp.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        }
    ]);

    moduleApp.run(function(webSocket) {
      webSocket.initWebSockets();
    });

    return moduleApp;
  });
