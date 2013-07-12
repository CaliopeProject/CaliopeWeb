/*jslint browser: true*/
/*global define, console, $*/

define(['angular', 'dform'], function (angular) {
  'use strict';  

  var moduleDirectives = angular.module('CaliopeWebFormDirectives', []);
  
  moduleDirectives.directive('cwForm', function () {
    var directiveDefinitionObject = {
      restrict : 'E',
      replace : true,
      templateUrl : 'caliopeweb-forms/caliopeweb-form-partial.html',
      scope: {
        id   : '=id',
        mode : '=mode'
      }   
    };
    
    return directiveDefinitionObject;
    
  });
  
  /**
   * Define the directive for <cw-dform>. This print a html form using the 
   * Dform library based in JQuery.  This directive should be used as an 
   * attribute, example: <form cw-dform="jsonPlantilla"></form>.  
   * 
   * This directive expect one attribute, it is the variable of scope that 
   * contains the representation of form according to the format specific for
   * Dform Library. For more information please visit
   * https://github.com/daffl/jquery.dform
   *  
   */
  moduleDirectives.directive('cwDform', function ($compile) {
    
    /**
     * Define the function for link the directive to AngularJS Context.
     */
    var directiveDefinitionObject = {
        replace : false,
        restrict : 'A',
        link: function (scope, element, attrs) {       
    
          /*
           * Function that print the form with dForm  
           */
          function renderDForm(templateData) {
            //var plantilla = JSON.parse(templateData);
            var plantilla = templateData;
            try {            
              $(element).dform(plantilla);              
            } catch (exDform) {
              console.log('Error generating the dynamic form with dForm', exDform);
            }
            try {
              $compile(element.contents())(scope);
            } catch (exCom) {
              console.log('Error compiling form generated:', exCom);
            }
          }
          
          function applyLayout(templateLayout) {          
            var selector = '[name*=":name"]';
            
            for (var i in templateLayout) {
              var name = templateLayout[i].name;
              var classTags = templateLayout[i].classTags;
              var selectorDef = selector.replace(':name', name);
              $(selectorDef).removeClass();
              $(selectorDef).addClass(classTags);
            }
          }          
          
          /* Watch the change for attribute indicate in attribute cw-dform 
           * an update the form generated by Dform
           */
          scope.$watch(attrs.cwDform, function (value) {
            if (value !== undefined) {            
              renderDForm(value);
            }
          });
          
          scope.$watch(attrs.layout, function (value) {          
            if (value !== undefined) {
              applyLayout(value);
            }
          });
        }
      };
    
    return directiveDefinitionObject;
    
  });
  
});

