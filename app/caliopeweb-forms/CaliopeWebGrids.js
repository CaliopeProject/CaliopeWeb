/**
 * Module of Caliope Web Grids.
 */
var CaliopeWebGrid = (function() {

    var gridName;
    var data;
    var columnsName;
    var columnsToRender;
    var structureToRender;


  /**
   * Constructor of CaliopeWebForm module
   * @constructor
   */
    var CaliopeWebGrid = function() {
      structureToRender = {};
    };

  /**
   * Prototype of CaliopeWebForms module
   * @type {{}}
   */
  CaliopeWebGrid.prototype = {
    /**
     * Constructor
     */
      constructor:  CaliopeWebGrid,

    /**
     * Add grid name.
     * @param _gridName
     */
      addGridName: function(_gridName) {
        gridName = _gridName;
      },

    /**
     * Add the data received from the server.
     * @param _data
     */
      addData: function(_data) {
        data = _data;
      },

    /**
     * Add the columns name for the data.
     * @param _columnsName
     */
      addColumnsName : function(_columnsName) {
        columnsName = _columnsName;
      },

    /**
     * Indicate the columns to show in the data grid.
     * @param _columnsToRender
     */
      addColumnsToRender : function(_columnsToRender) {
        columnsToRender = _columnsToRender;
      },

    /**
     * Create the structure to render the form. Use decorates for change the structure to
     * render
     * @returns {*}
     */
      createStructureToRender : function() {
        return structureToRender;
      },

    /**
     * Get the data of the grid.
     */
      getData : function() {
        return data;
      },
    /**
     * Get the name of the form.
     * @returns {*}
     */
      getFormName : function() {
        return gridName;
      }

    };

    return CaliopeWebGrid;

}());

/**
 * Module of decorator for CaliopeWebGrid. This decorate the data
 */
var CaliopeWebGridDataDecorator = ( function() {

  function transformData(dataInit) {
    var dataT = [];
    if( dataInit !== undefined ) {
      var i;
      for( i=0; i<dataInit.length; i++ ) {
        var reg = dataInit[i];
        var obj = {};
        if( reg !== undefined ) {
          var varname;
          for( varname in reg ) {
            obj[varname] = reg[varname].value;
          }
        }
        dataT.push(obj);
      }
    }
    return dataT;
  }

  return {
     createStructureToRender : function(caliopeWebForm) {
      var structureToRenderInit = caliopeWebForm.createStructureToRender();
      var dataInit = caliopeWebForm.getData();
      caliopeWebForm.createStructureToRender = function() {

        if( dataInit !== 'undefined' ) {
          structureToRenderInit.data = transformData(dataInit);
        }
        return structureToRenderInit;
      };
    }
  }
}());