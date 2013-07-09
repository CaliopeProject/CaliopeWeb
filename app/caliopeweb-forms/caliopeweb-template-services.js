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
    
    
    Service.completeTemplateWithAngular = function(jsonTemplate) {

      function completeRecursive(jsonTemplate, nameTemplate) {
        
        if( jsonTemplate.name != null ) {
          nameTemplate = jsonTemplate.name;
        }                
        jsonTemplate['ng-controller'] = 'LoginCtrl';      
        
        if( jsonTemplate.html != null && jsonTemplate.html.length > 0 ) {          
          completeRecursive(jsonTemplate.html, nameTemplate);
        } else {
          var elements = jQuery.grep(jsonTemplate, function(obj) {
            return obj.type != null;
          });          
          for ( var i = 0; i < elements.length; i++) {
            completeIndividual(elements[i], nameTemplate);
          }                    
        }
        return "";
      }
      
      function completeIndividual(element, nameTemplate) {        
        var stElement = JSON.stringify(element);
                
        var name = element.name;
        
        if( name == null ) {
          name = element.id;
        }        
        
        if( name != null ) {
          element['ng-model'] = nameTemplate + "." + name;          
        } else {
          element['ng-model'] = nameTemplate;          
        }
        element.value="";                      
        console.log('element:', element);                        
      }
      
      if( jsonTemplate != null ) {        
        var typesInput = ["text", "password"];             
        completeRecursive(jsonTemplate, jsonTemplate.name);        
      }
      
      return jsonTemplate; 
           
    }
        
    return Service;    
    
  }]);       
  
});