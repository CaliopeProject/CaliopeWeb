
var CaliopeWebFormConstants = {
  'rexp_value_in_form' : "^{{2}[^{].*[^}]}{2}$",
  'rexp_value_in_form_inrep' : "^{{2}",
  'rexp_value_in_form_firep' : "}{2}$"
};


/**
 * Constructor not execute functionality associate to initialize variables, this is the constructor by default.
 * @class CaliopeWebForm
 * @classdesc  This represent the form object in presentation layer. The
 * representation of structure to render is specific to render the form with library
 * Jquery Dform, additionally the structure to render is generated for support Angular JS.
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
var CaliopeWebForm = (function() {

  /**
   * Name  form
   * @member {string} formName
   * @memberOf CaliopeWebForm
   *
   */
    var formName;
  /**
   * Identifier of data corresponding to the form
   * @member {string} modelUUID
   * @memberOf CaliopeWebForm
   */
    var modelUUID;
  /**
   * Structure in JSON format with dform syntax. This store the original structure retrieved
   * from the server.
   * @member {object} structure
   * @memberOf CaliopeWebForm
   */
    var structure;
  /**
   * Data associated to the form, this is retrieved from the server.
   * @member {object} data
   * @memberOf CaliopeWebForm
   *
   */
    var data;
  /**
   * Potential actions  form, this is retrieved from the server.
   * @member {object} actions
   * @memberOf CaliopeWebForm
   *
   */
    var actions;

  /**
   * Action to render/show in the form
   * @member {Array} actions
   * @memberOf CaliopeWebForm
   */
    var actionsToShow;
  /**
   * Translations for the label inputs in the form.
   * @member {object} translations
   * @memberOf CaliopeWebForm
   *
   */
    var translations;
  /**
   * Store the structure to render with dform
   * @member {object} structureToRender
   * @memberOf CaliopeWebForm
   *
   */
    var structureToRender;
  /**
   * Store the layout retrieved to the server.
   * @member {object} layout
   * @memberOf CaliopeWebForm
   *
   */
    var layout;
    /**
    * Contains the elements (inputs) of form
    * @member {object} elementsForm
    * @memberOf CaliopeWebForm
    *
    */
    var elementsForm;
    /**
    * Contains the elements (inputs) names.
    * @member {object} elementsFormName
    * @memberOf CaliopeWebForm
    *
    */
    var elementsFormName;

    /**
    * Entity or model represented in this form.
    * @member {object} entityModel
    * @memberOf CaliopeWebForm
    */
    var entityModel;

    /**
    * Mode to load data from server. Posibble modes are: toCreate, create, toEdit, edit
    * @member {object} entityModel
    * @memberOf CaliopeWebForm
    */
    var mode;

  /**
   * This function search all the elements that are presents in the form structure. This function
   * search in deep recursively. This is when in structure form a element contains a html
   * property
   * @function
   * @memberOf CaliopeWebForm
   * @param {object} structureForm Form structure in Json with syntax dform.
   * @returns {{elements: Array, elementsName: Array}} Elements contains all object elements find
   * in the structureForm and elementsName contains all names  elements in the structureForm
   */
    function searchElementsRecursive(structureForm) {
      var elements = [];
      var elementsName = [];
      if (structureForm.html !== undefined && structureForm.html.length > 0) {
        var resultElementsRec = searchElementsRecursive(structureForm.html);
        jQuery.merge(elements,resultElementsRec.elements);
        jQuery.merge(elementsName,resultElementsRec.elementsName);
      } else {
        var resultElements = searchElementsIndividual(structureForm);
        jQuery.merge(elements, resultElements.elements);
        jQuery.merge(elementsName, resultElements.elementsName);
      }
      return {
        'elements' : elements,
        'elementsName' : elementsName
      };
    }

  /**
   * This function search all the elements (inputs) presents in the html property.
   * @function
   * @memberOf CaliopeWebForm
   * @param {object} elementsAll All the Elements contents in the html property
   * @returns {{elements: *, elementsName: Array}}  Elements contains all object elements find
   * in the elementsAll and elementsName contains all names of the elements in the elementsAll
   */
    function searchElementsIndividual(elementsAll) {
      var elementsTypeName = [], i;

      var elementsType = jQuery.grep(elementsAll, function(obj) {
        /*TODO: Mejorar para que solo coincidan los elementos de cierto tipo. Por
         ejemplo aquellos que se renderizan como un input.
         */
        var isElementTypeInput = false;
        if( obj.type !== undefined ) {
          isElementTypeInput = true;
        }

        return isElementTypeInput;
      });

      for ( i = 0; i < elementsType.length; i++) {
        var name = elementsType[i].name;
        if( name === null ) {
          name = elementsType[i].id;
        }
        elementsTypeName.push(name);
      }

      return {
        'elements' : elementsType,
        'elementsName' : elementsTypeName
      };
    }

  /**
   * This function search all the elements that are presents in the _structure. This function
   * invoke the search elements recursive.
   * @function
   * @memberOf CaliopeWebForm
   * @param {object} _structure Json structure for search the elements
   * @returns {{elements: *, elementsName: *}}. Elements contains all object elements find
   * in the _structure and elementsName contains all names of the elements in the _structure
   */
    function searchElements(_structure) {
      var result = searchElementsRecursive(_structure);
      return {
        'elements' : result.elements,
        'elementsName' : result.elementsName
      };
    }

  /**
   * Constructor of CaliopeWebForm module
   * @memberOf CaliopeWebForm
   */
    var CaliopeWebForm = function(entityModel, mode, uuid) {

      this.entityModel = entityModel;
      this.mode = mode;
      this.modelUUID = uuid;
    };

    function dataToViewData(elements, dataFromServer) {
      /*
      - Si la data proveniente del servidor es nula entonces se retorna un objeto con el nombre
      de todas las propiedades y el valor en undefined
      - Si los elementos son nulos entonces se retorna undefined
       */

      var data;

      if(elements !== undefined) {
        data = {};
        jQuery.each(elements, function(key, value) {
          if( value.hasOwnProperty('name') ) {
            data[value.name] = dataFromServer[value.name];
            if( value.hasOwnProperty('relation') ) {
              data[value.name] = [];
              if( dataFromServer[value.name] !== undefined ) {
                jQuery.each(dataFromServer[value.name].target, function(targetKey, targetValue) {
                  if(targetValue.hasOwnProperty('entity_data')){
                    data[value.name].push( targetValue.entity_data );
                  }
                });
              }
            }
          };
        });
      }

      return data;
    };

    function dataToServerData(elements, dataFromView) {

      function getVarNameScopeFromFormRep(formRep) {
        return formRep.replace(new RegExp(CaliopeWebFormConstants.rexp_value_in_form_inrep),"").
            replace(new RegExp(CaliopeWebFormConstants.rexp_value_in_form_firep),"")
      }

      /*
        Si el parámetro dataFromView es undefined entonces se crea una estructura de datos
        que contiene los elementos y estos con valor null o undefined.

        Si los elementos son indefinidos entonces la estructura de datos será undefined
       */
      var data;


      if( elements !== undefined ) {
        data = {};
        //TODO: Verificar si aún se va a utilizar params to send.
        var paramsToSend = [];
        /*
         if( paramsToSend === undefined || paramsToSend === '' ) {
         paramsToSend = [];
         } else {
         paramsToSend = paramsToSend.split(',');
         }
         */

        for (i = 0; i < elements.length; i++) {
          if( paramsToSend.length === 0 || paramsToSend.indexOf(elements[i]) >= 0 ) {
            var nameVarScope = elements[i].name;
            var value;
            if( dataFromView[nameVarScope] !== undefined ) {
              if(elements[i].type === 'div' && elements[i].type1 === 'datepicker') {
                value = (dataFromView[nameVarScope] instanceof Date )? dataFromView[nameVarScope].toJSON() : dataFromView[nameVarScope] ;
              } else if(elements[i].type === 'select') {
                value = dataFromView[nameVarScope];
              } else if(elements[i].type === 'ui-mcombo-choices' && elements[i].type1 === 'multi-choices') {
                if(dataFromView[nameVarScope] instanceof Array) {
                  var j;
                  value = [];
                  for( j=0; j<dataFromView[nameVarScope].length; j++) {
                    if( dataFromView[nameVarScope][j].value !== undefined) {
                      //value = value.concat(dataFromView[nameVarScope].value);
                      value.push(dataFromView[nameVarScope][j].value);
                    }
                  }
                }
              } else if(elements[i].type === 'cw-grid-in-form' && elements[i].typeo === 'cw-grid') {
                value = dataFromView[dataFromView[nameVarScope].gridDataName];
              }
              else {
                value = dataFromView[nameVarScope];
              }
              if(elements[i].hasOwnProperty('relation')) {
                /*
                  Evaluate if value is a relation. True then create value with only value of
                  entity_data in relation
                */
                if(value.hasOwnProperty('direction') && value.hasOwnProperty('target')) {
                  var cValue = {}
                  jQuery.extend(true, cValue, value);
                  value = [];
                  jQuery.each(cValue.target, function(k,v) {
                    if(v.hasOwnProperty('entity_data')) {
                      value.push(v.entity_data);
                    }
                  });
                }
                var patt = new RegExp(CaliopeWebFormConstants.rexp_value_in_form);
                var relation = elements[i].relation;
                var oTarget = elements[i].relation.target;
                if( oTarget !== undefined ) {
                  //var ownRelation = elements[i].name;
                  var target = [];

                  if( value !== undefined) {
                    if( value instanceof Array) {
                    } else {
                      value = [value];
                    }
                  }

                  jQuery.each(value, function(kRel, vRel){
                    var cTarget = {};
                    jQuery.extend(true, cTarget, oTarget);
                    if(patt.test(oTarget.entity)) {
                      var vPropScope = getVarNameScopeFromFormRep(oTarget.entity);
                      cTarget.entity = dataFromView[vPropScope];
                    }
                    jQuery.each(oTarget.properties, function(kProp, vProp){
                      if(patt.test(vProp)) {
                        var vPropScope = getVarNameScopeFromFormRep(vProp);
                        if(vPropScope === elements[i].name ) {
                          cTarget.properties[kProp] = vRel;
                        } else {
                          cTarget.properties[kProp] = dataFromView[vPropScope];
                        }
                      }
                    });
                    jQuery.each(oTarget['entity_data'], function(kProp, vProp){
                      if(patt.test(vProp)) {
                        var vPropScope = getVarNameScopeFromFormRep(vProp);
                        if(vPropScope === elements[i].name ) {
                          cTarget['entity_data'][kProp] = vRel[kProp];
                        } else {
                          cTarget['entity_data'][kProp] = getValueAttInObject(dataFromView, vPropScope, '.');
                          /*
                          if(dataFromView[vPropScope] instanceof Object) {
                            cTarget['entity_data'][kProp] = getValueAttInObject(dataFromView, vPropScope, '.');
                          } else if(dataFromView[vPropScope] instanceof Array) {
                            cTarget['entity_data'][kProp] = getValueAttInObject(dataFromView, vPropScope, '.')[kProp];
                          }
                          */
                        }
                      }
                    });
                    target.push(cTarget);
                  });
                  relation.target = target;
                  value = relation;
                }
              }
              data[nameVarScope] = value;
            }
          }
        }
      }

      return data;

    };

  /**
   * Prototype of CaliopeWebForms module
   * @type CaliopeWebForm
   */
  CaliopeWebForm.prototype = {
    /**
     * Constructor
     */
      constructor:  CaliopeWebForm,
    /**
     * Add the form structure retrieve from the server to the property structure. Also search
     * the elements (inputs) and elements names that contains the structure.
     * This structure is in JSON format and syntax jquery dform.
     * @function
     * @memberOf CaliopeWebForm
     * @param {object} _structure Structure of the form
     * @param {string} _formName Form Name
     */
      addStructure: function (_structure, _formName) {
        var result = searchElements(_structure);
        formName = _formName;
        elementsForm = result.elements;
        elementsFormName = result.elementsName;
        structure = _structure;
      },
    /**
     * Add the data to the data attribute and get the value of identifier of object data and
     * add the value to modelUUID attribute.
     * @function
     * @memberOf CaliopeWebForm
     * @param _data {object} Json Structure representing the data
     */
      addData: function(_data) {
        data = _data;
        if(_data !== undefined) {
          this.modelUUID = _data.uuid;
        }
      },
    /**
     * Add the actions structure to the actions attribute.
     * @function
     * @memberOf CaliopeWebForm
     * @param _actions {_object} Json structure representing the actions
     */
      addActions: function(_actions) {
        actions = _actions;
      },

    /**
     * Add the translations retrieve from the server to the translations attribute
     * @function
     * @memberOf CaliopeWebForm
     * @param _translations {object} Json structure representing the translations
     */
      addTranslations: function(_translations) {
        translations = _translations;
      },

    /**
     * Add the layout retrieve from the server to layout attribute
     * @function
     * @memberOf CaliopeWebForm
     * @param _layout {_object}  Json structure representing the layout
     */
      addlayout: function(_layout) {
         layout = _layout;
      },

    /**
     * Create the structure to render the form. When decorates are using, then the original
     * structure change
     *
     * @function
     * @memberOf CaliopeWebForm
     * @returns {object} The structure to render.
     */
      createStructureToRender : function() {
        structureToRender = structure;
        return structureToRender;
      },

    /**
     *
     */
    dataToViewData : function() {
      return dataToViewData(elementsForm, data);
    },

    /**
     *
     * @param dataFromView
     * @returns {*}
     */
    dataToServerData : function(dataFromView) {
      return dataToServerData(elementsForm, dataFromView);
    },

    /**
     * Get the actions added
     * @function
     * @memberOf CaliopeWebForm
     *
     * @returns {object}
     */
      getActions : function() {
        return actions;
      },

    /**
     * Get the columns to show
     * @function
     * @memberOf CaliopeWebForm
     *
     * @returns {Array}
     */
      getActionsToShow : function() {
        return actionsToShow;
      },

    /**
     *  Get the data added
     * @function
     * @memberOf CaliopeWebForm
     *
     * @returns {object}
     */
      getData : function() {
        return data;
      },

    /**
     * Get the elements (input) contains in the structure
     * @function
     * @memberOf CaliopeWebForm
     *
     * @returns {object}
     */
      getElements : function() {
        return elementsForm;
      },

    /**
     * Get the elements (input) contains in the structure
     * @function
     * @memberOf CaliopeWebForm
     *
     * @returns {object}
     */
      getEntityModel : function() {
        return this.entityModel;
      },

    /**
     * Get the layout contains in the structure
     * @function
     * @memberOf CaliopeWebForm
     *
     * @param {object} Layout
     */
      getlayout : function() {
         return layout;
      },
    /**
     * Get the names of the elements (inputs).
     * @function
     * @memberOf CaliopeWebForm
     *
     * @returns {object} Names of the elements contains in the json structure
     */
      getElementsName : function() {
        return elementsFormName;
      },
    /**
     * Get the name of the form.
     * @function
     * @memberOf CaliopeWebForm
     *
     * @returns {string}
     */
      getFormName : function() {
        return formName;
      },
    /**
     * Get the UUID or identifier of the data.
     * @function
     * @memberOf CaliopeWebForm
     *
     * @returns {string}
     */
      getModelUUID : function() {
        return this.modelUUID;
      },
    /**
     * Get the mode to render the form
     * @function
     * @memberOf CaliopeWebForm
     *
     * @returns {string}
     */
      getMode : function() {
        return this.mode;
      },
    /**
     * Put the data represented for data structure in a specific context.  The allocation
     * is made according to name of attributes presents in data attribute.
     *
     * @function
     * @memberOf CaliopeWebForm
     * @param context {object} Context to put the data
     * @param elements {object} Elements (inputs) in the structure
     */
      putDataToContext : function(context, elements) {

        if (data !== undefined) {
          var varname;
          for (varname in data) {
            if(data.hasOwnProperty(varname)) {
              context[varname] = data[varname];
            }
          }
        }
      },


    /**
     * Render the form using dForm in a element from HTML DOM
     * @function
     * @memberOf CaliopeWebForm
     * @param formDOMElement {object} Element html where the form will be render.
     * @todo Is necessary to be implement
     */
      render : function(formDOMElement) {
        //TODO: Determinar como se puede realizar el render de la forma sobre el DOM de la página.
      },

    /**
     * Set the actions to show in the form
     * @function
     * @memberOf CaliopeWebForm
     * @param _actionsMethodToShow {array} Add the actions to show in the form
     */
    setActionsMethodToShow : function(_actionsMethodToShow) {
      actionsToShow = _actionsMethodToShow;
    },

    /**
     * Set the value of entity model of the form
     * @function
     * @memberOf CaliopeWebForm
     * @param entityModel {String} Name of entity model
     */
    setEntityModel : function(entityModel) {
      this.entityModel = entityModel;
    },

    /**
     * Set the value of form mode
     * @function
     * @memberOf CaliopeWebForm
     * @param mode {string} Form mode
     */
    setMode : function(mode) {
      this.mode = mode;
    },

    /**
     * Set the value of uuid data form
     * @function
     * @memberOf CaliopeWebForm
     * @param modelUUID {string} UUID data form
     */
    setModelUUID : function(modelUUID) {
      this.modelUUID = modelUUID;
    },

    /**
     * Validate the form according to the validations presents in elements and validations structure.
     * @function
     * @memberOf CaliopeWebForm
     * @todo Is necessary to be implement
     */
      validate :function() {
        //TODO: Determinar como se puede realizar la validación de la forma.
      }

    };

    return CaliopeWebForm;

}());


