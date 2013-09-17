/*jslint browser: true*/
/*global define*/
'use strict';

var dependencies = [
    'angular',
    'angular-route-unstable',
    'application-controller',
    'application-servicesWebSocket',
    'application-commonservices',
    'caliopeweb-templateServices',
    'caliopeweb-templateControllers',
    'caliopeweb-formDirectives',

    'proyectomtv-controller',
    'proyectomtv-service',
    'proyectomtv-summary-controller',

    'login-security-services',
    'login-controllers',
    'login-controllers-form',
    'login-retryQueue',
    'login-directives',

    'seeinmap-directives',
    'menu-top-controller',
    'gis-view-ctrl',
    'gis-directives',
    'seeinmap-services',
    'notificationsService',
    'httpRequestTrackerService',
    'angular-ui-ng-grid',
    'menu-right-controller',
    'menu-right-directives',
    'files-uploader-controller',
    'files-uploader-directives',
    'wysiwyg-editor-controller',
    'wysiwyg-editor-directive',

    'task-controllers',
    'task-directives',
    'task-services',

    'kanban-board-controller',

    'read-rss-services',
    'read-rss-controllers'
  ];

var modulesAngular = [
    'ngRoute',
    'CaliopeController',
    'webSocket',
    'CaliopeController',
    'CaliopeWebTemplatesServices',
    'CaliopeWebTemplateControllers',
    'CaliopeWebFormDirectives',

    'ProyectoControllers',
    'ProyectoServices',
    'ProyectoSummary',

    'login-security-services',
    'LoginControllers',
    'login-controllers-form',
    'login-retryQueue',
    'login-directives',

    'seeinmap-directives',
    'GisViewerController',
    'gis-directives',
    'seeinmap-services',
    'MenuTopControllers',
    'NotificationsServices',
    'httpRequestTrackerService',
    'ngGrid',
    'menu-right-controller',
    'menu-right-directives',
    'fileuploaderCtrl',
    'fileuploaderDirectives',
    'wysiwygEditorCtrl',
    'wysiwygEditorDirective',
    'kanbanBoardCtrl',

    'task-controllers',
    'task-directives',
    'task-services',

    'read-rss-services',
    'read-rss-controllers'
  ];

  define(dependencies, function ( angular, webSocket, appcontroller, $rootScope) {
    var moduleApp = angular.module('caliope', modulesAngular);

    moduleApp.constant('global_constants', {
        'caliope_server_address':  'ws://' + document.domain + ':' + location.port + '/api/ws',
        'hyperion_server_address': 'http://' + document.domain + ':' + '9001'
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
