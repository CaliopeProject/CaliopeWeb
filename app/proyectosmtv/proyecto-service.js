var moduleServices = Application.Services;

moduleServices.factory('proyectoSrv', function($q, $rootScope, $http) {
	return {
		create : function(proyecto) {
      var jsonData = JSON.stringify($scope.proyecto);
      console.log('json-Data-proyecto', jsonData)			
		}		
	};	
});
