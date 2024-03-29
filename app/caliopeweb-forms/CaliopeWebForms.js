
var CaliopeWebFormConstants = {
  'rexp_value_in_form' : "^{{2}[^{].*[^}]}{2}$",
  'rexp_value_in_form_code' : "{{2}[^{]*[^}]}{2}",
  'rexp_value_in_form_inrep' : "^{{2}",
  'rexp_value_in_form_firep' : "}{2}$",
  'rexp_value_in_form_inrep_code' : "{{2}",
  'rexp_value_in_form_firep_code' : "}{2}",
  'formsWithOwnController' : {
    //Ej: 'Tasks' : 'task-controllers'
  }
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
    * @member {object} mode
    * @memberOf CaliopeWebForm
    */
    var mode;

  /**
   * Indicate if the CWForm is a generic form
   * @member {object} genericForm
   * @memberOf CaliopeWebForm
   */
    var genericForm;

    /**
     * Indicate if the CWForm is a inner form
     * @member {object} innerForm
     * @memberOf CaliopeWebForm
     */
    var innerForm;

    /**
     * Store the dependencies between restrictions.
     * @member {object} innerForm
     * @memberOf CaliopeWebForm*
     */
    var validationDependencies;


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

  //TODO: Document
  var getVarNameScopeFromFormRep =   function(formRep) {
    return formRep.replace(new RegExp(CaliopeWebFormConstants.rexp_value_in_form_inrep),"").
        replace(new RegExp(CaliopeWebFormConstants.rexp_value_in_form_firep),"");
  };

  /**
   * Constructor of CaliopeWebForm module
   * @memberOf CaliopeWebForm
   */
    var CaliopeWebForm = function(entityModel, mode, uuid) {

      this.entityModel = entityModel;
      this.mode = mode;
      this.modelUUID = uuid;
      this.genericForm = false;
      this.innerForm = false;
    };

    CaliopeWebForm.getVarNameScopeFromFormRep = getVarNameScopeFromFormRep;

  //TODO: Document
    function dataToViewData(elements, dataFromServer) {
      /*
      - Si la data proveniente del servidor es nula entonces no se asocia el elemento a la data a devolver
      - Si los elementos son nulos entonces se retorna undefined
       */

      var data;

      if(elements !== undefined) {
        data = {};
        jQuery.each(elements, function(kElement, vElement) {
          if( vElement.hasOwnProperty('name') ) {
            if( dataFromServer !== undefined && dataFromServer[vElement.name] !== undefined ) {
              data[vElement.name] = dataFromServer[vElement.name];
              if( vElement.hasOwnProperty('relation') ) {
                var valuesRelation = [];
                /*
                Si el nombre del elemento es igual al nombre de la relación, indica que
                el elemento es el target_uuid
                 */
                if( vElement.name === vElement.relation.rel_name ) {
                  /*
                  Construir los valores para la vista de la forma:
                    {uuid:'', properties: {}}
                    donde el valor de cada uuid se obtiene del key devuelto por el srv
                    y properties es el valor del key
                  */
                  jQuery.each(dataFromServer[vElement.name], function(kRel, vRel){
                    var value = {
                      uuid : kRel,
                      properties : vRel
                    };
                    valuesRelation.push(value);
                  });
                  data[vElement.name] = valuesRelation;
                } else {
                  data[vElement.name] = dataFromServer[vElement.name];
                }
              }
            }
          }
        });
      }

      return data;
    }

  /**
   *
   * @param valueToServer
   * @param element
   */
    function processRelation(valueToServer, element) {
        //Todo: Implementar según la nueva forma en que el srv espera la relacion
    }

  /**
   * Todo: documentation
   * @param elements
   * @param dataFromView
   * @param paramsToSend
   * @returns {*}
   */
    function dataToServerData(elements, dataFromView, paramsToSend) {

      /*
        Si el parámetro dataFromView es undefined entonces se crea una estructura de datos
        que contiene los elementos y estos con valor null o undefined.

        Si los elementos son indefinidos entonces la estructura de datos será undefined
       */
      var data;


      if( elements !== undefined ) {
        data = {};
        //TODO: Verificar si aún se va a utilizar params to send.
         if( paramsToSend === undefined || paramsToSend === '' ) {
          paramsToSend = [];
         } else {
          paramsToSend = paramsToSend.split(',');
         }


        for (i = 0; i < elements.length; i++) {
          if( paramsToSend.length === 0 || paramsToSend.indexOf(elements[i].name) >= 0 ) {
            var nameVarScope = elements[i].name;
            var valueToServer = undefined;
            if( dataFromView[nameVarScope] !== undefined ) {
              if(elements[i].type === 'div' && elements[i].typeo === 'datepicker') {
                valueToServer = (dataFromView[nameVarScope] instanceof Date )? dataFromView[nameVarScope].toJSON() : dataFromView[nameVarScope] ;
              } else if(elements[i].type === 'select') {
                valueToServer = dataFromView[nameVarScope];
              } else if(elements[i].type === 'ui-mcombo-choices' && elements[i].typeo === 'multi-choices') {
                if(elements[i].hasOwnProperty('single') && elements[i].single === "true" &&
                    dataFromView[nameVarScope] !== undefined && dataFromView[nameVarScope][0] !== undefined) {
                  valueToServer = dataFromView[nameVarScope][0].value
                } else {
                  var j;
                  valueToServer = [];
                  for( j=0; j<dataFromView[nameVarScope].length; j++) {
                    if( dataFromView[nameVarScope][j].value !== undefined) {
                      valueToServer.push(dataFromView[nameVarScope][j].value);
                    }
                  }
                }
              } else if(elements[i].type === 'cw-grid-in-form' && elements[i].typeo === 'cw-grid') {
                valueToServer = dataFromView[dataFromView[nameVarScope].gridDataName];
              }
              else {
                valueToServer = dataFromView[nameVarScope];
              }

              /*
               * Process for elements with relation
               */
              if(elements[i].hasOwnProperty('relation')) {
                //processRelation(valueToServer, elements[i] );
              }

              data[nameVarScope] = valueToServer;
            }
          }
        }

        if( dataFromView.hasOwnProperty('uuid') && !data.hasOwnProperty('uuid') ) {
          data[uuid] =  dataFromView.uuid;
        }

      }

      return data;

    }

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
        this.formName = _formName;
        this.elementsForm = result.elements;
        this.elementsFormName = result.elementsName;
        this.structure = _structure;
      },
    /**
     * Add the data to the data attribute and get the value of identifier of object data and
     * add the value to modelUUID attribute.
     * @function
     * @memberOf CaliopeWebForm
     * @param _data {object} Json Structure representing the data
     */
      addData: function(_data) {
        this.data = _data;
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
        this.actions = _actions;
      },

    /**
     * Add the translations retrieve from the server to the translations attribute
     * @function
     * @memberOf CaliopeWebForm
     * @param _translations {object} Json structure representing the translations
     */
      addTranslations: function(_translations) {
        this.translations = _translations;
      },

    /**
     * Add the layout retrieve from the server to layout attribute
     * @function
     * @memberOf CaliopeWebForm
     * @param _layout {_object}  Json structure representing the layout
     */
      addlayout: function(_layout) {
         this.layout = _layout;
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
        this.structureToRender = this.structure;
        return this.structureToRender;
      },

    /**
     *
     */
    dataToViewData : function(viewData) {
      var data = dataToViewData(this.elementsForm, this.data);
      if( viewData !== undefined ) {
        jQuery.each(data, function(key, value) {
          viewData[key] = value;
        });
      }
      return data;
    },

    /**
     *
     * @param dataFromView
     * @param paramsToSend
     * @returns {*}
     */
    dataToServerData : function(dataFromView, paramsToSend) {
      this.data = dataToServerData(this.elementsForm, dataFromView, undefined);
      return dataToServerData(this.elementsForm, dataFromView, paramsToSend);
    },

    /**
     * Get the actions added
     * @function
     * @memberOf CaliopeWebForm
     *
     * @returns {object}
     */
      getActions : function() {
        return this.actions;
      },

    /**
     * Get the columns to show
     * @function
     * @memberOf CaliopeWebForm
     *
     * @returns {Array}
     */
      getActionsToShow : function() {
        return this.actionsToShow;
      },

    /**
     *  Get the data added
     * @function
     * @memberOf CaliopeWebForm
     *
     * @returns {object}
     */
      getData : function() {
        return this.data;
      },

    /**
     * Get the elements (input) contains in the structure
     * @function
     * @memberOf CaliopeWebForm
     *
     * @returns {object}
     */
      getElements : function() {
        return this.elementsForm;
      },

    /**
     * Search a element for name attribute.
     * @param elementName Value of name attribute
     * @returns {undefined}
     */
      getElement : function(elementName) {
        var element = undefined;
        if( this.elementsForm !== undefined ) {
          var i = 0;
          for( i ; i < this.elementsForm.length; i++ ) {
            if( this.elementsForm[i].name === elementName ) {
              element = this.elementsForm[i];
              break;
            }
          }
        }
        return element;
      },

    /**
     * Get the  entity model of form
     * @function
     * @memberOf CaliopeWebForm
     *
     * @returns {object}
     */
      getEntityModel : function() {
        return this.entityModel;
      },

    /**
     * Indicate if form is a generic form or not
     * @function
     * @memberOf CaliopeWebForm
     *
     * @returns {boolean}
     */
      getGenericForm : function() {
        return this.genericForm;
      },


    /**
     * Indicate if form is a inner form
     * @function
     * @memberOf CaliopeWebForm
     *
     * @returns {boolean}
     */
      getInnerForm : function() {
        return this.innerForm;
      },

    /**
     * Get the layout contains in the structure
     * @function
     * @memberOf CaliopeWebForm
     *
     */
      getlayout : function() {
         return this.layout;
      },
    /**
     * Get the names of the elements (inputs).
     * @function
     * @memberOf CaliopeWebForm
     *
     * @returns {object} Names of the elements contains in the json structure
     */
      getElementsName : function() {
        return this.elementsFormName;
      },
    /**
     * Get the name of the form.
     * @function
     * @memberOf CaliopeWebForm
     *
     * @returns {string}
     */
      getFormName : function() {
        return this.formName;
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
      this.actionsToShow = _actionsMethodToShow;
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
     * Set the value that indicate if form is a generic form
     * @param genericForm
     */
    setGenericForm : function(genericForm) {
      this.genericForm = genericForm;
    },

    /**
     * Set the value that indicate if form is a inner form
     * @param innerForm
     */
    setInnerForm : function(innerForm) {
      this.innerForm = innerForm;
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

    setValidationDependencies : function(validationDependencies) {
      this.validationDependencies = validationDependencies;
    },

    /**
     * Validate a element according to the validations presents in element validations.restrictions
     * @function
     * @memberOf CaliopeWebForm
     */
      validateElementRestrictions :function(elementName, data, cwForm) {


        var results = [];

        var evalRestriction = function (evaluation, then, data) {
          var toEval = "var fEvalRestriction = function(data){".concat(evaluation).concat('{').concat('return ').concat(then).concat(';}}');
          jQuery.globalEval(toEval);

          return fEvalRestriction(data);
        };

        function evalRestrictionsElement(element) {
          if( element !== undefined && element.hasOwnProperty('validations') &&
              element.validations.hasOwnProperty('restrictions')) {

            jQuery.each(element.validations.restrictions, function(kRestriction, vRestriction) {
              var resultEval = evalRestriction(vRestriction.evaluation, vRestriction.then, data);

              var result = {};
              result.name = vRestriction.name;
              result.result = resultEval;
              result.validationType = 'restriction_'.concat(kRestriction);
              result.nameElement = vRestriction.nameElement;

              if( resultEval !== undefined ) {

                if( vRestriction["key-message-true"] !== undefined && vRestriction["key-message-true"].length > 0 && resultEval === true)  {
                  result.msg = vRestriction["key-message-".concat(resultEval)];
                }
                if( vRestriction["key-message-false"] !== undefined && vRestriction["key-message-false"].length > 0 && resultEval === false)  {
                  result.msg = vRestriction["key-message-".concat(resultEval)];
                }
              } else {
                result.result = true;
              }
              results.push(result);
            });

          }
        }

        var element = this.getElement(elementName);
        evalRestrictionsElement(element);

        if( this.validationDependencies !== undefined && this.validationDependencies.hasOwnProperty(elementName) ) {

          jQuery.each(this.validationDependencies[elementName], function(kRestriction, vRestriction) {
            var element = cwForm.getElement(vRestriction);
            evalRestrictionsElement(element);
          });

        }


        return results;
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
   * Define the name of general controller to the forms.
   * @member ctrlSIMMName
   * @memberOf CaliopeWebFormSpecificDecorator
   *
   * @type {string}
   */
  var ctrlSIMMName           = 'SIMMFormCtrl';

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
    var formsWithOwnController = CaliopeWebFormConstants.formsWithOwnController;
    /*
     * Search if form name has own controller
     */
    if( formsWithOwnController.hasOwnProperty(formName)) {
      valueNgCtrl = formsWithOwnController[formName];
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
    if( element.type !== 'div' ) {
      element['ng-model'] = valueNgModel;
      element['ng-change'] = "changeInput(".concat("'").concat(name).concat("')");
    }
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
          var VARNAME_OPTIONSSTATIC = 'options-static';

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
              'opt.value as opt.label for opt in ' + element[VARNAME_OPTIONSNAME];
          if( element.hasOwnProperty('options') ) {
            element[VARNAME_OPTIONSSTATIC] = JSON.stringify(element.options);
          }
        }
      });
    }
  }

  /**
   * This function process the elements of type radiobuttons, checkboxes and checkbox.
   * For radiobuttons and checkboxes the process is performance over option attribute.
   * @function
   * @memberOf CaliopeWebFormSpecificDecorator
   * @param{array} elementsInputs Elements Field config in the template.
   */
  function completeTypeRadioButtonsCheckBoxess(elementsInputs) {

    /*
     * Verificar que existan elementos
     */
    if( elementsInputs !== undefined && elementsInputs.length > 0) {

      var TYPE_RADIO = 'radio';
      var TYPE_CHECK = 'checkbox';
      var VALUE_TRUE = 'True';
      var VALUE_FALSE = 'False';

      var radioContainer = {
        "type" : "",
        "ng-model" : "",
        "value" : "",
        "html" : ""
      };

      /*
       Para cada elemento del tipo (type) radiobuttons y/o checkboxes agregar a los options el ng-model,
       el caption y el value. Quitar del principal el ng-model
       */
      jQuery.each(elementsInputs, function(kElement, vElement){
        var options = [];
        if( vElement.type === 'radiobuttons' || vElement.type === 'checkboxes') {
          var ngmodel = vElement['ng-model'];
          delete vElement['ng-model'];
          delete vElement['ng-change'];

          jQuery.each(vElement.options, function(kOption, vOptions){
            var option = {};
            jQuery.extend(true, option, radioContainer);
            if(vElement.type === 'radiobuttons') {
              option.type = TYPE_RADIO;
              option['ng-model'] = ngmodel;
              option['ng-change'] = "changeInput(".concat("'").concat(vElement.name).concat("')");
              option.value = kOption;
            } else if(vElement.type === 'checkboxes') {
              option.type = TYPE_CHECK;
              option['ng-model'] = ngmodel.concat('.').concat(kOption);
              option['ng-true-value'] = VALUE_TRUE;
              option['ng-false-value'] = VALUE_FALSE;
            }
            delete option.name;
            options.push(option);
            option.caption = vOptions;
          });
          delete vElement.options;
          vElement.html = [];
          vElement.html = vElement.html.concat(options);
        }

        if( vElement.type === 'checkbox' ) {
          vElement['ng-true-value'] = VALUE_TRUE;
          vElement['ng-false-value'] = VALUE_FALSE;
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
              typeo : "datepicker"
            };


            elementsTemplate[i].type = "text";
            elementsTemplate[i].typeo = TYPE_DATEPICKER;
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
  function completeTypeWysiwyg(elementsTemplate) {
    if( elementsTemplate !== undefined ) {
      var i;
      var TYPE_WYSIWYG = 'wysiwyg';
      var DIRECTIVE_WYSIWYG = 'ckedit';
      var VARNAME_DATEFORMAT = 'format';

      for(i=0; i < elementsTemplate.length; i++) {
        if( elementsTemplate[i] !== undefined && elementsTemplate[i].type !== undefined &&
            elementsTemplate[i].type === TYPE_WYSIWYG)  {

          elementsTemplate[i].typeo = elementsTemplate[i].type;
          elementsTemplate[i].type = DIRECTIVE_WYSIWYG;
          if( elementsTemplate[i].hasOwnProperty('wysiwyg-options') ) {
            if( elementsTemplate[i]['wysiwyg-options'].hasOwnProperty('toolbars') ) {
              elementsTemplate[i].toolbar=elementsTemplate[i]['wysiwyg-options']['toolbars'];
            } else {
              elementsTemplate[i].toolbar = [{ "name" : "basicstyles", "items" : ["Bold", "Italic", "Strike", "-", "RemoveFormat"]}];
            }
          }
          elementsTemplate[i].toolbar = JSON.stringify(elementsTemplate[i].toolbar);

          delete elementsTemplate[i]['wysiwyg-options'];
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
   * Add
   *
   * @function
   * @memberOf CaliopeWebFormSpecificDecorator
   * @param {array} elementsTemplate Elements Field config in the template.
   */
  function completeTypeForm(elementsTemplate) {
    var TYPE_FORM = 'form';
    var TYPE_CWFORM = "cw-form-inner";
    var ATT_OPTIONSFORM = "options-form";
    var ATT_FROM_ROUTEPARAMS = "from-routeparams";

    jQuery.each(elementsTemplate, function(kElement, vElement){

      if( vElement.type === TYPE_FORM) {

        if( !vElement.hasOwnProperty(ATT_OPTIONSFORM) ) {
          throw Error( 'Obligatory attribute '.concat(ATT_OPTIONSFORM).
              concat(' for element ').concat(vElement) );
        }

        vElement.typeo = TYPE_FORM;
        vElement.type = TYPE_CWFORM;
        vElement[ATT_FROM_ROUTEPARAMS] = "false";
        vElement.entity = vElement[ATT_OPTIONSFORM].formId;
        vElement.generic = vElement[ATT_OPTIONSFORM].generic;

        if( vElement[ATT_OPTIONSFORM].hasOwnProperty('autocomplete') ) {
          vElement['cwautocomplete'] = true;
          vElement['find-method'] = vElement[ATT_OPTIONSFORM]['autocomplete'].method;
          vElement['find-formId'] = vElement[ATT_OPTIONSFORM]['formId'];
          vElement['find-load-init'] = vElement[ATT_OPTIONSFORM]['autocomplete']['load-init'];
          vElement['find-load-on-type'] = vElement[ATT_OPTIONSFORM]['autocomplete']['load-on-type'];
          vElement['find-show-fields'] = JSON.stringify( vElement[ATT_OPTIONSFORM]['autocomplete']['show-fields'] );
          vElement['find-find-fields'] = JSON.stringify( vElement[ATT_OPTIONSFORM]['autocomplete']['find-fields'] );
          if( vElement[ATT_OPTIONSFORM]['autocomplete'].hasOwnProperty('type-min-length') ) {
            vElement['find-type-min-length'] = vElement[ATT_OPTIONSFORM]['autocomplete']['type-min-length'];
          }
        } else {
          vElement['cwautocomplete'] = false;
        }

        delete vElement['ng-model'];
        delete vElement['ng-change'];
        delete vElement[ATT_OPTIONSFORM];
      }
    });

  }

  /**
   * TODO: DOCUMENTATION
   *
   * @function
   * @memberOf CaliopeWebFormSpecificDecorator
   * @param {array} elementsTemplate Elements Field config in the template.
   * @param {object} data Elements Field config in the template.
   * @param {CaliopeWebForm} cwForm Elements Field config in the template.*
   */
  function completeTypeExecuteTask(elementsTemplate, data, cwForm) {
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
          elementsTemplate[i].typeo = TYPE_EXCUTETASK;
          var attUUID = elementsTemplate[i].options[NAME_DATA_TARGET_UUID_VAL];
          var attEntity = elementsTemplate[i].options[NAME_DATA_TARGET_ENTITY_VAL];
          if( cwForm.getElement(attUUID).hasOwnProperty('relation') ) {
            var target = getValueAttInObject(data, attUUID, '.');
            var varName = undefined;
            for( varName in target) {
              elementsTemplate[i]['target-uuid'] = varName;
              break;
            }
          } else {
            elementsTemplate[i]['target-uuid'] = getValueAttInObject(data, attUUID, '.');
          }
          elementsTemplate[i]['target-entity'] = getValueAttInObject(data, attEntity, '.');

          var element =  {};
          jQuery.extend(true, element, elementsTemplate[i]);
          element.type = "h1";
          element.html = elementsTemplate[i];
          elementsTemplate[i] = element;

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


        element.typeo = element.type;
        element.type = NAME_DIRECTIVE_MCOMBO;

        if( element.hasOwnProperty(VARNAME_LOAD_OPT_SRV) ) {
          var VARNAME_METHOD = 'method';
          var VARNAME_FIELDVAL = 'field-value';
          var VARNAME_FIELDDESC = 'field-desc';
          var VARNAME_FIELDIMAGE = 'field-image';
          var VARNAME_FORMID = 'formid';
          var VARNAME_DATALIST = 'field-data-list';
          var VARNAME_LOADREMOTE = 'load-remote';


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
        completeTypeExecuteTask(elementsTemplate, data, caliopeWebForm);
        completeTypeCwGrid(elementsTemplate);
        completeTypeRadioButtonsCheckBoxess(elementsTemplate);
        completeTypeForm(elementsTemplate);
        completeTypeWysiwyg(elementsTemplate);
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
   * @param {array} actionsToShow Action to shown in form
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
      var TYPE_ACTION = "cw-action";
      var DIRECTIVE_CLICK = 'ng-click';
      var DIRECTIVE_DISABLED = 'ng-disabled';
      var DIRECTIVE_INIT = 'ng-init';
      var DIRECTIVE_SHOW = 'ng-show';
      var NAME_METHOD_CONTROLLER = 'sendAction';
      var NAME_CLASS_ACTIONS = 'modal-footer';
      var NAME_CLASS_BUTTON_DEFAULT = "btn";
      var VAR_NAME_PARAMS_TO_SEND = "params-to-send";
      /*
      Indicate if the data to send to server must be encapsulated in data attribute. data : {...}
      By default is true
       */
      var VAR_NAME_ENCAPSULTA_INDATA = "encapsulate-in-data";

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
        var show = 'showAct_'.concat(actionMethod).concat('');

        if(actionsToShow === undefined || actionsToShow.length === 0 || actionsToShow.indexOf(actionMethod) >= 0 ) {
          action[DIRECTIVE_INIT] = ''.concat(show).concat('=true');
        } else {
          action[DIRECTIVE_INIT] = ''.concat(show).concat('=false');
        }

        //var actionMethod = structureActions[i][VAR_NAME_METHOD];
        var paramsToSend = structureActions[i][VAR_NAME_PARAMS_TO_SEND];
        if( paramsToSend === undefined ) {
          paramsToSend = "";
        }

        if( structureActions[i][VAR_NAME_ENCAPSULTA_INDATA] !== "false" ) {
          structureActions[i][VAR_NAME_ENCAPSULTA_INDATA] = true;
        }

        action.type = TYPE_ACTION;
        /*
          create ng-click: sendAction(form, 'formName', 'method', 'modelUUID', 'objID', 'params_to_send_to_server');
         */
        action[DIRECTIVE_CLICK] = NAME_METHOD_CONTROLLER.concat("(").
            concat(formName).concat(", ").
            concat("'").concat(formName).concat("', ").
            concat("'").concat(actionMethod).concat("', ").
            concat("'").concat(modelUUID).concat("', ").
            concat("'").concat(objID).concat("', ").
            concat("'").concat(paramsToSend).concat("',").
            concat("'").concat(structureActions[i][VAR_NAME_ENCAPSULTA_INDATA]).concat("'").
            concat(")");
        action[DIRECTIVE_DISABLED] = formName.concat('.$invalid');
        action[DIRECTIVE_SHOW] = show;
        action.name = formName.concat('_').concat(actionMethod) ;
        action.class = NAME_CLASS_BUTTON_DEFAULT;
        action.title = actionName;
        action['action-method'] = actionMethod;
        buttonContainer.html.push(action);
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
        if( caliopeWebForm.getInnerForm() === false ) {
          completeActions(structureInit, structureAction, actionsToShow, formName, modelUUID, objID);
        }
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
     * the scope.
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
   * @returns {object}
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
    var RESTRICTIONS_ATT_NAME = 'restrictions';
    var REQUIRE_ATT_NAME = 'required';
    var MAXLENGTH_ATT_NAME = 'maxlength';
    var MINLENGTH_ATT_NAME = 'minlength';
    var MIN_NUMBER_ATT_NAME = "min";
    var MAX_NUMBER_ATT_NAME = "max";
    var htmlElements = structureInit.html;
    var globalDependencies = {};

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
            var validationType = undefined;
            var params=[];
            /*
            Logic for required validation
            */
            if( varName === REQUIRE_ATT_NAME ) {
              elementsInputs[i].required = validations[REQUIRE_ATT_NAME];
              validationType = 'required';
              if(elementsInputs[i].hasOwnProperty('caption')) {
                elementsInputs[i].caption = elementsInputs[i].caption.concat(' *');
              }
            }
            /*
            Logic for minlegth validation
             */
            if( varName === MINLENGTH_ATT_NAME  ) {
              elementsInputs[i]['ng-minlength'] = validations[MINLENGTH_ATT_NAME];
              validationType = 'minlength';
              params[0] = validations[MINLENGTH_ATT_NAME];
            }
            /*
            Logic for maxlength validation
             */
            if( varName === MAXLENGTH_ATT_NAME  ) {
              elementsInputs[i]['ng-maxlength'] = validations[MAXLENGTH_ATT_NAME];
              validationType = 'maxlength';
              params[0] = validations[MAXLENGTH_ATT_NAME];
            }
            /*
            Logic for min value validation
             */
            if( varName === MIN_NUMBER_ATT_NAME  ) {
              elementsInputs[i].min = validations[MIN_NUMBER_ATT_NAME];
              validationType = 'min';
              params[0] = validations[MIN_NUMBER_ATT_NAME];
            }
            /*
            Logic for max value validation
             */
            if( varName === MAX_NUMBER_ATT_NAME  ) {
              elementsInputs[i].max = validations[MAX_NUMBER_ATT_NAME];
              validationType = 'max';
              params[0] = validations[MAX_NUMBER_ATT_NAME];
            }

            if( validationType !== undefined) {
              /*
              Search continer form input.
               */
              var container = searchContainer(htmlElements,elementsInputs[i]);
              /*
              Add element message to element and create a new container for two elements.
               */
              if( container !== undefined && container) {
                var index = container.indexOf(elementsInputs[i]);
                if( index >= 0 ) {
                  var containerIni = container.slice(0, index + 1);
                  var containerFin = container.slice(index+1);

                  var elementMsgVal = getElementMsgVal(validationType, elementsInputs[i], formName, params);
                  var containerNew = containerIni.concat(elementMsgVal).concat(containerFin);
                  htmlElements = replaceContainer(htmlElements, elementsInputs[i], containerNew);
                  if(htmlElements.hasOwnProperty('replace')) {
                    htmlElements = htmlElements.replace
                  }
                }
              }
            }
          }


          function replaceVarsInCode(code)  {
            return code.replace(new RegExp(CaliopeWebFormConstants.rexp_value_in_form_inrep_code, "g"),"data.").
                replace(new RegExp(CaliopeWebFormConstants.rexp_value_in_form_firep_code, "g"),"");
          }

          /*
          Code for process restrictions.
           */
          var restrictions = elementsInputs[i][VALIDATIONS_ATT_NAME][RESTRICTIONS_ATT_NAME];
          if( restrictions !== undefined ) {

            jQuery.each(restrictions, function(kRestriction, vRestriction) {

              if( vRestriction.evaluation !== undefined && vRestriction.evaluation.length > 0 &&
                  vRestriction.then !== undefined && vRestriction.then.length > 0) {

                var patt = new RegExp(CaliopeWebFormConstants.rexp_value_in_form_code, "g");
                var dependencies = vRestriction.evaluation.match(patt);
                if( dependencies !== undefined ) {
                  jQuery.each(dependencies, function(kDep, vDep) {
                    dependencies[kDep] = CaliopeWebForm.getVarNameScopeFromFormRep(vDep);
                  });
                }

                vRestriction.name = elementsInputs[i].name.concat(kRestriction);
                vRestriction.nameElement = elementsInputs[i].name;
                vRestriction.dependencies =  dependencies;
                vRestriction.evaluation = replaceVarsInCode(vRestriction.evaluation);
                vRestriction.then = replaceVarsInCode(vRestriction.then);
                vRestriction.validationType = 'restriction_'.concat(kRestriction);
                /*
                 Search continer form input.
                 */
                var container = searchContainer(htmlElements,elementsInputs[i]);
                /*
                 Add element message to element and create a new container for two elements.
                 */
                if( container !== undefined && container) {
                  var index = container.indexOf(elementsInputs[i]);
                  if( index >= 0 ) {
                    var containerIni = container.slice(0, index + 1);
                    var containerFin = container.slice(index+1);

                    var elementMsgVal = getElementMsgVal(vRestriction.validationType, elementsInputs[i], formName, params);
                    elementMsgVal.restriction = true;
                    var containerNew = containerIni.concat(elementMsgVal).concat(containerFin);
                    htmlElements = replaceContainer(htmlElements, elementsInputs[i], containerNew);
                    if(htmlElements.hasOwnProperty('replace')) {
                      htmlElements = htmlElements.replace
                    }
                  }
                }

                jQuery.each(vRestriction.dependencies, function(kDep, vDep) {
                  if( !globalDependencies.hasOwnProperty(vDep) ) {
                    globalDependencies[vDep] = [];
                  }
                  if( vDep !== elementsInputs[i].name &&
                      globalDependencies[vDep].indexOf(elementsInputs[i].name) < 0 ) {
                    globalDependencies[vDep].push(elementsInputs[i].name);
                  }
                });

              }
            });
          }

        }
      }
    }

    structureInit.html = htmlElements;
    return globalDependencies;
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

        var validationDependencies = completeValidation(caliopeWebForm.getElements(), structureInit, formName);
        caliopeWebForm.setValidationDependencies(validationDependencies);
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
    var element = undefined;
    for(m=0;m < elements.length ;m++){
      if(name === elements[m].name){
        element = elements[m];
        break;
      }
    }
    return element;
  }

  /**
   * Create and return a column container defined in layout. The new column container will contain
   * the elements of the form
   * @function
   * @memberOf CaliopeWebFormLayoutDecorator
   * @param {array} columnContainer Column container defined in layout
   * @param {array} elementsInputs Element in the form
   * @returns {object} New column container with elements (inputs)
   */
  function getColumnContainer(columnContainer, elementsInputs) {

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
      var columnContainer = getColumnContainer(cont.columns[j], elementsInputs);
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