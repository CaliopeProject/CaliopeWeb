/**
 * Module of Caliope Web Form.
 */
var CaliopeWebForm = (function() {

    var formName;
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
        var resultElements = searchElementsRecursive(structureForm.html);
        jQuery.merge(elements,resultElements.elements);
        jQuery.merge(elementsName,resultElements.elementsName);
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

    var render = function() {

    };

    var createStructure = function() {
      return structure;
    } ;

    var validate = function() {

    };

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
 * Module of decorator for CaliopeWebForm. This decorate the structure with the specific syntax
 * for Angular.
 */
var CaliopeWebFormSpecificDecorator = ( function() {

  var formsWithOwnController = ['login'];
  var ctrlSIMMName           = 'SIMMFormCtrl';
  var ctrlEndName            = 'Ctrl';
  var inputsNames            = [];
  var inputs                 = [];


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
      console.error('No se encontro valor para el atributo name en el template.');
    }
    element['ng-model'] = valueNgModel;
  }

  return {
    createStructureToRender : function(caliopeWebForm) {

      var structureInit = caliopeWebForm.createStructureToRender();

      caliopeWebForm.createStructureToRender = function() {
        completeController(structureInit, caliopeWebForm.getFormName());
        completeModel(caliopeWebForm.getElements(), caliopeWebForm.getFormName());
        return structureInit;
      };
    }
  };
}());

/**
 * Module of decorator for CaliopeWebForm. This decorate the actions with the specific syntax
 * for Angular and actions specific in actions structure.
 */
var CaliopeWebFormActionsDecorator = ( function() {

  function completeActions(structureInit, structureActions,formName) {

    if( structureActions != null && structureActions.length > 0 ) {
      for ( var i = 0; i < structureActions.length; i++) {
        var action = {};
        action.type = "button";
        action['ng-click'] = structureActions[i] + "(" + formName +")";
        var actionSrv = structureActions[i];
        action.html = actionSrv;
        structureInit.html.push(action);
      }
    }
  }

  return {
    createStructureToRender : function(caliopeWebForm) {
      var structureInit = caliopeWebForm.createStructureToRender();
      var structureAction = caliopeWebForm.getActions();
      var formName = caliopeWebForm.getFormName();

      caliopeWebForm.createStructureToRender = function() {
        completeActions(structureInit, structureAction, formName);
        return structureInit;
      };
    }
  }
}());

/**
 * Module of decorator for CaliopeWebForm. This decorate the data in the form.
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
 * Module of decorator for CaliopeWebForm. This decorate the translations in the labels or captions
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