/*
 TODO: Put this function for global use. Code in caliopeweb-form-directives.js
 */
/**
 * Get the final value of a attribute in a object. Attribute is represented by a string
 * notation that indicate the path to final attribute..
 *
 * @example
 * obj = { "user" : {
     *            "username" : {value : "username"},
     *            "name"  : {value : "NAME USER"}
     *          }
     *       }
 * attName = user.name.value
 * charSplitAttName = '.'
 *
 * Return "NAME USER"
 *
 * @memberOf commonServices
 * @param {object} obj Object with the data
 * @param {string} attName String that represent the attribute final to return value.
 * @param {string} charSplitAttName A character that indicate the separation of attributes in attName,
 * if this is undefined or empty or type is not string then the value by default is '.'.
 * @return {object} The value of attribute, if strAttrValues don't exist then return undefined
 */
function getValueAttInObject(obj, attName, charSplitAttName) {
  if(charSplitAttName === undefined || typeof charSplitAttName !== 'string' || charSplitAttName.length < 1) {
    charSplitAttName = '.';
  }
  var fieldsValue = attName.split(charSplitAttName);
  var j;
  var objValue = obj;
  for(j=0;j<fieldsValue.length;j++) {
    try {
      objValue = objValue[fieldsValue[j]];
    } catch (ex) {
      objValue = undefined;
    }
  }
  return objValue;
}

