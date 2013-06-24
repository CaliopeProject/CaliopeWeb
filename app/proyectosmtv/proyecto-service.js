var moduleServices = Application.Services;

moduleServices.factory('proyectoSrv', function($q, $rootScope, $http) {
	return {
		create : function(id, nombre) {
			alert (' En servicio proyectoServ Crear' + id + ' ' + nombre);
		}		
	};	
});
