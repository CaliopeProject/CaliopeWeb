/*jslint browser: true*/
/*global define*/
'use strict';

var dependencies = [
    'angular',
    'application-controller',
    'application-servicesWebSocket',
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
    'notificationsService',
    'httpRequestTrackerService',
    'breadcrumbsService',
    'angular-ui-ng-grid',
    'menu-right-controller',
    'menu-right-directives',
    'files-uploader-controller',
    'files-uploader-directives',
    'wysiwyg-editor-controller',
    'wysiwyg-editor-directive',

    'task-controllers-init',
    'task-directives'
  ];

var modulesAngular = [
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
    'MenuTopControllers',
    'NotificationsServices',
    'httpRequestTrackerService',
    'breadcrumbsService',
    'ngGrid',
    'menu-right-controller',
    'menu-right-directives',
    'fileuploaderCtrl',
    'fileuploaderDirectives',
    'wysiwygEditorCtrl',
    'wysiwygEditorDirective',

    'task-controllers-init',
    'task-directives'
  ];

  define(dependencies, function ( angular, webSocket, appcontroller) {
    var moduleApp = angular.module('caliope', modulesAngular);

    moduleApp.run(function(webSocket) {
      webSocket.initWebSockets();
    });

    return moduleApp;
  });