/**
 *
 * This class don't has a constructor. Decorator override the function createStructureToRender
 * of Class CaliopeWebForm.createStructureToRender
 *
 * @class CaliopeWebFormSpecificDecorator
 * @classdesc  Decorator for the structure with the specific syntax
 * for AngularJS and dform.
 *
 *
 * @author Daniel Ochoa <ndaniel8a@gmail.com>
 * @author Cesar Gonzalez <aurigadl@gmail.com>
 * @license  GNU AFFERO GENERAL PUBLIC LICENSE
 * @copyright
 *
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
var CaliopeWebFormSpecificDecorator = ( function() {

  /**
   * Define the forms with own angular controller.
   * @member formsWithOwnController
   * @memberOf CaliopeWebFormSpecificDecorator
   * @type {Array}
   */
  var formsWithOwnController = [''];

  /**
   * Define the name of general controller to the forms.
   * @member formsWithOwnController
   * @memberOf CaliopeWebFormSpecificDecorator
   *
   * @type {string}
   */
  var ctrlSIMMName           = 'SIMMFormCtrl';

  /**
   * Define the standard end name to form with own controller.
   * @member formsWithOwnController
   * @memberOf CaliopeWebFormSpecificDecorator
   * @type {string}
   */
  var ctrlEndName            = 'Ctrl';

  /**
   * Add ng-controller of angular controller directive to the form.
   * @function
   * @memberOf CaliopeWebFormSpecificDecorator
   * @param {object} structureInit form structure
   * @param {string} formName Form name, this is necessary for evaluate if is necessary own
   * controller or general controller.
   */
  function completeController(structureInit, formName) {
    var valueNgCtrl = ctrlSIMMName;

    /*
     * Search if form name has own controller
     */
    if( formsWithOwnController.indexOf(formName) >= 0 ) {
      valueNgCtrl = formName;
      valueNgCtrl = valueNgCtrl.slice(0, 1).toUpperCase().concat(
          valueNgCtrl.slice(1, valueNgCtrl.length)
      );
      valueNgCtrl = valueNgCtrl.concat(ctrlEndName);
    }
    /*
     * Add to structure the definition of angular controller to use.
     */
    if( valueNgCtrl !== null) {
      structureInit['ng-controller'] = valueNgCtrl;
    }

  }

  /**
   * Complete the ng-model angular directive to all elements in elementsInputs parameter
   * @function
   * @memberOf CaliopeWebFormSpecificDecorator
   * @param {array} elementsInputs Elements inputs
   */
  function completeModel(elementsInputs) {
    var i;
    for( i = 0; i < elementsInputs.length; i++  ) {
      completeModelIndividual(elementsInputs[i]);
    }
  }

  /**
   * Complete the ng-model angular directive for a element.
   * @function
   * @memberOf CaliopeWebFormSpecificDecorator
   * @param {object} element Element (input)
   */
  function completeModelIndividual(element) {
    var name = element.name;
    if( name === null ) {
      name = element.id;
    }
    var valueNgModel = "";

    if( name !== null ) {
      valueNgModel = name;
    } else {
      //TODO: Definir que se hace cuando no viene el att name,
      // se debería generar una excepcion indicando el error y notificando
      // al server sobre el error.
      //valueNgModel = stNameTemplate;
      console.error('No se encontro valor para el atributo name en el template.', element);
    }
    element['ng-model'] = valueNgModel;
  }

  /**
   * This function transform the element of type select defined in the structure
   * for add the behavior of load the options from server.
   * Add the angular directive cw-option for this purpose.
   * @function
   * @memberOf CaliopeWebFormSpecificDecorator
   * @param{array} elementsInputs Elements Field config in the template.
   */
  function completeTypeSelect(elementsInputs) {

    /*
     * Verificar que existan elementos
     */
    if( elementsInputs !== undefined && elementsInputs.length > 0) {
      /*
      Seleccionar los elementos que sean de tipo select
       */
      var elementsSelect = jQuery.grep(elementsInputs, function(obj) {
        var NAME_TYPE_SELECT = 'select';
        return obj.type === NAME_TYPE_SELECT;
      });
      /*
      Para cada elemento del tipo select verificar si tiene options y como atributo de
      options entity, si cumple esta condición entonces asociar la directiva cw-options
      para indicar que los options del select se deben recuperar desde el server.
       */
      jQuery.each(elementsSelect, function(index, element){
        var VARNAME_LOAD_OPT_SRV = 'options-load-server';
        if( element.hasOwnProperty(VARNAME_LOAD_OPT_SRV) ) {
          var VARNAME_METHOD = 'method';
          var VARNAME_FIELDVAL = 'field-value';
          var VARNAME_FIELDDESC = 'field-desc';
          var VARNAME_DIRECTIVE_CWOPT = 'cw-options';
          var VARNAME_DIRECTIVE_OPT = 'ng-options';
          var VARNAME_FORMID = 'formid';
          var VARNAME_DATALIST = 'field-data-list';
          var VARNAME_OPTIONSNAME = 'options-name';

          element.fromserver = true;
          element.method = element[VARNAME_LOAD_OPT_SRV][VARNAME_METHOD];
          if( element[VARNAME_LOAD_OPT_SRV][VARNAME_FIELDVAL] !== undefined) {
            element.fieldvalue = element[VARNAME_LOAD_OPT_SRV][VARNAME_FIELDVAL];
          }
          if(element[VARNAME_LOAD_OPT_SRV][VARNAME_FIELDDESC] !== undefined) {
            element.fielddesc = element[VARNAME_LOAD_OPT_SRV][VARNAME_FIELDDESC];
          }
          if(element[VARNAME_LOAD_OPT_SRV][VARNAME_FORMID] !== undefined) {
            element.formid = element[VARNAME_LOAD_OPT_SRV][VARNAME_FORMID];
          }
          if(element[VARNAME_LOAD_OPT_SRV][VARNAME_DATALIST] !== undefined) {
            element['field-datalist'] = element[VARNAME_LOAD_OPT_SRV][VARNAME_DATALIST];
          }
          element[VARNAME_DIRECTIVE_CWOPT] = '';
          element[VARNAME_OPTIONSNAME] = 'options_' + element.name;
          element[VARNAME_DIRECTIVE_OPT] =
              'opt.label as opt.label for opt in ' + element[VARNAME_OPTIONSNAME];
          //element.options = {};
        }
      });
    }
  }

  /**
   * Add datepicker angular directive to the structure for each elements in the structure with
   * the type datepicker defined in json structure form.
   *
   * @function
   * @memberOf CaliopeWebFormSpecificDecorator
   * @param {array} elementsTemplate Elements Field config in the template.
   */
  function completeTypeDatePicker(elementsTemplate) {
    if( elementsTemplate !== undefined ) {
      var i;
      var TYPE_DATEPICKER = 'datepicker';
      var DIRECTIVE_DATEPICKER = 'datepicker-popup';
      var VARNAME_DATEFORMAT = 'format';
      for(i=0; i < elementsTemplate.length; i++) {
        if( elementsTemplate[i] !== undefined && elementsTemplate[i].type !== undefined &&
            elementsTemplate[i].type === TYPE_DATEPICKER)  {

            var elementDivCalendar = {
              type :"div",
              class : "calendar",
              html  : [],
              name : elementsTemplate[i].name,
              type1 : "datepicker"
            };


            elementsTemplate[i].type = "text";
            elementsTemplate[i].type1 = TYPE_DATEPICKER;
            elementsTemplate[i][DIRECTIVE_DATEPICKER] = elementsTemplate[i][VARNAME_DATEFORMAT];
            //elementsTemplate[i].name =  elementsTemplate[i].name;

            elementDivCalendar.html.push(elementsTemplate[i]);
            elementsTemplate[i] = elementDivCalendar;

        }
      }
    }
  }

  /**
   * Add datepicker angular directive to the structure for each elements in the structure with
   * the type datepicker defined in json structure form.
   *
   * @function
   * @memberOf CaliopeWebFormSpecificDecorator
   * @param {array} elementsTemplate Elements Field config in the template.
   */
  function completeTypeCwGrid(elementsTemplate) {
    var i;
    var TYPE_CWGRID = 'cw-grid-in-form';
    var CWGRID_OPT = 'cw-grid-options';

    for(i=0; i < elementsTemplate.length; i++) {
      if(elementsTemplate[i].hasOwnProperty(CWGRID_OPT) ) {
        elementsTemplate[i].typeo = elementsTemplate[i].type;
        elementsTemplate[i].type = TYPE_CWGRID;
        elementsTemplate[i].columns = JSON.stringify(elementsTemplate[i][CWGRID_OPT].columns);

      }
    }

  }

  /**
   * TODO: DOCUMENTATION
   *
   * @function
   * @memberOf CaliopeWebFormSpecificDecorator
   * @param {array} elementsTemplate Elements Field config in the template.
   */
  function completeTypeExecuteTask(elementsTemplate, data) {
    if( elementsTemplate !== undefined ) {
      var i;
      var TYPE_EXCUTETASK = 'execute-task';
      var DIRECTIVE_EXCUTETASK = 'cw-task-execute';
      var NAME_DATA_TARGET_UUID_VAL= 'target-uuid-field';
      var NAME_DATA_TARGET_ENTITY_VAL = 'target-entity-field';

      for(i=0; i < elementsTemplate.length; i++) {
        if( elementsTemplate[i] !== undefined && elementsTemplate[i].type !== undefined &&
            elementsTemplate[i].type === TYPE_EXCUTETASK)  {

          elementsTemplate[i].type = DIRECTIVE_EXCUTETASK;
          elementsTemplate[i].type1 = TYPE_EXCUTETASK;
          var attUUID = elementsTemplate[i].options[NAME_DATA_TARGET_UUID_VAL];
          var attEntity = elementsTemplate[i].options[NAME_DATA_TARGET_ENTITY_VAL];
          elementsTemplate[i]['target-uuid'] = getValueAttInObject(data, attUUID, '.');
          elementsTemplate[i]['target-entity'] = getValueAttInObject(data, attEntity, '.');
        }
      }
    }
  }


  /**
   * This function transform the element of type select for add the behavior of load the
   * options from server. Add the directive cw-option for this purpose.
   *
   * @function
   * @memberOf CaliopeWebFormSpecificDecorator
   * @param {array} elementsInputs Elements Field config in the template.
   * @param {object} data Data associate to the form
   */
  function completeTypeMultiChoices(elementsInputs, data) {

    /*
     * Verificar que existan elementos
     */
    if( elementsInputs !== undefined && elementsInputs.length > 0) {
      /*
       Seleccionar los elementos que sean de tipo select
       */
      var elementsSelect = jQuery.grep(elementsInputs, function(obj) {
        var NAME_TYPE_MULTICHOICES = 'multi-choices';
        return obj.type === NAME_TYPE_MULTICHOICES;
      });
      /*
       Para cada elemento del tipo select verificar si tiene options y como atributo de
       options entity, si cumple esta condición entonces asociar la directiva cw-options
       para indicar que los options del select se deben recuperar desde el server.
       */
      jQuery.each(elementsSelect, function(index, element){
        var VARNAME_LOAD_OPT_SRV = 'options-load-server';
        var NAME_DIRECTIVE_MCOMBO = 'ui-mcombo-choices';


        element.type1 = element.type;
        element.type = NAME_DIRECTIVE_MCOMBO;

        if( element.hasOwnProperty(VARNAME_LOAD_OPT_SRV) ) {
          var VARNAME_METHOD = 'method';
          var VARNAME_FIELDVAL = 'field-value';
          var VARNAME_FIELDDESC = 'field-desc';
          var VARNAME_FIELDIMAGE = 'field-image';
          var VARNAME_FORMID = 'formid';
          var VARNAME_DATALIST = 'field-data-list';
          var VARNAME_LOADREMOTE = 'load-remote';
          var VARNAME_SELECTEDCHOICES = 'selected-choices';


          element.fromserver = true;
          element.method = element[VARNAME_LOAD_OPT_SRV][VARNAME_METHOD];
          if( element[VARNAME_LOAD_OPT_SRV][VARNAME_FIELDVAL] !== undefined) {
            element.fieldvalue = element[VARNAME_LOAD_OPT_SRV][VARNAME_FIELDVAL];
          }
          if(element[VARNAME_LOAD_OPT_SRV][VARNAME_FIELDDESC] !== undefined) {
            element.fielddesc = element[VARNAME_LOAD_OPT_SRV][VARNAME_FIELDDESC];
          }
          if(element[VARNAME_LOAD_OPT_SRV][VARNAME_FIELDIMAGE] !== undefined) {
            element.fieldimage = element[VARNAME_LOAD_OPT_SRV][VARNAME_FIELDIMAGE];
          }
          if(element[VARNAME_LOAD_OPT_SRV][VARNAME_FORMID] !== undefined) {
            element.formid = element[VARNAME_LOAD_OPT_SRV][VARNAME_FORMID];
          }
          if(element[VARNAME_LOAD_OPT_SRV][VARNAME_DATALIST] !== undefined) {
            element[VARNAME_DATALIST] = element[VARNAME_LOAD_OPT_SRV][VARNAME_DATALIST];
          }
          element[VARNAME_LOADREMOTE] = true;
          element[NAME_DIRECTIVE_MCOMBO] = "mc-".concat(element.name);

          /*
           Get choices selected and put in attribute define in var VARNAME_SELECTEDCHOICES
          element[VARNAME_SELECTEDCHOICES] = "";

          if( data !== undefined ) {
            var selectedChoices = data[element.name];
            if( selectedChoices !== undefined ) {
              if( selectedChoices instanceof Array ) {
                var i = 0;
                for( i=0; i < selectedChoices.length; i++ ) {
                  element[VARNAME_SELECTEDCHOICES] = element[VARNAME_SELECTEDCHOICES].
                    concat(selectedChoices[i]).concat(",");
                }
              } else if( selectedChoices instanceof String ) {
                element[VARNAME_SELECTEDCHOICES] = "'".concat(selectedChoices).concat("'");
              }
            }
          }
           */

        }
      });
    }
  }



  return {
    /**
     * Apply the decorator to the CaliopeWebForm. This override the createStructureToRender function of
     * CaliopeWebForm. This add angularjs directives: ng-model, ng-controller, cw-option, ui-mcombo-choices,
     * @function
     * @public
     * @memberOf CaliopeWebFormSpecificDecorator
     * @param {CaliopeWebForm} caliopeWebForm CaliopeWebForm to apply the decoration
     */
    createStructureToRender : function(caliopeWebForm) {

      var structureInit = caliopeWebForm.createStructureToRender();
      var elementsTemplate = caliopeWebForm.getElements();
      var data = caliopeWebForm.getData();
      caliopeWebForm.createStructureToRender = function() {
        completeController(structureInit, caliopeWebForm.getFormName());
        completeModel(elementsTemplate);
        completeTypeSelect(elementsTemplate);
        completeTypeDatePicker(elementsTemplate);
        completeTypeMultiChoices(elementsTemplate,data);
        completeTypeExecuteTask(elementsTemplate, data);
        completeTypeCwGrid(elementsTemplate);

        return structureInit;
      };
    }
  };
}());

