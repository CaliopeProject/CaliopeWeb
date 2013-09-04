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
    'proyectosmtv-controller',
    'proyectosmtv-service',

    'login-security-services',
    'login-controllers',
    'login-controllers-form',
    'login-retryQueue',
    'login-directives',

    'menu-top-controller',
    'gis-view-ctrl',
    'gis-directives',
    'notificationsService',
    'httpRequestTrackerService',
    'angular-ui-ng-grid',
    'menu-right-controller',
    'menu-right-directives',
    'files-uploader-controller',
    'files-uploader-directives',
    'wysiwyg-editor-controller',
    'wysiwyg-editor-directive',

    'task-controllers-init',
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

    'login-security-services',
    'LoginControllers',
    'login-controllers-form',
    'login-retryQueue',
    'login-directives',

    'GisViewerController',
    'gis-directives',
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

    'task-controllers-init',
    'task-directives',
    'task-services',

    'read-rss-services',
    'read-rss-controllers'
  ];

  define(dependencies, function ( angular, webSocket, appcontroller) {
    var moduleApp = angular.module('caliope', modulesAngular);

    moduleApp.run(function(webSocket) {
      webSocket.initWebSockets();
    });

    return moduleApp;
  });
