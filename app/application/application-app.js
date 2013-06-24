define([
	'angular',
	'application-servicesWebSocket',
	'caliopeweb-templateServices',
	'caliopeweb-templateControllers',
	'caliopeweb-formDirectives',	
	'proyectosmtv-controller'
	], function (
	  angular,
	  webSocket
	  ){
		'use strict';
		return angular.module('caliope',['webSocket', 'caliopeweb-templateService','cwForm', 'caliopeFormsCtrl','cwDform', 'ProyectoCtrl']);
});