/**
 *
 * This class don't has a constructor. Decorator override the function createStructureToRender
 * of Class CaliopeWebForm.createStructureToRender
 *
 * @class CaliopeWebFormActionsDecorator
 * @classdesc  This decorate the actions with the specific syntax
 * for Angular and actions specifics in actions structure.
 *
 *
 * @author Daniel Ochoa <ndaniel8a@gmail.com>
 * @author Cesar Gonzalez <aurigadl@gmail.com>
 * @license  GNU AFFERO GENERAL PUBLIC LICENSE
 * @copyright
 *
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
var CaliopeWebFormActionsDecorator = ( function() {

  /**
   * Create the structure specific for dform and Angularjs of the actions as buttons.
   * @function
   * @memberOf CaliopeWebFormActionsDecorator
   * @param {object} structureInit Original form structure of the form
   * @param {object} structureActions Representations of the actions.
   * @param {string} formName Name of the form
   * @param {string} modelUUID Data Identifier.
   * @param {string} objID Data Identifier
   */
  function completeActions(structureInit, structureActions, actionsToShow, formName, modelUUID, objID) {

    var i;

    if( structureActions !== null && structureActions.length > 0 &&
        structureInit.html !== undefined && structureInit.html instanceof Array) {

      var VAR_NAME_NAME = "name";
      var VAR_NAME_METHOD = "method";
      var TYPE_ACTION = "button";
      var DIRECTIVE_NG_CLICK = 'ng-click';
      var DIRECTIVE_NG_DISABLED = 'ng-disabled';
      var NAME_METHOD_CONTROLLER = 'sendAction';
      var NAME_CLASS_ACTIONS = 'modal-footer';
      var NAME_CLASS_BUTTON_DEFAULT = "btn";
      var VAR_NAME_PARAMS_TO_SEND = "params";

      var buttonContainer = {
        type : "div",
        name : "div-footer",
        class : NAME_CLASS_ACTIONS,
        html  : []
      };


      for ( i = 0; i < structureActions.length; i++) {
        var action = {};
        var actionName = structureActions[i][VAR_NAME_NAME];
        var actionMethod = structureActions[i][VAR_NAME_METHOD];
        if(actionsToShow === undefined || actionsToShow.length === 0 || actionsToShow.indexOf(actionMethod) >= 0 ) {
          var actionMethod = structureActions[i][VAR_NAME_METHOD];
          var paramsToSend = structureActions[i][VAR_NAME_PARAMS_TO_SEND];
          if( paramsToSend === undefined ) {
            paramsToSend = "";
          }
          action.type = TYPE_ACTION;
          /*
            create ng-click: sendAction(form, 'formName', 'method', 'modelUUID', 'objID', 'params_to_send_to_server');
           */
          action[DIRECTIVE_NG_CLICK] = NAME_METHOD_CONTROLLER.concat("(").
              concat(formName).concat(", ").
              concat("'").concat(formName).concat("', ").
              concat("'").concat(actionMethod).concat("', ").
              concat("'").concat(modelUUID).concat("', ").
              concat("'").concat(objID).concat("', ").
              concat("'").concat(paramsToSend).concat("'").
              concat(")");
          action[DIRECTIVE_NG_DISABLED] = formName.concat('.$invalid');
          action.name = action.type.concat('-').concat(actionName) ;
          action.class = NAME_CLASS_BUTTON_DEFAULT;
          action.html = actionName;
          buttonContainer.html.push(action);
        }
      }

      structureInit.html.push(buttonContainer);
    }
  }

  return {
    /**
     * Apply the decorator to the CaliopeWebForm. This override the createStructureToRender function of
     * CaliopeWebForm and add the structure to render the actions buttons.
     * @function
     * @public
     * @memberOf CaliopeWebFormActionsDecorator
     * @param {CaliopeWebForm} caliopeWebForm CaliopeWebForm to apply the decoration
     */
    createStructureToRender : function(caliopeWebForm) {
      var structureInit = caliopeWebForm.createStructureToRender();
      var structureAction = caliopeWebForm.getActions();
      var formName = caliopeWebForm.getFormName();
      var modelUUID = caliopeWebForm.getModelUUID();
      var actionsToShow = caliopeWebForm.getActionsToShow();
      var objID;
      if( caliopeWebForm.getData() !== undefined && caliopeWebForm.getData().uuid !== 'undefined') {
        objID = caliopeWebForm.getData().uuid;
      }
      if( objID === undefined ) {
        objID = '';
      }
      caliopeWebForm.createStructureToRender = function() {
        completeActions(structureInit, structureAction, actionsToShow, formName, modelUUID, objID);
        return structureInit;
      };
    }
  };
}());

