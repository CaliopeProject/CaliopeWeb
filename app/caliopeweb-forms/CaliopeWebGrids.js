/**
 * Module of Caliope Web Grids.
 */
var CaliopeWebGrid = (function() {

  var gridName;
  var gridDataName;
  var gridProperties;
  var data;
  var columns;
  var columnsToRender;
  var structureToRender;
  var connectionToServer;
  var parMethodRequest;
  var parParameters;
  var methodProcessResponse;
  var decorators;


  /**
   *
   * @returns {*}
   */
  function loadDataFromServer(connectionToServer, methodProcessResponse, parMehodRequest, parParameters) {
    var response = connectionToServer.sendRequest(parMehodRequest, parParameters);
    return processResponseFromServer(response, methodProcessResponse)
  }

  /**
   *
   * @param responseFromServer
   * @returns {*}
   */
  function processResponseFromServer(responseFromServer, methodProcessResponse) {
    var processedResponse = methodProcessResponse(responseFromServer);
    return processedResponse;
  }


  /**
   * Constructor of CaliopeWebForm module
   * @constructor
   */
    var CaliopeWebGrid = function(_connectionToServer, _parMethodRequest,
      _parParameters, _methodProcessResponse) {
      this.structureToRender = {};
      this.columns = {};
      this.gridProperties = {};
      this.connectionToServer = _connectionToServer;
      this.methodProcessResponse = _methodProcessResponse;
      this.parMethodRequest = _parMethodRequest;
      this.parParameters = _parParameters;
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
        this.gridName = _gridName;
      },

    /**
     * Add the data received from the server.
     * @param _data
     */
      addData: function(_data) {
        this.data = _data;
      },

    /**
     * Indicate the columns to show in the data grid.
     * @param _columnsToRender
     */
      //TODO: Eliminar cuando no se referencia más en el código
      addColumnsToRender : function(_columnsToRender) {
        this.columnsToRender = _columnsToRender;
      },

    /**
     *
     * @param name
     * @param properties
     */
      addColumn : function(name, properties) {
        this.columns[name] = properties;
      },

    /**
     *
     * @param name
     * @param properties
     */
      addColumnProperties: function(name, properties) {
        if( name !== undefined && name in this.columns) {
          jQuery.extend(this.columns[name], properties);
        } else {
          this.columns[name] = properties;
        }
      },

    /**
     * Add a set of porperties to grid
     * @param name
     * @param properties
     */
    addGridProperties: function(properties) {
      jQuery.extend(this.gridProperties, properties);
    },

    /**
     * Add or replace a value of a grid property
     * @param name Property name
     * @param value Property value
     */
    addGridProperty: function(name, value) {
      this.gridProperties[name] = value;
    },

    /**
     * Create the structure to render the form. Use decorates for change the structure to
     * render
     * @returns {*}
     */
      createStructureToRender : function() {
        return this.structureToRender;
      },

    /**
     *
     * @returns {*}
     */
      getColumns : function() {
        return this.columns;
      },

    /**
     *
     * @returns {*}
     */
      getColumnsToRender : function() {
        return this.columnsToRender;
      },

    /**
     * Get the data of the grid.
     */
      getData : function() {
        return this.data;
      },

    /**
     * Get the name of the form.
     * @returns {String}
     */
      getGridName : function() {
        return this.gridName;
      },

      /**
       * Get the name of the data in grid
       * return {String}
       */
      getGridDataName : function() {
        return this.gridDataName;
      },

    /**
     * Get the properties of grid
     * @returns {array} Properties
     */
      getGridProperties : function() {
        return this.gridProperties;
      },
      /**
       *
       */
      loadDataFromServer : function() {
        return loadDataFromServer(this.connectionToServer, this.methodProcessResponse, this.parMethodRequest, this.parParameters);
      },

      /**
       *
       * @param _decorators {Array} decorates to use in create structure to render
       */
      setDecorators : function(_decorators) {
        this.decorators = _decorators;
      },

    /**
     * Set parameters to request server when load data grid.
     * @param _parameters {Object} Parameters to send to server
     */
      setParameters : function(_parameters) {
        this.parParameters = _parameters;
      },

    /**
     * Set the name of the data in the grid.
     * @param _nameDataGrid
     */
      setGridDataName : function(_gridDataName) {
        this.gridDataName = _gridDataName;
      },

      /**
       *
       */
      applyDecorators : function() {

        if( this.decorators !== undefined && this.decorators.length > 0 ) {
          var i;
          for(i = 0; i < this.decorators.length; i++ ) {
            this.structureToRender = this.decorators[i].createStructureToRender(this);
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
            cellTemplate: columns[key].htmlContent,
            width : columns[key].width,
            visible: columns[key].show,
            cellClass : columns[key]['class']
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