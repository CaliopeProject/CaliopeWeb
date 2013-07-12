/*jslint browser: true*/
/*global define*/

define([
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
    'notificationsService'
  ], function (
    angular,
    webSocket,
    appcontroller
    ) {
    'use strict';
    var moduleApp = angular.module('caliope', ['CaliopeController',
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
                                     'NotificationsServices'
                                    ]);

    return moduleApp;
  });