/**
 *
 * This class don't has a constructor. Decorator override the function createStructureToRender
 * of Class CaliopeWebForm.createStructureToRender
 *
 * @class CaliopeWebFormDataDecorator
 * @classdesc  This decorate the data in the form.
 *
 *
 * @author Daniel Ochoa <ndaniel8a@gmail.com>
 * @author Cesar Gonzalez <aurigadl@gmail.com>
 * @license  GNU AFFERO GENERAL PUBLIC LICENSE
 * @copyright
 *
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
var CaliopeWebFormDataDecorator = ( function() {
  return {
    /**
     * Apply the decorator to the CaliopeWebForm. This override the createStructureToRender function of
     * CaliopeWebForm and add the data in the elements of the form.
     * @function
     * @public
     * @memberOf CaliopeWebFormDataDecorator
     * @param {CaliopeWebForm} caliopeWebForm CaliopeWebForm to apply the decoration
     * @todo To implement, because to associate the data to the form in Angularjs is necessary put the data in
     * the scope. Actually the method CaliopeWebForm.putDataToContext makes this work.
     */
    createStructureToRender : function(caliopeWebForm) {
      var structureInit = caliopeWebForm.createStructureToRender();
      caliopeWebForm.createStructureToRender = function() {
        //TODO: Terminar el decorador para agregar la data al form
        return structureInit;
      };
    }
  };
}());

