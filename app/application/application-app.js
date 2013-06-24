define([
	'angular',
	'application-servicesWebSocket'
	], function (
	  angular,
	  webSocket
	  ){
		'use strict';
		return angular.module('caliope',['webSocket']);
});
