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
      
    Service.completeTemplateForAngular = (function() {
                  
      var formsWithOwnController = ['login'];
      var ctrlSIIMName = 'SIIMFormCtrl';
      var ctrlEndName = 'Ctrl';
      var inputsNames = [];

      
                                  
      function completeModelRecursive(jsonTemplate) {                              
        if( jsonTemplate.html != null && jsonTemplate.html.length > 0 ) {          
          completeModelRecursive(jsonTemplate.html);
        } else {                    
          var elements = jQuery.grep(jsonTemplate, function(obj) {
            return obj.type != null;
          });          
          for ( var i = 0; i < elements.length; i++) {
            completeModelIndividual(elements[i]);
          }                                    
        }
      }
      
      function completeModelIndividual(element) {        
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
        inputsNames.push(valueNgModel);
      }
      
      function completeController(jsonTemplateForm) {
        var valueNgCtrl = ctrlSIIMName;
        
        if( formsWithOwnController.indexOf(jsonTemplateForm.name) >= 0 ) {
          valueNgCtrl = jsonTemplateForm.name;
          valueNgCtrl = valueNgCtrl.slice(0, 1).toUpperCase().concat(
              valueNgCtrl.slice(1, valueNgCtrl.length)
            );           
          valueNgCtrl = valueNgCtrl.concat(ctrlEndName);
        }
        if( valueNgCtrl != null) {          
          valueNgCtrl = valueNgCtrl;
          jsonTemplateForm['ng-controller'] = valueNgCtrl;
        }                
      }
      
      function completeActions(jsonTemplateForm, jsonTemplateActions, 
          jsonTemplateTranslations) {        
               
        var nameForm = jsonTemplateForm.name;  
        
        if( jsonTemplateActions != null && jsonTemplateActions.length > 0 ) {
          for ( var i = 0; i < jsonTemplateActions.length; i++) {
            var action = {};
            action.type = "button";
            action['ng-click'] = jsonTemplateActions[i] + "(" + nameForm +")";
            action.html = jsonTemplateTranslations[jsonTemplateActions[i]];
            jsonTemplateForm.html.push(action);
          }
        }        
      }
                              
      return {
        jsonTemplateGen: function (jsonTemplateGen) {
          var jsonTemplateGenTmp = jsonTemplateGen;
          inputsNames = [];
          /*
           * If jsonTemplate not is null then runs the functionality that attach the  
           * directives of angularJS to jsonTemplate. 
           */
         
          if( jsonTemplateGenTmp != null && jsonTemplateGenTmp.form != null) {  
            var jsonTemplateForm = jsonTemplateGenTmp.form;
            var jsonTemplateData = jsonTemplateGen.data;
            var jsonTemplateActions = jsonTemplateGenTmp.actions;
            var jsonTemplateTranslations = jsonTemplateGenTmp.translations;
                    
            completeController(jsonTemplateForm);
            completeModelRecursive(jsonTemplateForm);
            completeActions( jsonTemplateForm, jsonTemplateActions, 
                jsonTemplateTranslations
              );
          } else {
            console.error('No existe form para agregar');
          }
          
          return jsonTemplateGenTmp;
        },
        inputs : function() {
          return inputsNames;
        },        
      }
           
    })();
    
    Service.sendDataForm = function(object, formId) {
      var request = {};          
      request = {};
      
      request = { 
          "cmd" : "create",
          "formId" : formId
        };
      request.data = {}
      jQuery.extend(request.data, object);
      var promise = {};
      
      var webSockets = webSocket.WebSockets();
      promise = webSockets.templates.sendRequest(request);
            
      return promise;      
    }
        
    return Service;    
    
  }]);       
  
});