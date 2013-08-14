/*jslint browser: true*/
/*global define, console, $*/

define(['angular', 'dform'], function (angular) {
  'use strict';

  /**
   * Get the final value of a attribute in a object, where attribute is represented by a string notation that indicate the
   * path to final attribute..
   *
   * Example.
   * obj = { "user" : {
    *            "username" : {value : "username"},
    *            "name"  : {value : "NAME USER"}
    *          }
    *       }
   * strAttrValue = user.name.value
   * charSplit = '.'
   *
   * Return "NAME USER"
   *
   * @param obj Object with the data
   * @param strAttrValue String that represent the attribute final to return value.
   * @param charSplit A character that indicate the separation of attributes in strAttrValue
   * @returns {*} The value of attribute
   */
  function getFinalValueFromString(obj, strAttrValue, charSplit) {
    var fieldsValue = strAttrValue.split(charSplit);
    var j;
    var objValue = obj;
    for(j=0;j<fieldsValue.length;j++) {
      try {
        objValue = objValue[fieldsValue[j]];
      } catch (ex) {
        console.error('Error creando opción en html select. No se encontró el atributo ' + strAttrValue + ' en ', obj );
      }
    }
    return objValue;
  }



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
            $.dform.options.prefix = null;
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
        scope.validationType = attrs.validationType;
        $compile(element.contents())(scope);
        var stParams = attrs.params;
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

    var ATTNAME_LOADREMOTE = 'fromserver';
    var ATTNAME_METHOD = 'method';
    var ATTNAME_FIELDVALUE = 'fieldvalue';
    var ATTNAME_FIELDDESC = 'fielddesc';
    var ATTNAME_FIELDID = 'formid';
    var ATTNAME_FIELD_DATALIST = 'fieldDatalist';
    var ATTNAME_OPTIONSNAME = 'optionsName';
    var ATTNAME_MCOMBO_CHOICES = 'uiMcomboChoices';
    var ATTNAME_MCOMBO_SELECTED = 'uiMcomboSelected';

    /**
    * Define the function for link the directive to AngularJS Context.
    */
    var directiveDefinitionObject = {

      restrict : 'A',
      replace : false,
      scope: false,
      link: function (scope, element, attrs) {

        console.log('Attrs', attrs);

        if( attrs[ATTNAME_LOADREMOTE] !== undefined && attrs[ATTNAME_LOADREMOTE] === 'true') {

          var fieldId = attrs[ATTNAME_FIELDID];
          var promise =
          caliopewebTemplateSrv.loadDataOptions(attrs[ATTNAME_METHOD], fieldId, undefined);

          promise.then(function(dataResponse) {


            if( dataResponse !== undefined ) {
              var i;
              var attrFieldValue = attrs[ATTNAME_FIELDVALUE];
              var attrFieldDesc = attrs[ATTNAME_FIELDDESC];
              if(attrs[ATTNAME_FIELD_DATALIST] !== undefined) {
                dataResponse =
                getFinalValueFromString(dataResponse, attrs[ATTNAME_FIELD_DATALIST], '.');
              }

              var scopeOptionsName = attrs[ATTNAME_OPTIONSNAME];
              if( scopeOptionsName !== undefined ) {
                scope[scopeOptionsName] = [];
                for(i=0; i<dataResponse.length; i++) {
                  var option = {
                    value : getFinalValueFromString(dataResponse[i], attrFieldValue, '.'),
                    label  : getFinalValueFromString(dataResponse[i], attrFieldDesc, '.')
                  };
                  scope[scopeOptionsName].push(option);
                }
              }

            }
          });

        }
//        $compile(element.contents())(scope);
      }
    };

    return directiveDefinitionObject;
  }]);

  moduleDirectives.directive("uiMcomboChoices", ['caliopewebTemplateSrv', '$document',
    function(caliopewebTemplateSrv, $document){
    // simultaneously should not be two open items

      var openElement = null, close;
      var VAR_SCOPE_PUT_CHOICES_SELECTED = 'var_put_choices_selected';

      return {
        restrict: 'A',
        replace: true,
        templateUrl: 'caliopeweb-forms/caliopeweb-mcombo-partial-directive.html',
        scope: true,
        controller: ['$scope', '$filter', function($scope, $filter) {

          $scope._searchElem = null;
          $scope.filteredChoices = function() {
            var filtered = $filter('filter')($scope._choices, $scope._search);
            return $filter('orderBy')(filtered, 'text');
          };

          $scope.moveToSelected = function(choice, $event) {
            $scope._selectedChoices.push(choice);
            $scope._choices.splice($scope._choices.indexOf(choice), 1);
            $scope._search='';

            $scope._searchElem.focus();

            // do not 'close' on choice click
            $event.preventDefault();
            $event.stopPropagation();
          };

          $scope.removeFromSelected = function(choice) {
            $scope._choices.push(choice);
            $scope._selectedChoices.splice($scope._selectedChoices.indexOf(choice), 1);

            $scope._searchElem.focus();
          };

          /**
           * THis watch is to update the scope and parent scope with choices selected.
           */
          $scope.$watch('_selectedChoices.length', function(value) {
            if($scope[VAR_SCOPE_PUT_CHOICES_SELECTED] !== undefined && value !== undefined) {
              $scope[$scope[VAR_SCOPE_PUT_CHOICES_SELECTED]] = $scope._selectedChoices;
              $scope.$parent[$scope[VAR_SCOPE_PUT_CHOICES_SELECTED]] = $scope._selectedChoices;
            }
          });


        }
        ],
        link: function(scope, element, attrs) {

          var selUl = element.children().eq(0);
          var selItems = selUl.children();

          scope._searchElem = selItems.eq(selItems.length-1).children().eq(0)[0];

          scope._choices=scope[attrs['uiMcomboChoices']];
          scope._selectedChoices=scope[attrs['uiMcomboSelected']];

          selUl.bind('click', function(event) {
            // otherwise 'close' will be called immediately
            event.preventDefault();
            event.stopPropagation();


            if (openElement) {
              close(event);
            }

            if (!element.hasClass('mcombo-container-active')) {
              element.addClass('mcombo-container-active');
              openElement = element;

              close = function (event) {

                if(event){
                  event.preventDefault();
                }

                if(event){
                  event.stopPropagation();
                }

                $document.unbind('click', close);
                element.removeClass('mcombo-container-active');
                close = null;
                openElement = null;
              };
              $document.bind('click', close);
            }

            scope._searchElem.focus();

          });

          /*
           Code for load choices from server
            */

          var loadRemote = attrs['loadRemote'];

          if( loadRemote !== undefined && loadRemote === 'true') {

            var ATTNAME_METHOD = 'method';
            var ATTNAME_FIELDVALUE = 'fieldvalue';
            var ATTNAME_FIELDDESC = 'fielddesc';
            var ATTNAME_FIELDID = 'formid';
            var ATTNAME_FIELD_DATALIST = 'fieldDatalist';

            var promise = caliopewebTemplateSrv.loadDataOptions(attrs[ATTNAME_METHOD],
                    attrs[ATTNAME_FIELDID], undefined);

            /*
            This var is to storage the name of the var in the scope to storage the result
            of items choices
            */
            scope[VAR_SCOPE_PUT_CHOICES_SELECTED] = attrs['name'];

            promise.then(function(dataResponse) {

              if( dataResponse !== undefined ) {

                var i;
                var attrFieldValue = attrs[ATTNAME_FIELDVALUE];
                var attrFieldDesc = attrs[ATTNAME_FIELDDESC];
                if(attrs[ATTNAME_FIELD_DATALIST] !== undefined) {
                  dataResponse =
                      getFinalValueFromString(dataResponse, attrs[ATTNAME_FIELD_DATALIST], '.');
                }

                var scopeMultiComboChoices = '_choices';
                var scopeMultiComboSelected = '_selectedChoices';

                scope[scopeMultiComboChoices] = [];
                scope[scopeMultiComboSelected] = [];
                for(i=0; i<dataResponse.length; i++) {
                  var option = {
                    value : getFinalValueFromString(dataResponse[i], attrFieldValue, '.'),
                    text  : getFinalValueFromString(dataResponse[i], attrFieldDesc, '.')
                  };
                  scope[scopeMultiComboChoices].push(option);
                }
              }

              /*
              Code for load selected choices from server to componente ui-mcombo-choices and
              remove selected choices.
              */
              var selectedChoices  = attrs['selectedChoices'].split(",");
              var scopeMultiComboChoicesTmp = scope[scopeMultiComboChoices];
              if( selectedChoices !== undefined ) {
                for(i=0; i < selectedChoices.length; i++ ) {
                  var valueChoice = selectedChoices[i];
                  if( valueChoice !== undefined ) {
                    var j;
                    var objChoice = undefined;
                    for(j=0; j < scope[scopeMultiComboChoices].length; j++ ) {
                      if( scope[scopeMultiComboChoices][j] !== undefined ) {

                        if(scope[scopeMultiComboChoices][j].value === valueChoice) {
                          objChoice = scope[scopeMultiComboChoices][j];
                          break;
                        }
                      }
                    }
                    if( objChoice !== undefined ) {
                      scope[scopeMultiComboSelected].push(objChoice);
                      var indexOf = scopeMultiComboChoicesTmp.indexOf(objChoice);
                      scopeMultiComboChoicesTmp.splice(indexOf, 1);
                    }
                  }
                }
                scope[scopeMultiComboChoices] = scopeMultiComboChoicesTmp;
              }

            });

          }

        }
      };
  }]);
});

