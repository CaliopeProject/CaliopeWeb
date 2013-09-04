/**
 * Module of Caliope Web Grids.
 */
var CaliopeWebGrid = (function() {

  var gridName;
  var data;
  var columns;
  var columnsName;
  var columnsToRender;
  var structureToRender;
  var connectionToServer;
  var parMethodRequest;
  var parParameters;
  var methodProcessResponse;
  var decorators;



  function loadDataFromServer() {
    var response = connectionToServer.sendRequest(parMethodRequest, parParameters);
    return processResponseFromServer(response)
  }

  function processResponseFromServer(responseFromServer) {
    var processedResponse = methodProcessResponse(responseFromServer);
    return processedResponse;
  }


  /**
   * Constructor of CaliopeWebForm module
   * @constructor
   */
    var CaliopeWebGrid = function(_connectionToServer, _parMethodRequest,
      _parParameters, _methodProcessResponse) {
      structureToRender = {};
      columns = {};
      columnsName = [];
      connectionToServer = _connectionToServer;
      methodProcessResponse = _methodProcessResponse;
      parMethodRequest = _parMethodRequest;
      parParameters = _parParameters;
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
      //TODO: Eliminar cuando no se referencia más en el código
      addColumnsToRender : function(_columnsToRender) {
        columnsToRender = _columnsToRender;
      },

    /**
     *
     * @param name
     * @param properties
     */
      addColumn : function(name, properties) {
        columns[name] = properties;
        columnsName.push(name);
      },

      addColumnProperties: function(name, properties) {
        if(name in columns) {
          jQuery.extend(columns[name], properties);
        }
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
     *
     * @returns {*}
     */
      getColumns : function() {
        return columns;
      },

    /**
     *
     * @returns {*}
     */
      getColumnsToRender : function() {
        return columnsToRender;
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
      },

      /**
       *
       */
      loadDataFromServer : function() {
        return loadDataFromServer();
      },

      /**
       *
       * @param _decorators {Array} decorates to use in create structure to render
       */
      setDecorators : function(_decorators) {
        decorators = _decorators;
      },

      /**
       *
       */
      applyDecorators : function() {

        if( decorators !== undefined && decorators.length > 0 ) {
          var i;
          for(i = 0; i < decorators.length; i++ ) {
            structureToRender = decorators[i].createStructureToRender(this);
          }
        }
      }


    };

    return CaliopeWebGrid;

}());

/**
 * Module of decorator for CaliopeWebGrid. This decorate the data
 */
var CaliopeWebGridDataDecorator = ( function() {

  function transformData(dataInit, columns) {
    var dataT = [];

    if( columns === undefined ) {
      columns = {};
    }

    if( dataInit !== undefined ) {
      var i;
      for( i in dataInit) {
        var reg = dataInit[i];
        var obj = {};
        if( reg !== undefined ) {
          var varname;
          for( varname in reg ) {
            if( reg.hasOwnProperty(varname) && (
                columns.length === 0 || varname in columns  ) ) {
              obj[varname] = reg[varname];
            }
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
      var columns = caliopeWebForm.getColumns();
      caliopeWebForm.createStructureToRender = function() {

        if( dataInit !== 'undefined' ) {
          structureToRenderInit.data = transformData(dataInit, columns);
        }
        return structureToRenderInit;
      };
    }
  }
}());

/**
 * Module of decorator for CaliopeWebGrid. This decorate the structure with columnsDef
 * defined and required in directive ng-grid
 */
var CWGridColumnsDefNgGridDecorator = ( function() {

  function generateColumnDefs(columns) {
    var columnsDef = [];

    if( columns === undefined ) {
      columns = {};
    }

    if( columns !== undefined ) {
      var key;
      for( key in columns ) {
        if( columns.hasOwnProperty(key) ) {
          var columnDef = {
            field: key,
            displayName: columns[key].name,
            cellTemplate: columns[key].htmlContent
          }
        }
        columnsDef.push(columnDef);
      }
    }
    return columnsDef;
  }

  return {
    createStructureToRender : function(caliopeWebForm) {
      var structureToRenderInit = caliopeWebForm.createStructureToRender();
      var columns = caliopeWebForm.getColumns();

      caliopeWebForm.createStructureToRender = function() {
        structureToRenderInit.columnsDef = generateColumnDefs(columns) ;
        return structureToRenderInit;
      };

    }
  }
}());