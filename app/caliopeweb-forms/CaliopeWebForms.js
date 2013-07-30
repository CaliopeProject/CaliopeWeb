/**
 * Module of Caliope Web Form.
 */
var CaliopeWebForm = (function() {

    var formName;
    var formUUID;
    var structure;
    var data;
    var actions;
    var translations;
    var structureToRender;
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
      }
    }

    function searchElementsIndividual(elementsAll) {
      var elementsTypeName = [];
      var elementsType = [];

      elementsType = jQuery.grep(elementsAll, function(obj) {
        /*TODO: Mejorar para que solo coincidan los elementos de cierto tipo. Por
         ejemplo aquellos que se renderizan como un input.
         */
        return obj.type !== undefined;
      });

      for ( var i = 0; i < elementsType.length; i++) {
        var name = elementsType[i].name;
        if( name == null ) {
          name = elementsType[i].id;
        }
        elementsTypeName.push(name);
      }

      return {
        'elements' : elementsType,
        'elementsName' : elementsTypeName
      }
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
        formUUID = UUIDjs.create().hex;
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
      getFormUUID : function() {
        return formUUID;
      },
    /**
     * Put the data represented for data structure in a specific context.
     * @param context
     */
      putDataToContext : function(context) {
        var varname = "";
        if (data !== undefined) {
          for (varname in data) {
            context[varname] = data[varname].value;
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
    if( valueNgCtrl != null) {
      structureInit['ng-controller'] = valueNgCtrl;
    }

  }

  function completeModel(elementsInputs, formName) {
    var i;
    for( i = 0; i < elementsInputs.length; i++  ) {
      completeModelIndividual(elementsInputs[i]);
    }
  }

  function completeModelIndividual(element) {
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
      console.error('No se encontro valor para el atributo name en el template.', element);
    }
    element['ng-model'] = valueNgModel;
  }

  function completeTypeSelect(elementsInputs) {


    /*
     * Verificar que existan elementos
     */
    if( elementsInputs !== undefined && elementsInputs.length > 0) {
      var i;
      /*
      Seleccionar los elementos que sean de tipo select
       */
      var elementsSelect = jQuery.grep(elementsInputs, function(obj) {
          return obj.type === 'select';
      });
      /*
      Para cada elemento del tipo select verificar si tiene options y como atributo de
      options entity, si cumple esta condición entonces asociar la directiva cw-options
      para indicar que los options del select se deben recuperar desde el server.
       */
      jQuery.each(elementsSelect, function(index, element){
        var NAMEVAR_LOAD_OPT_SRV = 'options-load-server';
        var NAMEVAR_ENTITY = 'entity';

        if( element.hasOwnProperty(NAMEVAR_LOAD_OPT_SRV) ) {
          var NAMEVAR_DIRECTIVE_CWOPT = 'cw-options';
          var VARNAME_DIRECTIVE_OPT = 'ng-options';

          element.fromserver = true;
          element.entity = element[NAMEVAR_LOAD_OPT_SRV][NAMEVAR_ENTITY];
          element[ NAMEVAR_DIRECTIVE_CWOPT] = '';
          element.options = {};
          element[ VARNAME_DIRECTIVE_OPT] = 'opt.desc for opt in options';
        }
      });
    }
  };

  return {
    createStructureToRender : function(caliopeWebForm) {

      var structureInit = caliopeWebForm.createStructureToRender();

      caliopeWebForm.createStructureToRender = function() {
        completeController(structureInit, caliopeWebForm.getFormName());
        completeModel(caliopeWebForm.getElements(), caliopeWebForm.getFormName());
        completeTypeSelect(caliopeWebForm.getElements());
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

  function completeActions(structureInit, structureActions,formName, formUUID, objID) {
    if( structureActions != null && structureActions.length > 0 ) {

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
      }


      for ( var i = 0; i < structureActions.length; i++) {
        var action = {};
        var actionName = structureActions[i][VAR_NAME_NAME];
        var actionMethod = structureActions[i][VAR_NAME_METHOD];
        var paramsToSend = structureActions[i][VAR_NAME_PARAMS_TO_SEND];
        if( paramsToSend === undefined ) {
          paramsToSend = "";
        }
        action.type = TYPE_ACTION;
        /*
          create ng-click: sendAction(form, 'formName', 'method', 'formUUID', 'objID', 'params_to_send_to_server');
         */
        action[DIRECTIVE_NG_CLICK] = NAME_METHOD_CONTROLLER.concat("(").
            concat(formName).concat(", ").
            concat("'").concat(formName).concat("', ").
            concat("'").concat(actionMethod).concat("', ").
            concat("'").concat(formUUID).concat("', ").
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
      var formUUID = caliopeWebForm.getFormUUID();
      var objID;
      if( caliopeWebForm.getData() !== undefined && caliopeWebForm.getData().uuid !== 'undefined') {
        objID = caliopeWebForm.getData().uuid.value;
      }
      if( objID == undefined ) {
        objID = '';
      }
      caliopeWebForm.createStructureToRender = function() {
        completeActions(structureInit, structureAction, formName, formUUID, objID);
        return structureInit;
      };
    }
  }
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
  }
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
  }
}());

/**
 * Module decorator for CaliopeWebForm. This decorate the inputs of type attachment with
 * the ng-file-uploader directive.
 */
var CaliopeWebFormAttachmentsDecorator = ( function() {

  function replaceAttachemnt(elementsInit, formUUID) {

    var varNameType = 'type';
    var nameTypeAtt = 'attachment';
    var nameAttachDirective = 'ng-fileuploader';
    var varNameFormUUID = 'formuuid';
    var varNameFieldAtt = 'fieldattch';

    if( elementsInit !== null ) {
      var i;
      for( i=0; i<elementsInit.length; i++ ) {
        if( elementsInit[i].hasOwnProperty(varNameType) &&
            elementsInit[i][varNameType] === nameTypeAtt ) {
          elementsInit[i][varNameType] = nameAttachDirective;
          elementsInit[i][varNameFormUUID] = formUUID;
          elementsInit[i][varNameFieldAtt] = elementsInit[i].name;
        }
      }
    }

  }

  return {
    createStructureToRender : function(caliopeWebForm) {
      var structureInit = caliopeWebForm.createStructureToRender();
      var elementsInit = caliopeWebForm.getElements();
      var formUUID = caliopeWebForm.getFormUUID();
      caliopeWebForm.createStructureToRender = function() {

        replaceAttachemnt(elementsInit, formUUID);

        return structureInit;
      };
    }
  }
}());


/**
 * Module decorator for CaliopeWebForm. This decorate with validations configured in json
 * template.
 */
var CaliopeWebFormValidDecorator = ( function() {


  function getElementMsgVal(validationType, element, formName, params) {
    var varNameRequired = 'required';
    var varNameDirty = '$dirty';
    var varNameError = '$error';

    var nameDirective = "msg-";
    var elementName = "";
    if( element.hasOwnProperty('name') ) {
      elementName = element.name
      nameDirective = nameDirective.concat(elementName);
    }
    var stElement = formName.concat('.').concat(elementName);
    var stShowDirty = stElement.concat('.').concat(varNameDirty);
    var stShowError = stElement.concat('.').concat(varNameError);


    var  elementMsg = {
      "type"  : "cw-validation-mess",
      "name"  : nameDirective,
      "ng-show"  : stShowDirty.concat(" && ").concat(stShowError).
          concat(".").concat(validationType),
      "validation-type"  : validationType
    };
    return elementMsg;
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

            var index = htmlElements.indexOf(elementsInputs[i]);
            if( index >= 0 ) {
              var htmlElementsIni = htmlElements.slice(0, index + 1);
              var htmlElementsFin = htmlElements.slice(index+1);

              var elementMsgVal = getElementMsgVal(validationType, elementsInputs[i], formName, params);
              htmlElements = htmlElementsIni.concat(elementMsgVal).concat(htmlElementsFin);
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
  }


}());