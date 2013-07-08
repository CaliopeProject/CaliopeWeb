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
    'gis-view-ctrl'
	], function (
	  angular,
	  webSocket,
	  appcontroller
	  ){
		'use strict';
		var moduleApp = angular.module('caliope',['CaliopeController',
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
                                                 'FilesUploadController'

		                                ]);
		
		return moduleApp;
});
