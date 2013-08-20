/**
 * Module of Caliope Web Form.
 */
var CaliopeWebForm = (function() {

    var formName;
    var modelUUID;
    var structure;
    var data;
    var actions;
    var translations;
    var structureToRender;
    var layout;
    /**
     * Contains the elements (inputs) of form
     */
    var elementsForm;
    /**
     * Contains the names of the elements(inputs).
     */
    var elementsFormName;


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

    function searchElements(_structure) {
      var result = searchElementsRecursive(_structure);
      return {
        'elements' : result.elements,
        'elementsName' : result.elementsName
      };
    }


  /**
   * Constructor of CaliopeWebForm module
   * @constructor
   */
    var CaliopeWebForm = function() {
    };

  /**
   * Prototype of CaliopeWebForms module
   * @type {{}}
   */
  CaliopeWebForm.prototype = {
    /**
     * Constructor
     */
      constructor:  CaliopeWebForm,
    /**
     * Add the initial structure to the form
     * @param _structure Structure of the form
     * @param _formName Name of the form
     */
      addStructure: function (_structure, _formName) {
        var result = searchElements(_structure);
        formName = _formName;
        elementsForm = result.elements;
        elementsFormName = result.elementsName;
        structure = _structure;
      },
    /**
     * Add the data structure to the form.
     * @param _data
     */
      addData: function(_data) {
        data = _data;
        if(_data !== undefined) {
          modelUUID = _data['uuid'].value;
        }
      },
    /**
     * Add the actions structure to the form
     * @param _actions
     */
      addActions: function(_actions) {
        actions = _actions;
      },
    /**
     *
     * @param _translations
     */
      addTranslations: function(_translations) {
        translations = _translations;
      },

    /**
     *
     * @param _layout
     */
      addlayout: function(_layout) {
         layout = _layout;
      },

    /**
     * Create the structure for the render the form. Use decorates for add new structure
     * to original structure.
     * @returns {*}
     */
      createStructureToRender : function() {
        structureToRender = structure;
        return structureToRender;
      },

    /**
     * Get the actions structure
     * @returns {*}
     */
      getActions : function() {
        return actions;
      },


    /**
     *  Get the form data
     * @returns {*}
     */
      getData : function() {
        return data;
      },

    /**
     * Get the elements (input) of the form.
     * @returns {*}
     */
      getElements : function() {
        return elementsForm;
      },

    /**
     * Get the layout of the template.
     * @param {*}
     */
      getlayout : function() {
         return layout;
      },
    /**
     * Get the names of the elements (inputs).
     * @returns {*}
     */
      getElementsName : function() {
        return elementsFormName;
      },
    /**
     * Get the name of the form.
     * @returns {*}
     */
      getFormName : function() {
        return formName;
      },
      getModelUUID : function() {
        return modelUUID;
      },
    /**
     * Put the data represented for data structure in a specific context.
     * @param context
     */
      putDataToContext : function(context, elements) {

        if (data !== undefined) {
          var varname;
          for (varname in data) {
            if(data.hasOwnProperty(varname)) {
              context[varname] = data[varname].value;
            }
          }
        }
      },

      render : function() {
        //TODO: Determinar como se puede realizar el render de la forma sobre el DOM de la página.
      },

      validate :function() {
        //TODO: Determinar como se puede realizar la validación de la forma.
      }

    };

    return CaliopeWebForm;

}());

/**
 * Module decorator for CaliopeWebForm. This decorate the structure with the specific syntax
 * for Angular.
 */
var CaliopeWebFormSpecificDecorator = ( function() {

  var formsWithOwnController = ['login'];
  var ctrlSIMMName           = 'SIMMFormCtrl';
  var ctrlEndName            = 'Ctrl';

  function completeController(structureInit, formName) {
    var valueNgCtrl = ctrlSIMMName;

    if( formsWithOwnController.indexOf(formName) >= 0 ) {
      valueNgCtrl = formName;
      valueNgCtrl = valueNgCtrl.slice(0, 1).toUpperCase().concat(
          valueNgCtrl.slice(1, valueNgCtrl.length)
      );
      valueNgCtrl = valueNgCtrl.concat(ctrlEndName);
    }
    if( valueNgCtrl !== null) {
      structureInit['ng-controller'] = valueNgCtrl;
    }

  }

  function completeModel(elementsInputs) {
    var i;
    for( i = 0; i < elementsInputs.length; i++  ) {
      completeModelIndividual(elementsInputs[i]);
    }
  }

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
   * This function transform the element of type select for add the behavior of load the
   * options from server. Add the directive cw-option for this purpose.
   * @param elementsInputs Elements Field config in the template.
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
   * This function transform the element of type select for add the behavior of load the
   * options from server. Add the directive cw-option for this purpose.
   * @param elementsInputs Elements Field config in the template.
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
          if(element[VARNAME_LOAD_OPT_SRV][VARNAME_FORMID] !== undefined) {
            element.formid = element[VARNAME_LOAD_OPT_SRV][VARNAME_FORMID];
          }
          if(element[VARNAME_LOAD_OPT_SRV][VARNAME_DATALIST] !== undefined) {
            element[VARNAME_DATALIST] = element[VARNAME_LOAD_OPT_SRV][VARNAME_DATALIST];
          }
          element[VARNAME_LOADREMOTE] = true;
          element[NAME_DIRECTIVE_MCOMBO] = "mc-".concat(element.name);
          element[VARNAME_SELECTEDCHOICES] = "";
          /*
          Get choices selected and put in attribute define in var VARNAME_SELECTEDCHOICES
          */
          if( data !== undefined ) {
            var selectedChoices = data[element.name];
            if( selectedChoices !== undefined && selectedChoices.value !== undefined ) {
              selectedChoices = selectedChoices.value;
            }
            if( selectedChoices !== undefined ) {
              if( selectedChoices instanceof Array ) {
                var i = 0;
                for( i=0; i < selectedChoices.length; i++ ) {
                  element[VARNAME_SELECTEDCHOICES] = element[VARNAME_SELECTEDCHOICES].
                    concat(selectedChoices[i]).concat(",")
                }
              } else if( selectedChoices.value instanceof String ) {
                element[VARNAME_SELECTEDCHOICES] = "'".concat(selectedChoices.value).concat("'")
              }
            }
          }

        }
      });
    }
  }

  return {
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

        return structureInit;
      };
    }
  };
}());