/**
 *
 * This class don't has a constructor. Decorator override the function createStructureToRender
 * of Class CaliopeWebForm.createStructureToRender
 *
 * @class CaliopeWebFormLocaleDecorator
 * @classdesc  This decorate the translations in the labels or captions
 * of the elements in the form.
 *
 *
 * @author Daniel Ochoa <ndaniel8a@gmail.com>
 * @author Cesar Gonzalez <aurigadl@gmail.com>
 * @license  GNU AFFERO GENERAL PUBLIC LICENSE
 * @copyright
 *
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
var CaliopeWebFormLocaleDecorator = ( function() {
  return {
    /**
     * Apply the decorator to the CaliopeWebForm. This override the createStructureToRender function of
     * CaliopeWebForm and add the labels corresponding to locale of user.
     * @function
     * @public
     * @memberOf CaliopeWebFormLocaleDecorator
     * @param {CaliopeWebForm} caliopeWebForm CaliopeWebForm to apply the decoration
     * @todo To implement, because is not clear the handling of this.
     */
    createStructureToRender : function(caliopeWebForm) {
      var structureInit = caliopeWebForm.createStructureToRender();
      caliopeWebForm.createStructureToRender = function() {
        //TODO: Terminar el decorador para agregar las traducciones a los nombres de los inputs y botones.
        return structureInit;
      };
    }
  };
}());

