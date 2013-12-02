/*jslint browser: true*/
/*global define*/
'use strict';

//only controllers from requirejs
var dependencies = [
   'angular'
  ,'angular-route-unstable'
  ,'application-servicesWebSocket'
  ,'application-controller'
  ,'menu-right-controller'
  ,'read-rss-controllers'
  ,'kanban-board-controller'
  ,'login-controllers-form'
  ,'proyectomtv-summary-controller'
  ,'caliopeweb-templateControllers'
  ,'gis-view-ctrl'
  ,'files-uploader-controller'
  ,'wysiwyg-editor-controller'
  ,'proyectomtv-controller'
  ,'admin-users-controller'
  ,'tree-project-controller'
];

//only controllers name modules
var modulesAngular = [
   'ngRoute'
  ,'webSocket'
  ,'CaliopeController'
  ,'menu-right-controller'
  ,'read-rss-controllers'
  ,'kanbanBoardCtrl'
  ,'login-controllers-form'
  ,'ProyectoSummary'
  ,'CaliopeWebTemplateControllers'
  ,'GisViewerController'
  ,'fileuploaderCtrl'
  ,'wysiwygEditorCtrl'
  ,'ProyectoControllers'
  ,'AdminUsersController'
  ,'treeController'
];

define(dependencies, function (angular) {
  var moduleApp = angular.module('caliope', modulesAngular);

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
