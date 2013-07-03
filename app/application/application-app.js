define([
	'angular',
	'application-servicesWebSocket',
	'application-controller',
	'caliopeweb-templateServices',
	'caliopeweb-templateControllers',
	'caliopeweb-formDirectives',	
	'proyectosmtv-controller',
	'proyectosmtv-service'
	], function (
	  angular,
	  webSocket
	  ){
		'use strict';
		var moduleApp = angular.module('caliope',[
		                                 'webSocket', 
		                                 'CaliopeController',
		                                 'CaliopeWebTemplatesServices', 
		                                 'CaliopeWebTemplateControllers',
		                                 'CaliopeWebFormDirectives',
		                                 'ProyectoControllers',		                                 
		                                 'ProyectoServices'
		                                ]);

		
		return moduleApp;
});
