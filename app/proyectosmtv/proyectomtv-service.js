define(['angular'], function(angular) {
  'use strict';
  
  var moduleServices = angular.module('ProyectoServices', []);
  
  moduleServices.factory('proyectoSrv', 
      ['$q', '$rootScope', '$http',  
       function($q, $rootScope, $http) {
        return {
        	create : function(proyecto) {
            var jsonData = JSON.stringify(proyecto);
            console.log('json-Data-proyecto', jsonData)			
          }		
        };
      }
     ]
  );
});
