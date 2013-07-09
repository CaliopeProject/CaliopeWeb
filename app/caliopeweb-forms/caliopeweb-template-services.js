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
    
    
    Service.completeTemplateForAngular = function(jsonTemplate) {

      var typesInput = ["text", "password"];         
      
      function completeRecursive(jsonTemplate) {                    
          
        if( jsonTemplate.html != null && jsonTemplate.html.length > 0 ) {          
          completeRecursive(jsonTemplate.html);
        } else {                    
          var elements = jQuery.grep(jsonTemplate, function(obj) {
            return obj.type != null;
          });          
          for ( var i = 0; i < elements.length; i++) {
            completeIndividual(elements[i]);
          }                                    
        }
      }
      
      function completeIndividual(element) {        
        var stElement = JSON.stringify(element);                
        var name = element.name;
        
        if( name == null ) {
          name = element.id;
        }        
                
        var valueNgModel = "";
        if( name != null ) {
          valueNgModel = name; 
        } else {
          //TODO: Definir que se hace cuando no viene el att name, 
          // se debería generar una excepcion indicando el error y notificando
          // al server sobre el error.          
          //valueNgModel = stNameTemplate;
          console.error('No se encontro valor para el atributo name en el template.');
        }        
        element['ng-model'] = valueNgModel;                                                         
      }
            
      /*
       * If jsonTemplate not is null then runs the functionality that attach the  
       * directives of angularJS to jsonTemplate. 
       */
      if( jsonTemplate != null ) {           
        var valueNgCtrl = jsonTemplate.name;        
        if( valueNgCtrl != null) {          
          valueNgCtrl = valueNgCtrl.slice(0, 1).toUpperCase().concat(
                valueNgCtrl.slice(1, valueNgCtrl.length)
              ); 
          valueNgCtrl = valueNgCtrl.concat("Ctrl");
          jsonTemplate['ng-controller'] = valueNgCtrl;
        }        
        completeRecursive(jsonTemplate);        
      }
      
      return jsonTemplate; 
           
    }
        
    return Service;    
    
  }]);       
  
});