/**
 *
 * This class don't has a constructor. Decorator override the function createStructureToRender
 * of Class CaliopeWebForm.createStructureToRender
 *
 * @class CaliopeWebFormAttachmentsDecorator
 * @classdesc  This decorate the inputs of type attachment with
 * the ng-file-uploader directive.
 *
 *
 * @author Daniel Ochoa <ndaniel8a@gmail.com>
 * @author Cesar Gonzalez <aurigadl@gmail.com>
 * @license  GNU AFFERO GENERAL PUBLIC LICENSE
 * @copyright
 *
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
var CaliopeWebFormAttachmentsDecorator = ( function() {

  /**
   * Change the elements of type attachment with angularjs directive ng-fileuploader.
   * @memberOf CaliopeWebFormAttachmentsDecorator
   * @function
   * @param elementsInit Elements to evaluate
   * @param modelUUID Identifier of the data associated to the form.
   */
  function replaceAttachment(elementsInit, modelUUID) {

    var varNameType = 'type';
    var nameTypeAtt = 'attachment';
    var nameAttachDirective = 'ng-fileuploader';
    var varNameModelUUID = 'modeluuid';
    var varNameFieldAtt = 'fieldattch';

    if( elementsInit !== null ) {
      var i;
      for( i=0; i<elementsInit.length; i++ ) {
        if( elementsInit[i].hasOwnProperty(varNameType) &&
            elementsInit[i][varNameType] === nameTypeAtt ) {
          elementsInit[i][varNameType] = nameAttachDirective;
          elementsInit[i][varNameModelUUID] = modelUUID;
          elementsInit[i][varNameFieldAtt] = elementsInit[i].name;
        }
      }
    }

  }


  return {
    /**
     * Apply the decorator to the CaliopeWebForm. This override the createStructureToRender function of
     * CaliopeWebForm and modify the elements of type attachment to add the functionality to
     * load archives.
     * @function
     * @public
     * @memberOf CaliopeWebFormAttachmentsDecorator
     * @param {CaliopeWebForm} caliopeWebForm CaliopeWebForm to apply the decoration
     */
    createStructureToRender : function(caliopeWebForm) {
      var structureInit = caliopeWebForm.createStructureToRender();
      var elementsInit = caliopeWebForm.getElements();
      var modelUUID = caliopeWebForm.getModelUUID();
      caliopeWebForm.createStructureToRender = function() {

        replaceAttachment(elementsInit, modelUUID);

        return structureInit;
      };
    }
  };
}());


/**
 *
 * This class don't has a constructor. Decorator override the function createStructureToRender
 * of Class CaliopeWebForm.createStructureToRender
 *
 * @class CaliopeWebFormValidDecorator
 * @classdesc  This decorate with validations configured in json
 * template. Add cw-validation-mess angular directive for each validation define in json form
 * template. This decorates is affected by CaliopeWebFormLayoutDecorator, is necessary apply first
 * the layout decorator and after apply CaliopeWebFormValidDecorator
 *
 *
 * @author Daniel Ochoa <ndaniel8a@gmail.com>
 * @author Cesar Gonzalez <aurigadl@gmail.com>
 * @license  GNU AFFERO GENERAL PUBLIC LICENSE
 * @copyright
 *
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
var CaliopeWebFormValidDecorator = ( function() {

  /**
   * Get a element of type cw-validation-mess (directive angularjs) and yours attributes to be render with dform
   * @function
   * @memberOf CaliopeWebFormValidDecorator
   * @param validationType {string} Validation type
   * @param element {object} Element that contains the validations
   * @param formName {string} Name of the form.
   * @param params {array} Parameter to show in the message
   * @returns {{type: string, name: string, ng-show: Array, validation-type: *, params: string}}
   * type: Is the name of directive to use.
   * name: Is the name of the <cw-validation-mess> html element
   * ng-show: Is the angular expression to be using for show or not the validation message.
   * validation-type: Is the validation type of the element validation message
   * params: String that representing the params to show in the element validation message
   *
   */
  function getElementMsgVal(validationType, element, formName, params) {
    var varNameDirty = '$dirty';
    var varNameError = '$error';

    var nameDirective = "msg-" + element.name;
    var elementName = "";
    if( element.hasOwnProperty('name') ) {
      elementName = element.name;
      nameDirective = nameDirective.concat(elementName);
    }
    var stElement = formName.concat('.').concat(elementName);
    var stShowDirty = stElement.concat('.').concat(varNameDirty);
    var stShowError = stElement.concat('.').concat(varNameError);

    var stParameters = "";
    if( params !== undefined ) {
      var i;
      for(i=0; i<params.length; i++) {
        stParameters = stParameters.concat(params[i]).concat('|');
      }
    }
    return {
      "type"  : "cw-validation-mess",
      "name"  : nameDirective,
      "ng-show"  : stShowDirty.concat(" && ").concat(stShowError).
          concat(".").concat(validationType),
      "validation-type"  : validationType,
      "params" : stParameters
    };
  }

  /**
   * Search in deep (recursive) a parent that contains a element. The parents is one that
   * has the elementSearch as one of its elements in html attribute
   * @function
   * @memberOf CaliopeWebFormValidDecorator
   * @param {array} htmlElements Html element in the form
   * @param {object} elementSearch Element to search
   * @returns {object} The container of element.
   */
  function searchContainer(htmlElements, elementSearch) {

    var result;

    if( htmlElements !== undefined ) {
      var i;
      if( htmlElements instanceof Array ) {
        for(i=0; i<htmlElements.length; i++) {
          if( htmlElements[i].html !== undefined ) {
            result = searchContainer(htmlElements[i].html, elementSearch);
            if( result !== undefined ) {
              break;
            }
          } else {
            if( elementSearch === htmlElements[i] ) {
              result = htmlElements;
              break;
            }
          }
        }
      } else {
        if( htmlElements.html !== undefined ) {
          searchContainer(htmlElements.html, elementSearch);
        }
      }
    }
    return result;

  }

  /**
   * Search a container (object that representing a div html) and replace this with a new container.
   * The search is in deep (recursive)
   *
   * @function
   * @memberOf CaliopeWebFormValidDecorator
   * @param {array} htmlElements Element in the form
   * @param {object} containerSearch Container to search
   * @param {object} containerNew Container which replace the found container.
   * @returns {*} htmlElements with the new container.
   */
  function replaceContainer(htmlElements, containerSearch, containerNew) {

    if( htmlElements !== undefined ) {
      var i;
      if( htmlElements instanceof Array ) {
        for(i=0; i<htmlElements.length; i++) {
          if( htmlElements[i].html !== undefined ) {
            var htmlElementsReplacedTmp = replaceContainer(htmlElements[i].html, containerSearch, containerNew);
            if( htmlElementsReplacedTmp.hasOwnProperty('replace') ) {
              htmlElements[i].html =  htmlElementsReplacedTmp.replace;
              return htmlElements[i];
            }
          } else {
            if( containerSearch === htmlElements[i] ) {
              htmlElements = containerNew;
              return {
                replace: htmlElements
              };
            }
          }
        }
      } else {
        if( htmlElements.html !== undefined ) {
          return replaceContainer(htmlElements.html, containerSearch, containerNew);
        }
      }
    }

    return htmlElements;
  }

  /**
   * Add the structure necessary to support validations and show validations
   * message to the form
   * @function
   * @memberOf CaliopeWebFormValidDecorator
   * @param {array} elementsInputs Elements (inputs) in the form.
   * @param {object} structureInit Structure of the form
   * @param {string} formName Name of the form
   */
  function completeValidation(elementsInputs, structureInit, formName) {

    var VALIDATIONS_ATT_NAME = 'validations';
    var REQUIRE_ATT_NAME = 'required';
    var MAXLENGTH_ATT_NAME = 'maxlength';
    var MINLENGTH_ATT_NAME = 'minlength';
    var MIN_NUMBER_ATT_NAME = "min";
    var MAX_NUMBER_ATT_NAME = "max";
    var htmlElements = structureInit.html;

    if( elementsInputs !== undefined ) {
      var i;
      /*
       * Recorrer los elementos y verificar si tiene el nombre de atributo definido en
       * VALIDATIONS_ATT_NAME
       */
      for( i=0; i < elementsInputs.length; i++) {
        var validations = elementsInputs[i][VALIDATIONS_ATT_NAME];
        /*
         * Si tiene validations entonces manejar la validacion para crear el tipo de
         * validación y el mensaje a mostrar en caso de que no se cumpla la validación
         */
        if( validations !== undefined ) {
          var varName;
          for( varName in validations) {
            var validationType = varName;
            var params=[];
            /*
              Logic for validation required
            */
            if( validationType === REQUIRE_ATT_NAME ) {
              elementsInputs[i].required = validations[REQUIRE_ATT_NAME];
              validationType = 'required';
            }
            if( validationType === MINLENGTH_ATT_NAME  ) {
              elementsInputs[i]['ng-minlength'] = validations[MINLENGTH_ATT_NAME];
              validationType = 'minlength';
              params[0] = validations[MINLENGTH_ATT_NAME];
            }
            if( validationType === MAXLENGTH_ATT_NAME  ) {
              elementsInputs[i]['ng-maxlength'] = validations[MAXLENGTH_ATT_NAME];
              validationType = 'maxlength';
              params[0] = validations[MAXLENGTH_ATT_NAME];
            }
            if( validationType === MIN_NUMBER_ATT_NAME  ) {
              elementsInputs[i].min = validations[MIN_NUMBER_ATT_NAME];
              validationType = 'min';
              params[0] = validations[MIN_NUMBER_ATT_NAME];
            }
            if( validationType === MAX_NUMBER_ATT_NAME  ) {
              elementsInputs[i].max = validations[MAX_NUMBER_ATT_NAME];
              params[0] = 'max';
            }

            var container = searchContainer(htmlElements,elementsInputs[i]);
            if( container !== undefined && container) {
              var index = container.indexOf(elementsInputs[i]);
              if( index >= 0 ) {
                var containerIni = container.slice(0, index + 1);
                var containerFin = container.slice(index+1);

                var elementMsgVal = getElementMsgVal(validationType, elementsInputs[i], formName, params);
                var containerNew = containerIni.concat(elementMsgVal).concat(containerFin);
                htmlElements = replaceContainer(htmlElements, elementsInputs[i], containerNew);

              }
            }
          }
        }
      }
    }
    structureInit.html = htmlElements;
  }

  return {
    /**
     * Apply the decorator to the CaliopeWebForm. This override the createStructureToRender function of
     * CaliopeWebForm and add the validations with angularjs and directive for show validations messages
     * @function
     * @public
     * @memberOf CaliopeWebFormValidDecorator
     * @param {CaliopeWebForm} caliopeWebForm CaliopeWebForm to apply the decoration
     */
    createStructureToRender : function(caliopeWebForm) {
      var structureInit = caliopeWebForm.createStructureToRender();
      var formName = caliopeWebForm.getFormName();
      caliopeWebForm.createStructureToRender = function() {

        completeValidation(caliopeWebForm.getElements(), structureInit, formName);

        return structureInit;
      };
    }
  };


}());

