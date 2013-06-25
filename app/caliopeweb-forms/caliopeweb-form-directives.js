define(['angular'], function(angular) {
  'use strict';  
    
  angular.module('cwForm',[]).directive('cwForm', function(){
    var directiveDefinitionObject ={
      restrict : 'E',
      replace : true,
      templateUrl : 'caliopeweb-forms/caliopeweb-form-template.html',
      scope: {
        id : '=id',
        mode : '=mode'
      }   
    };
    
    return directiveDefinitionObject;
    
  });
  
  angular.module('cwDform',[]).directive('cwDform', function($compile) {  
    return {        
        restrict: 'E',        
        link: function(scope, element, attrs) {
          
          scope.$watch('jsonPlantilla', function (newValue, oldValue) {                      
            $(element).dform(scope.jsonPlantilla); 
            $compile(element.contents())(scope);
          });
          
          //scope.jsonPlantilla = 'A';
          //scope.jsonPlantilla = 'B';
          //var jsonPlantilla = JSON.parse(scope.jsonPlantilla);
          //$(element).dform(jsonPlantilla); 
          //$compile(element.contents())(scope);
        },          
    };
  });
  
});
