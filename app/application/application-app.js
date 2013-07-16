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
    'menu-top-controller',
    'gis-view-ctrl',
    'notificationsService',
    'httpRequestTrackerService',
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
    'MenuTopControllers',
    'NotificationsServices',
    'httpRequestTrackerService',
    'ngGrid'
  ];

define(dependencies, function ( angular, webSocket, appcontroller) {
  var moduleApp = angular.module('caliope', modulesAngular);
  return moduleApp;
});