/**
 *
 * This class don't has a constructor. Decorator override the function createStructureToRender
 * of Class CaliopeWebForm.createStructureToRender
 *
 * @class CaliopeWebFormLayoutDecorator
 * @classdesc This decorate the layout form
 *
 *
 * @author Daniel Ochoa <ndaniel8a@gmail.com>
 * @author Cesar Gonzalez <aurigadl@gmail.com>
 * @license  GNU AFFERO GENERAL PUBLIC LICENSE
 * @copyright
 *
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
var CaliopeWebFormLayoutDecorator = ( function() {

  /**
   * Search a element by name in elements.
   * @param {string} name Name of the element to search
   * @param {array} elements Elements
   * @returns {object}
   */
  function searchElement(name, elements) {
    var m;
    for(m=0;m < elements.length ;m++){
      if(name === elements[m].name){
       return elements[m];
      }
    }
    console.log('Error calipeWebForms no se encontro parametro ' +  name);
  }

  /**
   * Create and return a column container defined in layout. The new column container will contain
   * the elements of the form
   * @function
   * @memberOf CaliopeWebFormLayoutDecorator
   * @param {array} columnContainer Column container defined in layout
   * @param {array} elementsInputs Element in the form
   * @param {string} columnIndex Index of the column
   * @returns {object} New column container with elements (inputs)
   */
  function getColumnContainer(columnContainer, elementsInputs, columnIndex) {

    var containerColumns = {
      type : "div",
      class : columnContainer.class,
      html  :  []
    };

    var  r;
    for(r=0; r < columnContainer.elements.length ;r++) {
      var objNew = searchElement(columnContainer.elements[r], elementsInputs);
      containerColumns.html.push(objNew);
    }

    return containerColumns;
  }

  /**
   * Create and return a container defined in layout with the elements putting in the
   * respective columns.
   * @function
   * @memberOf CaliopeWebFormLayoutDecorator
   * @param cont Container defined in layout
   * @param elementsInputs Elements in the form
   * @returns {{type: string, class: string, html: Array}} The container with the columns container,
   * this are added in html attribute
   */
  function getContainer(cont, elementsInputs) {
    var container = {
      type : "div",
      class : 'row-fluid',
      html  : []
    };

    var j;

    for(j=0; j < cont.columns.length;j++) {
      var columnContainer = getColumnContainer(cont.columns[j], elementsInputs, j);
      container.html.push(columnContainer);
    }

    return container;
  }

  /**
   * Apply the layout for the form
   * @function
   * @memberOf CaliopeWebFormLayoutDecorator
   * @param {object} layout Layout structure to apply
   * @param {array} elementsInputs Elements in the form
   * @param {object} structureInit Structure to modify with layout
   */
  function applyLayout(layout, elementsInputs, structureInit) {

    var htmlElements = [];

    if( layout !== undefined ) {
      var i;
      for( i=0; i < layout.length; i++) {
         htmlElements.push(getContainer(layout[i], elementsInputs));
      }
    }

    structureInit.html = htmlElements;

  }

  return {

    /**
     * Apply the decorator to the CaliopeWebForm. This override the createStructureToRender function of
     * CaliopeWebForm putting the elements in the containers defined in structure layout
     * @function
     * @public
     * @memberOf CaliopeWebFormLayoutDecorator
     * @param {CaliopeWebForm} caliopeWebForm CaliopeWebForm to apply the decoration
     */
    createStructureToRender : function(caliopeWebForm) {
      var structureInit  = caliopeWebForm.createStructureToRender();
      var layout         = caliopeWebForm.getlayout();
      var elementsInputs = caliopeWebForm.getElements();

      caliopeWebForm.createStructureToRender = function() {
        if( layout !== undefined && layout.length > 0) {
          applyLayout(layout, elementsInputs, structureInit);
        }
        return structureInit;
      };
    }
  };
}());
