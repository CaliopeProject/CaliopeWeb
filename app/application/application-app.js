define([
	'angular',
	'application-controller',
  'application-servicesWebSocket',	
	'caliopeweb-templateServices',
	'caliopeweb-templateControllers',
	'caliopeweb-formDirectives',	
	'proyectosmtv-controller',
	'proyectosmtv-service'
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
		                                 'ProyectoServices'
		                                ]);
		
		return moduleApp;
})		