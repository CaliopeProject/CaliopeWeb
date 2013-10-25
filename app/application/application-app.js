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
