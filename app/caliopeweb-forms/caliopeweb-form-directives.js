/*jslint browser: true*/
/*global define, console$*/

/**
 *
 * This module contains all angularjs directives creates in caliope web form API to render
 * the dynamics forms.
 *
 * @module CaliopeWebFormDirectives
 * @namespace  CaliopeWebFormDirectives
 *
 * @author Daniel Ochoa <ndaniel8a@gmail.com>
 * @author Cesar Gonzalez <aurigadl@gmail.com>
 * @license  GNU AFFERO GENERAL PUBLIC LICENSE
 * @copyright
   SIIM2 Models are the data definition of SIIM2 Information System
   Copyright (C) 2013 Infometrika Ltda.

   This program is free software: you can redistribute it and/or modify
   it under the terms of the GNU Affero General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU Affero General Public License for more details.

   You should have received a copy of the GNU Affero General Public License
   along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */
define(['angular', 'dform', 'Crypto', 'application-commonservices', 'notificationsService'], function (angular) {
  'use strict';

  /**
   * Define a module for add the angularjs directives of CaliopeWebForm
   * @memberOf CaliopeWebFormDirectives
   * @type {module}
   */
  var moduleDirectives = angular.module('CaliopeWebFormDirectives', ['CaliopeWebTemplatesServices','commonServices', 'NotificationsServices']);

  /**
   * Define the directive for cw-dform. This print a html form using the
   * Dform library based in JQuery.  This directive should be used as an
   * attribute,
   *
   * This directive expect one attribute, it is the variable of scope that
   * contains the representation of form according to the format specific for
   * Dform Library. For more information please visit
   * https://github.com/daffl/jquery.dform
   *
   * @callback CaliopeWebFormDirectives
   * @namespace Directive:cwDform
   *
  */
  moduleDirectives.directive('cwDform',['$compile'
                                        ,'$routeParams'
                                        ,'caliopewebTemplateSrv'
                                        ,'caliopeWebFormNotification'
    ,function ($compile, $routeParams, cwFormService, cwFormNotif) {

    return {

      controller : function($scope, $attrs, $element) {
        /*
        var entity = $attrs['entity'];
        var mode = $attrs['mode'];
        var uuid = $attrs['uuid'];
        var name = $attrs['name'];
        var generic = $attrs['generic'];
        var inner = $attrs['inner'];

        if( $attrs['fromRouteparams'] !== undefined &&
            $attrs['fromRouteparams'] === "true") {
          entity = $routeParams.entity;
          mode = $routeParams.mode;
          uuid = $routeParams.uuid;
        }
        if( entity === undefined ) {
          //TODO: Generar Error, entidad requerida
        }
        if( name === undefined ) {
          //TODO: Generar Error, nombre requerido
        }
        if($attrs['encUuid']==="true") {
          //TODO: Create centralized function to encode and decode uuid
          if( uuid !== undefined ) {
            var bytesUUID = Crypto.util.base64ToBytes(uuid);
            uuid = Crypto.charenc.Binary.bytesToString(bytesUUID);
          }
        }
        var cwForm = cwFormService.createForm(entity, mode, uuid);
        if( generic === true || generic === "true") {
          cwForm.setGenericForm(true);
        }
        if( inner === true || inner === "true") {
          cwForm.setInnerForm(true);
        }
        $scope['cwForm-name'] = 'cwForm-'.concat(name);
        $scope[$scope['cwForm-name']] = cwForm;
        */
      },

      /**
       * Link function of the directive. This get the directive $element and call the
       * Jquery Dform library to render the form.
       * @function link
       * @param {object} $scope AngularJS $scope of the directive
       * @param {object} $element Element that contains the directive definition
       * @param {object} $attrs Attributes in tag that contains the directive.
       */
      link: function ($scope, $element, $attrs) {

        /*
        Assign attributes values to vars
         */
        var entity           = $attrs['entity'];
        var mode             = $attrs['mode'];
        var uuid             = $attrs['uuid'];
        var name             = $attrs['name'];
        var generic          = $attrs['generic'];
        var inner            = $attrs['inner'];
        var initForm         = $attrs['init'];
        var preLoadFunction  = $attrs['preLoadFunction'];
        var postLoadFunction = $attrs['postLoadFunction'];

        /**
         * Return the form storage in the scope.
         * @returns {CaliopeWebForm}
         */
        function getForm() {
          var cwFormName = $scope['cwForm-name'];
          return $scope[cwFormName];
        }

        /**
         * Process additional if is a generic form
         * //TODO: Change this to CaliopeWebForms
         * @param cwForm Caliope Web Forms
         * @param params params
         * @param entity Entity
         */
        function processGenericForm(cwForm, params, entity) {
          params.formId = entity;
          cwForm.setEntityModel('form');
          $scope.entityModel = entity;
        }

        /**
         * Function that render the form with Jquery dForm. Also compile the DOM generate by
         * dForm in order to angularjs note the directives includes in the DOM
         * @function
         * @param {object} templateData Json Template to render. The Json must be in dForm syntax.
         * @inner
         */
        function renderDForm(templateData) {
          try {
            $.dform.options.prefix = null;
            $($element).dform(templateData);
          } catch (exDform) {
            console.log('Error generating the dynamic form with dForm' +  exDform.message + exDform );
          }
          try {
            $compile($element.contents())($scope);
          } catch (exCom) {
            console.log('Error compiling form generated' +  exCom.message);
          }
        }

        /**
         *  Process the response of the request of get form template.
         * @param cwForm
         * @param result
         * @param $scope
         * @param postLoadFunction
         */
        function processResultLoadForm(cwForm, result, $scope, postLoadFunction) {
          if( result !== undefined && result.error === undefined) {
            if( result !== undefined ) {
              if( result.structureToRender !== undefined ) {
                var varTemplate = 'jsonPlantillaAngular';
                if($scope['cwForm-varTemplate'] !== undefined) {
                  varTemplate = $scope['cwForm-varTemplate'];
                }
                $scope[varTemplate] = result.structureToRender;
              }
              if( result.elements !== undefined ) {
                $scope.elementsFormTemplate = result.elements;
              }
              $scope.modelUUID = result.modelUUID;
              $scope.entityModel = result.entityModel;

              /*
               Add data to scope
               */
              var dataToView = cwForm.dataToViewData();
              if( dataToView !== undefined ) {
                angular.forEach(dataToView, function(value, key){
                  $scope[key] = value;
                });
              }
            }
            if( postLoadFunction !== undefined) {
              postLoadFunction(cwForm, result);
            }
          } else if(result.error !== undefined) {
            throw new Error('Error load form from server.' + result.error.message);
          } else {
            throw new Error('Error load form from server. Form is empty');
          }
        }

        /**
         *  Call the service cwForm to retrieve the form from request.
         */
        function init (preLoadFunction) {
          var cwForm = getForm();
          var params = {};

          /**
           * If is a innerForm then the innerForm is in $scope.$parent[name]
           */
          if( cwForm.getInnerForm() ) {
            var uuidsInnerForm = $scope.$parent[ $scope.$parent.innerForms[name].nameField ];
            if( uuidsInnerForm !== undefined && uuidsInnerForm.length > 0 ) {
              var index = 0; //$scope.$parent.innerForms[name].index;
              cwForm.setModelUUID(uuidsInnerForm[index].uuid);
              uuidsInnerForm.splice(0,1);
            }
          }

          if(cwForm.getModelUUID() !== undefined && cwForm.getModelUUID().length > 0) {
            $scope.showWidgetTask=true;
          }

          if( cwForm.getGenericForm() === true ) {
            processGenericForm(cwForm, params, cwForm.getEntityModel());

          }

          $scope.caliopeForm   = cwForm;
          if( preLoadFunction !== undefined ) {
            preLoadFunction(cwForm);
          }

          cwFormService.loadForm(cwForm, params).then(function(result) {
            processResultLoadForm(cwForm, result, $scope, postLoadFunction);
            if( cwForm.getGenericForm() === true ) {
              $scope.entityModel = params.formId;
            }
          });
        }

        /**
         * If the attribute fromRouteparams is true then replace variables with values from routing.
         */
        if( $attrs['fromRouteparams'] !== undefined &&
            $attrs['fromRouteparams'] === "true") {
          entity = $routeParams.entity;
          mode = $routeParams.mode;
          uuid = $routeParams.uuid;
        }

        if($attrs['encUuid']==="true") {
          //TODO: Create centralized function to encode and decode uuid
          if( uuid !== undefined ) {
            var bytesUUID = Crypto.util.base64ToBytes(uuid);
            uuid = Crypto.charenc.Binary.bytesToString(bytesUUID);
          }
        }
        /*
        Create the form of type CaliopeWebForm
         */
        var cwForm = cwFormService.createForm(entity, mode, uuid);

        if( generic === true || generic === "true") {
          cwForm.setGenericForm(true);
        } else {
          cwForm.setGenericForm(false);
        }
        if( inner === true || inner === "true") {
          cwForm.setInnerForm(true);
        } else {
          cwForm.setInnerForm(false);
        }

        $scope['cwForm-name'] = 'cwForm-'.concat(name);
        $scope['cwForm-varTemplate'] = $attrs.cwDform;
        $scope[$scope['cwForm-name']] = cwForm;

        if(preLoadFunction !== undefined && preLoadFunction.length > 0) {
          preLoadFunction = $scope[preLoadFunction];
        }
        if(postLoadFunction !== undefined && postLoadFunction.length > 0) {
          postLoadFunction = $scope[postLoadFunction];
        }

        $scope.init = function() {
          init(preLoadFunction);
        };

        if( initForm === true || initForm === "true" ) {
          init(preLoadFunction);
        }


        function completeChange(scopeForm, name) {
          console.log('completeChange', $scope.$id, name);
          /*
           Delegate the change to the scope container of cw-form.
           */
          if($scope.change !== undefined && typeof $scope.change === 'function') {
            $scope.change(cwForm, scopeForm, name);
          } else {
            cwFormNotif.sendChange(cwForm, scopeForm, name);
          }
        }

        /**
         * Watch the change for attribute indicate in attribute cw-dform
         * an update the form generated by Dform
         *
         * @callback Directive:cwDform
         * @inner
         */
        $scope.$watch($attrs.cwDform, function (value) {
          if (value !== undefined && $attrs.ngShow !== "false" ) {

            console.log(" caliopeweb-form-directives 310 Json to render " + $attrs.cwDform, value);
            renderDForm(value);


            if($scope.elementsFormTemplate !== undefined) {
              var scopeForm = $element.find('form').scope();


              scopeForm.changeInNotSrv = {};

              /*
               Event function for onUpdateFormField. This is invoked when the server send a
               notification and the service notification propagate the notification from rootScope to children's scope
               */
              $scope.$on('updateFormField', function (event, data) {
                if( data.uuid === $scope.modelUUID ) {
                  scopeForm.changeInNotSrv[data.field] = true;
                  $scope.$apply(function () {
                    scopeForm[data.field] = data.value;
                  });
                }
              });

              /*
                Event function for onUpdateFormRelation. This is invoked when the server send a
                notification and the service notification propagate the notification from rootScope to children's scope
               */
              $scope.$on('updateFormRelation', function (event, data) {
                if( data.uuid === $scope.modelUUID ) {
                  var scopeInnerForm = $element.find("[name='".concat(data.rel_name).concat("']")).scope();
                  if( scopeInnerForm !== undefined ) {
                    scopeInnerForm.addInnerForm('edit', data.target_uuid);
                    scopeInnerForm.$apply();
                  }
                }
              });


              scopeForm.changeInInput = {};

              /**
               * Function to process the event changeInput define with ng-change directive.
               * @param name Name of the input changed. Directive was defined with changeInInput(elementName)
               */
              scopeForm.changeInput = function change(name) {
                var results = cwForm.validateElementRestrictions(name, scopeForm, cwForm);
                var errors = false;
                var elementsDependentsChange = {};
                angular.forEach(results, function(vResultRestr){
                  if( vResultRestr.result === false ) {

                    if( name === vResultRestr.nameElement ) {
                      errors = true;
                    }
                    scopeForm[cwForm.getFormName()][vResultRestr.nameElement].$setValidity(vResultRestr.validationType, false);
                    scopeForm[cwForm.getFormName()].$setValidity(vResultRestr.validationType, false);
                    if( vResultRestr.nameElement !== name ) {
                      elementsDependentsChange[vResultRestr.nameElement] = false;
                    }
                  } else {
                    if( elementsDependentsChange[vResultRestr.nameElement] !== false &&
                        scopeForm[cwForm.getFormName()][vResultRestr.nameElement].$dirty === true &&
                        scopeForm[cwForm.getFormName()][vResultRestr.nameElement].$error[vResultRestr.validationType] === true &&
                        vResultRestr.nameElement !== name ) {

                      elementsDependentsChange[vResultRestr.nameElement] = true;

                    }
                    scopeForm[cwForm.getFormName()][vResultRestr.nameElement].$setValidity(vResultRestr.validationType, true);
                    scopeForm[cwForm.getFormName()].$setValidity(vResultRestr.validationType, true);
                  }
                  /*
                  Select the container (div) of errors messages
                   */
                  var elementDivMsg = $element.find(
                      "[name='".concat(vResultRestr.nameElement).concat("'] ~").
                          concat("[validation-type='").concat(vResultRestr.validationType).concat("']")
                  );
                  if(elementDivMsg !== undefined) {
                    var eleMsg = elementDivMsg.find("[ng-show=true]");
                    if( eleMsg !== undefined ) {
                      eleMsg.empty();
                      eleMsg.append(vResultRestr.msg);
                    }
                  }
                });

                /**
                 * Send change for element change
                 */
                if( errors === false ) {
                  scopeForm.changeInInput[name] = true;
                  completeChange(scopeForm, name);
                }

                /**
                 * Send change for elements dependents
                 */
                angular.forEach(elementsDependentsChange, function(vElementChange, kElementChange){
                  if( vElementChange === true ) {
                    completeChange(scopeForm, kElementChange);
                  }
                });
              };

              /*
              Create the watch for element that not support the ng-change directive
               */
              angular.forEach(cwForm.getElements(), function(vElement){
                if( vElement.type === 'datepicker' || vElement.typeo === 'datepicker') {
                  scopeForm.$watch(vElement.name, function(newValue){
                    if( newValue !== undefined ) {
                      if(scopeForm.changeInInput[vElement.name] !== true && scopeForm.changeInNotSrv[vElement.name] !== true) {
                        completeChange(scopeForm, vElement.name);
                      } else {
                        delete scopeForm.changeInInput[vElement.name];
                        delete scopeForm.changeInNotSrv[vElement.name];
                      }
                    }
                  });
                }
              });

            }


            /**
             * Aditional process for inner forms
             */
            if( cwForm.getInnerForm() ) {

              /**
               * Add the button remove. If cwForm is inner form then
               */
              var elementTitle = $element.find('form').find("[name='title']").children();
              elementTitle.empty();
              var elementBtnDelete = ' <span ng-click="removeInnerForm('.
                  concat("'").concat($attrs.name).concat("'").concat(')"').
                  concat('><i tooltip="Eliminar" tooltip-placement="right" class="icon-remove"></i></button>');
              //var elementBtnDelete = '<button name="btn-remove" class="btn btn-mini btn-title" type="button" ng-disabled="disabledAdd" ng-click="removeInnerForm()">Eliminar</button>'
              elementTitle.append(elementBtnDelete);
              $compile(elementTitle.contents())($scope);

              /*
               Add cwForm to innerForm and call create relation with parent
               */
              if ( $scope.$parent.innerForms !== undefined ) {
                var i = $attrs.name;
                if ($scope.$parent.innerForms[i].templateName === $attrs.cwDform) {
                  $scope.$parent.innerForms[i].cwForm = cwForm;
                  var cwFormParentName = $scope.$parent.$parent['cwForm-name'];
                  $scope.$parent.innerForms[i].cwFormParent = $scope.$parent.$parent[cwFormParentName];
                  if( mode === 'create' ) {
                    $scope.$parent.innerForms[i].createRelationParent($scope.$parent.$parent[cwFormParentName], cwForm);
                  }
                }

              }

            }
          }
        });
      }
    };


  }]);


  /**
   * @ngdoc directive
   * @name cw.directive:cwFormInner
   * @restrict E
   * @replace true
   *
   * @description
   * Define the directive for add validation message to forms. This use template define in
   * 'caliopeweb-forms/caliopeweb-valmess-partial.html'
   *
   *
   */
  moduleDirectives.directive('cwFormInner',['$compile', 'caliopeWebFormNotification',
    function ($compile, cwFormNotif) {


    /**
     * Define the function for link the directive to AngularJS Context.
     */
    var directiveDefinitionObject = {
      restrict : 'E',
      replace : false,
      templateUrl: 'caliopeweb-forms/caliopeweb-cwforminner-partial-directive.html',
      //controller: 'CaliopeWebTemplateCtrl',
      scope: true,
      link: function ($scope, $element, $attrs) {

        $scope.innerForms = {};
        var totalIF = 0;

        /*
         Var definition
         */
        var name = $attrs['name'];
        var entity = $attrs['entity'];
        var modeParent = $scope.$parent[$scope.$parent['cwForm-name']].getMode();
        var uuid = $attrs['uuid'];
        var generic = $attrs['generic'] === "true" ? true : $attrs['generic'];

        var cardinality = $attrs['cardinality'];
        if( cardinality === '*' ) {
          cardinality = Infinity
        } else if(parseInt(cardinality) >= 0) {
          cardinality = parseInt(cardinality);
        } else {
          cardinality = 0;
        }

        var createRelationParent = function (cwFormParent, cwFormInner) {
          var data = {};
          data[$attrs.name] = [{'uuid' : cwFormInner.getModelUUID()}];
          cwFormNotif.sendChange(cwFormParent, data, $attrs.name)
        };

        var deleteRelationParent = function(cwFormParent, cwFormInner) {
          var data = {};
          data[$attrs.name] = [{'uuid' : cwFormInner.getModelUUID()}];
          cwFormNotif.sendDelete(cwFormParent, data, $attrs.name)
        };

        function createInnerForm(name, index, mode, uuid) {
          return {
            name : name,
            nameField : $attrs['name'],
            index : index,
            entity : entity,
            mode : mode,
            uuid : uuid,
            generic : generic,
            templateName : 'jsonTemplate_'.concat(name),
            cwForm : {},
            cwFormParent : {},
            createRelationParent: createRelationParent
          };
        }

        $scope.addInnerForm = function(mode, uuid) {

          if( totalIF < cardinality || cardinality === 0 ) {
            if( mode === undefined ) {
              mode = modeParent;
            }

            var index = totalIF;
            var nameIF = name.concat(index);
            var innerForm = createInnerForm(nameIF, index, mode, uuid);
            $scope.innerForms[innerForm.name] = innerForm;
            totalIF++;
          } else {
            //TODO: Crear una notificación de mensaje para el usuario
            console.log('No se pueden crear más formularios para ' + name + '. Máximo posible:' + cardinality);
          }
        };

        $scope.removeInnerForm = function(name) {
          deleteRelationParent($scope.innerForms[name].cwFormParent, $scope.innerForms[name].cwForm);
          delete $scope.innerForms[name];
          totalIF--;
        };

        /*
          Code associate to link function directive.
         */

        /*
          Init the state of buttons
        */
        $scope.disabledAdd = false;
        $scope.showBtns = false;
        $scope.showForm = true;

        var innerFormData = $scope.$parent[name];
        if( innerFormData !== undefined && innerFormData.length > 0 ) {
          angular.forEach(innerFormData, function() {
            $scope.addInnerForm();
          });
        } else {
          if( cardinality > 0 ) {
            $scope.addInnerForm('create');
          }
        }


        /*
          Find the button 'btn-add'
        */
        var elemBtn = $element.find("[name='btn-add']");
        /*
          Find the element with tag label in parent and move to container  'container-title' before of 'btn-add'
         */
        var eleLab = $element.prev();
        elemBtn.append('+ ');
        elemBtn.append(eleLab.contents());
      }
    };

    return directiveDefinitionObject;
  }]);

  /**
   * @ngdoc directive
   * @name cw.directive:cwValidationMess
   * @restrict E
   * @replace true
   *
   * @description
   * Define the directive for add validation message to forms. This use template define in
   * 'caliopeweb-forms/caliopeweb-valmess-partial.html'
   *
   *
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
        if( attrs.restriction === 'true' ) {
          scope.validationType = 'restriction'
        }
        $compile(element.contents())(scope);
        var stParams = attrs.params;
        if( stParams !== undefined ) {
          var params = stParams.split("|");
          var i;
          for( i=0; i<params.length; i++) {
            scope['param'.concat(i.toString())] = params[i];
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
  moduleDirectives.directive('cwOptions', [
    'caliopewebTemplateSrv', "$compile", "toolservices",
    function (caliopewebTemplateSrv, $compile, tools) {

    var ATTNAME_LOADREMOTE = 'fromserver';
    var ATTNAME_METHOD = 'method';
    var ATTNAME_FIELDVALUE = 'fieldvalue';
    var ATTNAME_FIELDDESC = 'fielddesc';
    var ATTNAME_FIELDID = 'formid';
    var ATTNAME_FIELD_DATALIST = 'fieldDatalist';
    var ATTNAME_OPTIONSNAME = 'optionsName';
    var ATTNAME_OPTIONS_STATIC = 'optionsStatic';

    /**
    * Define the function for link the directive to AngularJS Context.
    */
    var directiveDefinitionObject = {

      restrict : 'A',
      replace : false,
      scope: false,
      link: function ($scope, $element, $attrs) {

        if( $attrs[ATTNAME_LOADREMOTE] !== undefined && $attrs[ATTNAME_LOADREMOTE] === 'true') {

          var fieldId = $attrs[ATTNAME_FIELDID];
          var promise =
          caliopewebTemplateSrv.loadDataOptions($attrs[ATTNAME_METHOD], fieldId, undefined);

          promise.then(function(dataResponse) {


            if( dataResponse !== undefined ) {
              var i;
              var attrFieldValue = $attrs[ATTNAME_FIELDVALUE];
              var attrFieldDesc = $attrs[ATTNAME_FIELDDESC];
              if($attrs[ATTNAME_FIELD_DATALIST] !== undefined) {
                dataResponse =
                    tools.getValueAttInObject(dataResponse, $attrs[ATTNAME_FIELD_DATALIST], '.');
              }

              var scopeOptionsName = $attrs[ATTNAME_OPTIONSNAME];
              if( scopeOptionsName !== undefined ) {
                $scope[scopeOptionsName] = [];
                for(i=0; i<dataResponse.length; i++) {
                  var option = {
                    value : tools.getValueAttInObject(dataResponse[i], attrFieldValue, '.'),
                    label  : tools.getValueAttInObject(dataResponse[i], attrFieldDesc, '.')
                  };
                  $scope[scopeOptionsName].push(option);
                }
              }

            }

            if($attrs.hasOwnProperty(ATTNAME_OPTIONS_STATIC) ) {
              var optionsStatic = JSON.parse($attrs[ATTNAME_OPTIONS_STATIC]);
              angular.forEach(optionsStatic, function(v,k){
                var option = {
                  value : k,
                  label : v
                };
                $scope[scopeOptionsName].push(option);
              });
            }
          });

        }
//        $compile($element.contents())($scope);
      }
    };

    return directiveDefinitionObject;
  }]);

  moduleDirectives.directive("uiMcomboChoices", ['caliopewebTemplateSrv', '$document', 'toolservices',
    function(caliopewebTemplateSrv, $document, tools){
    // simultaneously should not be two open items

      var openElement = null, close;
      var VAR_SCOPE_PUT_CHOICES_SELECTED = 'var_put_choices_selected';

      return {
        restrict: 'A',
        replace: true,
        templateUrl: 'caliopeweb-forms/caliopeweb-mcombo-partial-directive.html',
        scope: true,
        controller: ['$scope', '$filter', '$attrs', function($scope, $filter, $attrs) {
          $scope._searchElem = null;
          $scope.filteredChoices = function() {
            var filtered = $filter('filter')($scope._choices, $scope._search);
            return $filter('orderBy')(filtered, 'text');
          };

          $scope.moveToSelected = function(choice, $event) {
            if(!$attrs.single ){
              $scope._selectedChoices.push(choice);
              $scope._choices.splice($scope._choices.indexOf(choice), 1);

              /**
               * Send notification change
               * If exist change function in scope then use this function, else, send the change
               * from this point
               */
              if( typeof $scope.change === 'function') {
                var cwFormName = $scope.$parent.$parent['cwForm-name'];
                $scope.change($scope.$parent.$parent[cwFormName], $scope.$parent, $attrs.name, choice);
              } else {
                //TODO Send Change
              }
              // do not 'close' on choice click
            } else if ($attrs.single && ($scope._selectedChoices.length < 1)){
              $scope._selectedChoices.push(choice);
              $scope._choices.splice($scope._choices.indexOf(choice), 1);
            }
            $scope._search='';
            $scope._searchElem.focus();
            $event.preventDefault();
            $event.stopPropagation();
          };

          $scope.removeFromSelected = function(choice) {
            $scope._choices.push(choice);
            $scope._selectedChoices.splice($scope._selectedChoices.indexOf(choice), 1);
            $scope._searchElem.focus();

            /**
             * Send notification remove
             * If exist change function in scope then use this function, else, send the change
             * from this point
             */
            if( typeof $scope.sendDelete === 'function') {
              var cwFormName = $scope.$parent.$parent['cwForm-name'];
              $scope.sendDelete($scope.$parent.$parent[cwFormName], $scope.$parent, $attrs.name, choice);
            } else {
              //TODO Send Delete
            }
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

            var ATTNAME_METHOD         = 'method';
            var ATTNAME_FIELDVALUE     = 'fieldvalue';
            var ATTNAME_FIELDDESC      = 'fielddesc';
            var ATTNAME_FIELIMAGE      = 'fieldimage';
            var ATTNAME_FIELDID        = 'formid';
            var ATTNAME_FIELD_DATALIST = 'fieldDatalist';

            var promise = caliopewebTemplateSrv.loadDataOptions(attrs[ATTNAME_METHOD],
                    attrs[ATTNAME_FIELDID], undefined);

            /*
            This var is to storage the name of the var in the scope to storage the result
            of items choices
            */
            scope[VAR_SCOPE_PUT_CHOICES_SELECTED] = attrs['name'];

            /**
             * When promise is resolve then push the options in ng-model of multichoice
             *
             */
            promise.then(function(dataResponse) {

              if( dataResponse !== undefined ) {

                var i;
                var attrFieldValue = attrs[ATTNAME_FIELDVALUE];
                var attrFieldDesc  = attrs[ATTNAME_FIELDDESC];
                var attrFieldImage = attrs[ATTNAME_FIELIMAGE];
                if(attrs[ATTNAME_FIELD_DATALIST] !== undefined) {
                  dataResponse =
                      tools.getValueAttInObject(dataResponse, attrs[ATTNAME_FIELD_DATALIST], '.');
                }

                var scopeMultiComboChoices = '_choices';
                var scopeMultiComboSelected = '_selectedChoices';

                scope[scopeMultiComboChoices] = [];
                scope[scopeMultiComboSelected] = [];
                for(i=0; i<dataResponse.length; i++) {
                  var option = {value : {}};
                  if( attrFieldValue !== undefined ) {
                    option.value[attrFieldValue] = tools.getValueAttInObject(dataResponse[i], attrFieldValue, '.');
                    option[attrFieldValue] = option.value[attrFieldValue];
                  } else {
                    throw new Error("Field value in multi-combo-choices element with name " + attrs['name'] + ", wasn't specific.");
                  }
                  if( attrFieldDesc !== undefined) {
                    option.text = tools.getValueAttInObject(dataResponse[i], attrFieldDesc, '.');
                  } else {
                    throw new Error("Field description in multi-combo-choices element with name " + attrs['name'] + ", wasn't specific.");
                  }
                  if( attrFieldImage !== undefined) {
                    option.image = tools.getValueAttInObject(dataResponse[i], attrFieldImage, '.');
                  }
                  scope[scopeMultiComboChoices].push(option);
                }
              }

              /*
              Code for load selected choices from server to componente ui-mcombo-choices and
              remove selected choices.
              */

              var selectedChoices  = scope[attrs['name']];
              var scopeMultiComboChoicesTmp = scope[scopeMultiComboChoices];
              if( selectedChoices !== undefined ) {
                if( selectedChoices.hasOwnProperty('direction') && selectedChoices.hasOwnProperty('target') &&
                    selectedChoices.target.length > 0) {

                  var selectedChoicesInTaget = [];
                  angular.forEach(selectedChoices.target, function(vSelChoicesTarget){
                    selectedChoicesInTaget.push(vSelChoicesTarget.entity_data);
                  });
                  selectedChoices = selectedChoicesInTaget;
                }
                for(i=0; i < selectedChoices.length; i++ ) {
                  var valueChoice = selectedChoices[i];
                  if( valueChoice !== undefined ) {
                    var j;
                    var objChoice = undefined;
                    for(j=0; j < scope[scopeMultiComboChoices].length; j++ ) {
                      if( scope[scopeMultiComboChoices][j] !== undefined ) {

                        if(scope[scopeMultiComboChoices][j].value[attrFieldValue] === valueChoice[attrFieldValue]) {
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

  /**
   * @ngdoc directive
   * @name cw.directive:cwValidationMess
   * @restrict E
   * @replace true
   *
   * @description
   * Define the directive for add validation message to forms. This use template define in
   * 'caliopeweb-forms/caliopeweb-valmess-partial.html'
   *
   *
   */
  moduleDirectives.directive('cwGrid',['caliopewebGridSrv', '$compile', function (cwGridService, $compile) {

    /**
     * Define the function for link the directive to AngularJS Context.
     */
    var directiveDefinitionObject = {
      restrict : 'E',
      replace : false,
      template : '<div></div>',
      /**
       *
       * @param $scope
       * @param $attrs
       * @param $element
       */
      controller : function($scope, $attrs, $element) {

        if($element.data() !== undefined) {
          angular.forEach($element.data(), function(v,k){
            $attrs.$set(k,v);
          });
        }

        var gridName = $attrs['name'];
        var method = $attrs['method'];
        if( gridName === undefined ) {
          gridName = 'cwGrid';
        }

        var gridOptionsName = gridName.concat('options');

        $scope[gridOptionsName] = {
          data: 'data'.concat(gridName),
          columnDefs: 'columnDefs'.concat(gridName)
        };
        var gridOptions;
        try {
          gridOptions = angular.fromJson($attrs.gridOptions);
          angular.extend($scope[gridOptionsName], gridOptions);
        } catch (ex) {
          throw Error('Error parsing attribute grid-option of directive cw-grid. '+ ex.message)
        }

        if($attrs.hasOwnProperty('columns')){
          try {
            var colsDefs = JSON.parse($attrs.columns);

            $scope['data'.concat(gridName)] = [];
            $scope['columnDefs'.concat(gridName)] = colsDefs;

            if( angular.isArray($scope[$attrs.name]) && $scope[$attrs.name].length > 0 ) {
              $scope['data'.concat(gridName)] = $scope['data'.concat(gridName)].concat($scope[$attrs.name]);
            }
          } catch (ex) {
            console.log('Error load columns from attribute columns. ' + ex)
          }
        }

        $element.children().attr('ng-grid', gridOptionsName);
        $scope[gridName] = cwGridService.createGrid(gridName, method, []);

        $compile($element.contents())($scope);
      },
      /**
       *
       * @param $scope
       * @param $element
       * @param $attrs
       */
      link: function ($scope, $element, $attrs) {

        var gridName = $attrs['name'];

        if( gridName === undefined ) {
          gridName = 'cwGrid';
        }

        $element.children().addClass($attrs['class']);
        var loadInit = $attrs['loadInit'];
        if( loadInit === 'true' ) {
          loadInit = true;
        } else {
          loadInit = false;
        }

        var dataGridNameSrv = "data_".concat(gridName);
        var dataGridNameGrid = "data".concat(gridName);
        $scope[gridName].setGridDataName(dataGridNameGrid);

        if( loadInit === true ) {
          $scope[dataGridNameSrv] = $scope[gridName].loadDataFromServer();
        }

        $scope.$watch(''.concat(dataGridNameSrv), function(dataGrid) {
          if( dataGrid !== undefined ) {
            $scope[gridName].addData(dataGrid);
            $scope[gridName].applyDecorators();
            var structureToRender = $scope[gridName].createStructureToRender();
            $scope['data'.concat(gridName)] = structureToRender.data;
            $scope['columnDefs'.concat(gridName)] = structureToRender.columnsDef;
          }
        });

        $scope.addRow = function() {
          if($scope['data'.concat(gridName)] == undefined) {
            $scope['data'.concat(gridName)] = [];
          }
          $scope['data'.concat(gridName)].push({});
        };

        $scope.removeRow = function(row) {
          if($scope['data'.concat(gridName)] !== undefined) {
            $scope['data'.concat(gridName)].splice(row.rowIndex,1);
          }
        }

      }
    };

    return directiveDefinitionObject;
  }]);

  /**
   * @ngdoc directive
   * @name cw.directive:cwValidationMess
   * @restrict E
   * @replace true
   *
   * @description
   * Define the directive for add validation message to forms. This use template define in
   * 'caliopeweb-forms/caliopeweb-valmess-partial.html'
   *
   *
   */
  moduleDirectives.directive('cwGridInForm',[function () {

    /**
     * Define the function for link the directive to AngularJS Context.
     */
    var directiveDefinitionObject = {
      restrict : 'E',
      replace : true,
      templateUrl : 'caliopeweb-forms/caliopeweb-cwgridform-partial-directive.html',
      /**
       *
       * @param $scope
       * @param $attrs
       * @param $element
       */
      controller : function($scope, $attrs, $element) {
        var eCwGrid = $element.find('cw-grid');
        if(eCwGrid !== undefined) {

          if($attrs.columns !== undefined) {
            try {
              var columns = JSON.parse($attrs.columns);
              var colsDef = [];
              angular.forEach(columns, function(v){
                var colDef = {
                  'field'               : v.name,
                  'displayName'         : v.caption,
                  "cellClass"           : "cell-center",
                  'cellTempalte'        : v.cellTempalte,
                  'headerCellTemplate'  : v.headerCellTemplate
                };
                colsDef.push(colDef);
              });
              if(colsDef.length > 0) {
                colsDef.push({
                  "name"                : 'Acciones',
                  "cellClass"           : "cell-center",
                  "headerCellTemplate"  : '<span ng-click="addRow()">' +
                      '<i tooltip="Agregar Fila" tooltip-placement="right" class="icon-plus"></i>' +
                      '</span>',
                  "cellTemplate"        : '<span ng-click="removeRow(row)">' +
                      '<i tooltip="Eliminar Fila" tooltip-placement="right"  class="icon-remove"></i>' +
                      '</span>',
                  "enableCellEdit"      : false
                });
                $attrs.$set('columns', JSON.stringify(colsDef));
              }
            } catch (ex) {
              console.log('Error load columns from attribute columns. ' + ex)
            }
          }
          eCwGrid.data('name', $attrs.name);
          eCwGrid.data('columns', $attrs.columns);
          eCwGrid.children().addClass($attrs.class);


        }

      }
    };

    return directiveDefinitionObject;
  }]);

  /**
   * @ngdoc directive
   * @name cw.directive:cwValidationMess
   * @restrict E
   * @replace true
   *
   * @description
   * Define the directive for add validation message to forms. This use template define in
   * 'caliopeweb-forms/caliopeweb-valmess-partial.html'
   *
   *
   */
  moduleDirectives.directive('cwAction',[function () {
    /**
     * Define the function for link the directive to AngularJS Context.
     */
    return {
      restrict : 'E',
      replace : true,
      template : '<button type="button"></button>',
      /**
       *
       * @param $scope
       * @param $element
       * @param $attrs
       */
      link: function ($scope, $element, $attrs) {
        $element.append($attrs.title);
      }


    };

  }]);

});