/**
 * Module decorator for CaliopeWebForm. This decorate the actions with the specific syntax
 * for Angular and actions specific in actions structure.
 */
var CaliopeWebFormActionsDecorator = ( function() {

  function completeActions(structureInit, structureActions,formName, modelUUID, objID) {

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

      structureInit.html.push(buttonContainer);
    }
  }

  return {
    createStructureToRender : function(caliopeWebForm) {
      var structureInit = caliopeWebForm.createStructureToRender();
      var structureAction = caliopeWebForm.getActions();
      var formName = caliopeWebForm.getFormName();
      var modelUUID = caliopeWebForm.getModelUUID();
      var objID;
      if( caliopeWebForm.getData() !== undefined && caliopeWebForm.getData().uuid !== 'undefined') {
        objID = caliopeWebForm.getData().uuid.value;
      }
      if( objID === undefined ) {
        objID = '';
      }
      caliopeWebForm.createStructureToRender = function() {
        completeActions(structureInit, structureAction, formName, modelUUID, objID);
        return structureInit;
      };
    }
  };
}());

/**
 * Module decorator for CaliopeWebForm. This decorate the data in the form.
 */
var CaliopeWebFormDataDecorator = ( function() {
  return {
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
 * Module decorator for CaliopeWebForm. This decorate the translations in the labels or captions
 * of the elements in the form.
 */
var CaliopeWebFormLocaleDecorator = ( function() {
  return {
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
 * Module decorator for CaliopeWebForm. This decorate the inputs of type attachment with
 * the ng-file-uploader directive.
 */
var CaliopeWebFormAttachmentsDecorator = ( function() {

  function replaceAttachemnt(elementsInit, modelUUID) {

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
    createStructureToRender : function(caliopeWebForm) {
      var structureInit = caliopeWebForm.createStructureToRender();
      var elementsInit = caliopeWebForm.getElements();
      var modelUUID = caliopeWebForm.getModelUUID();
      caliopeWebForm.createStructureToRender = function() {

        replaceAttachemnt(elementsInit, modelUUID);

        return structureInit;
      };
    }
  };
}());


/**
 * Module decorator for CaliopeWebForm. This decorate with validations configured in json
 * template.
 */
var CaliopeWebFormValidDecorator = ( function() {


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
        stParameters = stParameters.concat('|').concat(params[i]);
      }
    }
    return {
      "type"  : "cw-validation-mess",
      "name"  : nameDirective,
      "ng-show"  : stShowDirty.concat(" && ").concat(stShowError).
          concat(".").concat(validationType),
      "validation-type"  : validationType,
      "params" : params
    };
  }

  function searchContainer(htmlElements, elementSearch) {

    var result;

    if( htmlElements !== undefined ) {
      var i;
      if( htmlElements instanceof Array ) {
        for(i=0; i<htmlElements.length; i++) {
          if( htmlElements[i].html !== undefined ) {
            result = searchContainer(htmlElements[i].html, elementSearch)
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
          searchContainer(htmlElements.html, elementSearch)
        }
      }
    }
    return result;

  }


  function replaceContainer(htmlElements, containerSearch, containerNew) {

    if( htmlElements !== undefined ) {
      var i;
      if( htmlElements instanceof Array ) {
        for(i=0; i<htmlElements.length; i++) {
          if( htmlElements[i].html !== undefined ) {
            var htmlElementsReplacedTmp = replaceContainer(htmlElements[i].html, containerSearch, containerNew)
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
          return replaceContainer(htmlElements.html, containerSearch, containerNew)
        }
      }
    }

    return htmlElements;
  }

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
      /**
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
 * Module decorator for CaliopeWebForm. This decorate the layout for the form
 */
var CaliopeWebFormLayoutDecorator = ( function() {


  function replaceWithElements(name, elements) {
    var m;
    for(m=0;m < elements.length ;m++){
      if(name === elements[m].name){
       return elements[m];
      }
    }
    console.log('Error calipeWebForms no se encontro parametro ' +  name);
  }

  function getColumnContainer(columnContainer, elementsInputs, columnIndex) {

    var containerColumns = {
      type : "div",
      class : columnContainer.class,
      html  :  []
    };

    var  r;
    for(r=0; r < columnContainer.elements.length ;r++) {
      var objNew = replaceWithElements(columnContainer.elements[r], elementsInputs);
      containerColumns.html.push(objNew);
    }

    return containerColumns;
  }

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
