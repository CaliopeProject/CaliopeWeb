/*jslint browser: true*/
/*global define, console, $*/

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
define(['angular', 'dform', 'Crypto'], function (angular) {
  'use strict';

  /**
   * Define a module for add the angularjs directives of CaliopeWebForm
   * @memberOf CaliopeWebFormDirectives
   * @type {module}
   */
  var moduleDirectives = angular.module('CaliopeWebFormDirectives', []);

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
  moduleDirectives.directive('cwDform',['$compile','$routeParams','caliopewebTemplateSrv',
    function ($compile, $routeParams, cwFormService) {

    /**
     * Define the properties of directive. This define:<br/>
     * <ul>
     *  <li>The scope not is override</li>
     *  <li>Link function</li>
     * </ul>
     *
     * @member  directiveDefinitionObject
     * @memberOf Directive:cwDform
     *
    */
    var directiveDefinitionObject = {

      controller : function($scope, $attrs, $element) {

        var entity = $attrs['entity'];
        var mode = $attrs['mode'];
        var uuid = $attrs['uuid'];
        var name = $attrs['name'];


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
        $scope['cwForm-name'] = 'cwForm-'.concat(name);
        $scope[$scope['cwForm-name']] = cwForm;
      },

      /**
       * Link function of the directive. This get the directive element and call the
       * Jquery Dform library to render the form.
       * @function link
       * @memberOf Directive:cwDform
       * @param {object} scope AngularJS scope of the directive
       * @param {object} element Element that contains the directive definition
       * @param {object} attrs Attributes in tag that contains the directive.
       */
      link: function (scope, element, attrs) {

        /**
         * Function that render the form with Jquery dForm. Also compile the DOM generate by
         * dForm in order to angularjs note the directives includes in the DOM
         * @function
         * @param {object} templateData Json Template to render. The Json must be in dForm syntax.
         * @memberOf Directive:cwDform
         * @inner
         */
        function renderDForm(templateData) {
          //var plantilla = JSON.parse(templateData);
          var plantilla = templateData;
          try {
            $.dform.options.prefix = null;
            $(element).dform(plantilla);
          } catch (exDform) {
            console.log('Error generating the dynamic form with dForm' +  exDform.message + exDform );
          }
          try {
            $compile(element.contents())(scope);
          } catch (exCom) {
            console.log('Error compiling form generated' +  exCom.message);
          }
        }

        /*
        */
        /**
         * Watch the change for attribute indicate in attribute cw-dform
         * an update the form generated by Dform
         *
         * @callback Directive:cwDform
         * @inner
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
                    tools.getValueAttInObject(dataResponse, attrs[ATTNAME_FIELD_DATALIST], '.');
              }

              var scopeOptionsName = attrs[ATTNAME_OPTIONSNAME];
              if( scopeOptionsName !== undefined ) {
                scope[scopeOptionsName] = [];
                for(i=0; i<dataResponse.length; i++) {
                  var option = {
                    value : tools.getValueAttInObject(dataResponse[i], attrFieldValue, '.'),
                    label  : tools.getValueAttInObject(dataResponse[i], attrFieldDesc, '.')
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
              // do not 'close' on choice click
            }else if ($attrs.single && ($scope._selectedChoices.length < 1)){
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
                  option.value[attrFieldValue] = tools.getValueAttInObject(dataResponse[i], attrFieldValue, '.');
                  option.text = tools.getValueAttInObject(dataResponse[i], attrFieldDesc, '.');
                  option.image = tools.getValueAttInObject(dataResponse[i], attrFieldDesc, '.');
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
            var reg={};

            $scope['data'.concat(gridName)] = [];
            $scope['data'.concat(gridName)].push(reg);
            $scope['columnDefs'.concat(gridName)] = colsDefs;

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

        var gridOptionsName = gridName.concat('options');
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
  moduleDirectives.directive('cwGridInForm',['caliopewebGridSrv', '$compile', function (cwGridService, $compile) {

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
       */
      controller : function($scope, $attrs, $element) {
        var eCwGrid = $element.find('cw-grid');
        if(eCwGrid !== undefined) {

          if($attrs.columns !== undefined) {
            try {
              var columns = JSON.parse($attrs.columns);
              var colsDef = [];
              angular.forEach(columns, function(v,k){
                var colDef = {
                  'field'               : v.name,
                  'displayName'         : v.caption,
                  "cellClass"           : "cell-center",
                  'cellTempalte'        : v.cellTempalte,
                  'headerCellTemplate'  : v.headerCellTemplate
                }
                colsDef.push(colDef);
              });
              if(colsDef.length > 0) {
                colsDef.push({
                  "name"                : 'Acciones',
                  "cellClass"           : "cell-center",
                  "headerCellTemplate"  : '<span ng-click="addRow()"><i tooltip="Agregar Fila" tooltip-placement="right" class="icon-plus"></i></button>',
                  "cellTemplate"        : '<span ng-click="removeRow(row)"><i tooltip="Eliminar Fila" tooltip-placement="right"  class="icon-remove"></i></button>',
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
  moduleDirectives.directive('cwAction',['$compile', function ($compile) {

    /**
     * Define the function for link the directive to AngularJS Context.
     */
    var directiveDefinitionObject = {
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
        console.log('scope.id directive', $scope.$id);
        $element.append($attrs.title);

        var varShowScopeName = 'show_' + $attrs.name;
        $element.attr('ng-show', ''.concat(varShowScopeName).concat(''));
        var show = false;
        if( $attrs.ngShow === "true" ) {
          show = false;
        }
        $scope[varShowScopeName] = show;
        //$scope.$apply();

      }


    };

    return directiveDefinitionObject;
  }]);

});

