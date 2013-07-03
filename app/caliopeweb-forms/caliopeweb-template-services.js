define(['angular'], function(angular) {
  'use strict';
  
  var moduleServices = angular.module('CaliopeWebTemplatesServices', []);
  
  moduleServices.factory('caliopewebTemplateSrv', 
      ['$q', '$rootScope', '$http', 'webSocket',  
       function($q, $rootScope, $http, webSocket) {
    
    //We return this object to anything injecting our service
    var Service = {};

    /*
     * Service that load the json template that define the form with fields.
     */
    Service.loadTemplateData = function(caliopeForm) {
      var request = {};          
      //request.header = {};
      request = {};
      
      request = { 
          "cmd" : "getFormTemplate",
          "formId" : caliopeForm.id,
          "domain" : "",
          "version" : "3",
				};
      var promise = {};
      alert('Send Request');
      var webSockets = webSocket.WebSockets();
      promise = webSockets.templates.sendRequest(request);
            
      return promise;
    }

    /*
     * Service that load the json template that define the layout for a 
     * template
     */    
    Service.loadTemplateLayout = function(caliopeForm) {
      var request = {};    
      request.header = {};
      request.body = {};
      
      request.body = {        
          "template" :  caliopeForm.id,
        };
      var promise = {};
      
      var webSockets = webSocket.WebSockets();
      promise = webSockets.templatesLayout.sendRequest(request);
            
      return promise;
    }
    

    return Service;    
    
  }]);       
  
});