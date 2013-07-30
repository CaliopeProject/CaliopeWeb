/*jslint browser: true*/
/*global define, console, $*/

define(['angular', 'dform'], function (angular) {
  'use strict';  

  var moduleDirectives = angular.module('CaliopeWebFormDirectives', []);
  
    moduleDirectives.directive('cwForm', function () {
      var directiveDefinitionObject = {
        restrict : 'E',
        replace : false,
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

          /* Watch the change for attribute indicate in attribute cw-dform 
           * an update the form generated by Dform
           */
          scope.$watch(attrs.cwDform, function (value) {
            if (value !== undefined) {
              console.log("Json to render", value);
              renderDForm(value);
            }
          });
          
        }
      };
    
    return directiveDefinitionObject;
    
  });

  /**
   */
  moduleDirectives.directive('cwValidationMess', function ($compile) {

    /**
     * Define the function for link the directive to AngularJS Context.
     */
    var directiveDefinitionObject = {
      restrict : 'E',
      replace : true,
      scope: true,
      templateUrl : 'caliopeweb-forms/caliopeweb-valmess-partial.html',
      link: function (scope, element, attrs) {
        scope['validationType'] = attrs['validationType'];
        $compile(element.contents())(scope);
        var stParams = attrs['params'];
        if( stParams !== undefined ) {
          var params = stParams.split("|");
          var i;
          for( i=0; i<params.length; i++) {
            scope['param'.concat(i)] = params[i];
          }
        }
      }
    };

    return directiveDefinitionObject;
  });

  /**
   * @ngdoc directive
   * @name cw.directive:cwOptions
   * @restrict A
   * @replace false
   *
   * @description
   * Add to HTML 'select' element the possibility of load the option from the server or
   * from scope variable.
   *
   * Use the ng-options angular directive for create the HTML 'option' elements. The data
   * recovered from the server is storage in scope variable named 'options'.
   *
   * Use the service  caliopewebTemplateSrv for invoke the functionality that load and
   * communicates with the server across websocket
   *
   * @param remote: If value is true then the data is load from the server, for false then
   * the data is load from scope variable.  When is true then entity attribute is required.
   * When is false then scopevar attribute is required.
   *
   * @param entity: Name of the entity that contains the data.
   *
   */
  moduleDirectives.directive('cwOptions', ['caliopewebTemplateSrv', "$compile", function (caliopewebTemplateSrv, $compile) {

    var nameAttrFromServer = 'fromserver';
    var nameAttrEntity = 'entity';
    /**
     * Define the function for link the directive to AngularJS Context.
     */
    var directiveDefinitionObject = {
      restrict : 'A',
      replace : false,
      scope: true,
      link: function (scope, element, attrs) {
        if( attrs[nameAttrFromServer] !== undefined && attrs[nameAttrFromServer] == 'true') {
          var promise = caliopewebTemplateSrv.loadDataOptions(attrs[nameAttrEntity]);
          promise.then(function(dataResponse) {
            scope.options = [
              {value:'valor1', desc: 'desc1'},
              {value:'valor2', desc: 'desc2'},
              {value:'valor3', desc: 'desc3'}
            ];
          });
        }
        $compile(element.contents())(scope);
      }
    };

    return directiveDefinitionObject;
  }]);

  
});

