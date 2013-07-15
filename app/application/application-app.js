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
    'security-services',
    'login-controllers',
    'tools-filesuploader-ctrl',
    'menu-top-controller',
    'gis-view-ctrl',
    'notificationsService',
    'angular-ui-ng-grid'
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
    'SecurityServices',
    'LoginControllers',
    'GisViewerController',
    'FilesUploadController',
    'MenuTopControllers',
    'NotificationsServices',
    'ngGrid'
  ];

define(dependencies, function ( angular, webSocket, appcontroller) {
  var moduleApp = angular.module('caliope', modulesAngular);
  return moduleApp;
});
