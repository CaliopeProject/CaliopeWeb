define([
    'angular',
    'application-controller',
    'application-servicesWebSocket',	
    'caliopeweb-templateServices',
    'caliopeweb-templateControllers',
    'caliopeweb-formDirectives',	
    'proyectosmtv-controller',
    'proyectosmtv-service',
    'login-services',
    'login-controllers',
//    'gis-start'
//     'tools-filesuploader-ctrl',

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
		                                 'LoginServices',
		                                 'LoginControllers'
//                                                  'FileUploaderController'
		                                ]);
		
		return moduleApp;
});