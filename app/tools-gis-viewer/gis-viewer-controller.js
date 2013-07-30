define(['angular', 'gis-ext-base','gis-heron'], function(angular) {
  'use strict';

  var moduleControllers = angular.module('GisViewerController',[]);

  moduleControllers.controller('GisViewerController',
      ['$scope', '$routeParams','caliopewebTemplateSrv',
      function ($scope, $routeParams, caliopewebTemplateSrv) {

          Ext.namespace('Heron.options.map');
          Ext.namespace('Heron.App.mapPanel');

          $scope.data = [
          ];
          $scope.gridOptions = {
              'data': 'data'
          };
          var barmanpre;

          var bounds = new OpenLayers.Bounds(
              -74.221, 4.471,
              -74.008, 4.849
          );

          var resultReader = new Ext.data.JsonReader({
              // metadata configuration options:
              idProperty: 'uuid',
              root: 'data',
              fields: [
                  {name: 'estado'},
                  {name: 'ficha'},
                  {name: 'forma_intervencion'},
                  {name: 'localidad'},
                  {name: 'nombre'},
                  {name: 'timestamp'},
                  {name: 'uuid'}
              ]
      });

          var store = new Ext.data.ArrayStore({
              reader: resultReader
          });

          var grid = new Ext.grid.GridPanel({
              store: store,
              columns: [
                  {
                      id       :'estado',
                      header   : 'Estado',
                      width    : 160,
                      sortable : true,
                      dataIndex: 'estado'
                  },
                  {
                      id       :'ficha',
                      header   : 'Ficha',
                      width    : 160,
                      sortable : true,
                      dataIndex: 'ficha'
                  },
                  {
                      id       :'forma_intervencion',
                      header   : 'Forma de Intervención',
                      width    : 160,
                      sortable : true,
                      dataIndex: 'forma_intervencion'
                  },
                  {
                      id       :'localidad',
                      header   : 'Localidad',
                      width    : 160,
                      sortable : true,
                      dataIndex: 'localidad'
                  },
                  {
                      id       :'nombre',
                      header   : 'Nombre',
                      width    : 160,
                      sortable : true,
                      dataIndex: 'nombre'
                  },
                  {
                      id       :'timestamp',
                      header   : 'timestamp',
                      width    : 160,
                      sortable : true,
                      dataIndex: 'timestamp'
                  },
                  {
                      id       :'uuid',
                      header   : 'uuid',
                      width    : 160,
                      sortable : true,
                      dataIndex: 'uuid'
                  }
              ],
              stripeRows: true,
              autoExpandColumn: 'estado',
              height: 350,
              width: 600,
              title: 'Lote',
              stateful: true,
              stateId: 'grid'
          });


		Heron.options.map.settings = {
			projection: 'EPSG:4686',
			maxExtent: bounds,
			maxResolution: 0.0010794266378287,//Resolucion escala 1:100.000 es 0.0003174784228908226,
            minResolution: 0.00000421651030401836,
			zoom: 0
		};
		Heron.options.map.layers = [
            new OpenLayers.Layer.WMS("Orto Imagen IDECA",
                "http://imagenes.catastrobogota.gov.co/arcgis/services/Ortho2010/MapServer/WMSServer?",
				  {
                      layers: "0",
                      format: "image/png"
                  }
            ),
            new OpenLayers.Layer.WMS("Area territorial",
                "http://mapas.catastrobogota.gov.co/arcgiswsh/Mapa_Referencia/Mapa_referencia/MapServer/WMSServer?",
                {
                    layers: "4",
                    format: "image/png",
                    transparent: true
                },
                {
                    isBaseLayer:false
                }
            ),
            new OpenLayers.Layer.WMS("Area Urbanistica",
                "http://mapas.catastrobogota.gov.co/arcgiswsh/Mapa_Referencia/Mapa_referencia/MapServer/WMSServer?",
                {
                    layers: "9",
                    format: "image/png",
                    transparent: true
                },
                {
                    isBaseLayer:false
                }
            ),
            new OpenLayers.Layer.WMS("Localidad",
                "http://mapas.catastrobogota.gov.co/arcgiswsh/Mapa_Referencia/Mapa_referencia/MapServer/WMSServer?",
                {
                    layers: "7",
                    format: "image/png",
                    transparent: true
                },
                {
                    isBaseLayer:false
                }
            ),
            new OpenLayers.Layer.WMS("Manzana",
                "http://mapas.catastrobogota.gov.co/arcgiswsh/Mapa_Referencia/Mapa_referencia/MapServer/WMSServer?",
                {
                    layers: "12",
                    format: "image/png",
                    transparent: true
                },
                {
                    isBaseLayer:false
                }
            )
            ,
            new OpenLayers.Layer.WMS("Lotes",
                "http://localhost:9000/gis_proxy/WMSServer",
                {
                    layers: "14",
                    format: "image/png",
                    transparent: true
                },
                {
                    isBaseLayer:false
                }
            )
        ];
          var layerTreeDialog = new Ext.Window({
              layout: "fit",
              width: 350,
              height: 150,
              renderTo: "siim_mapdiv",
              constrain: true,
              closeAction: 'hide'
          });

          var gridDialog = new Ext.Window({
              layout: "fit",
              width: 350,
              height: 150,
              renderTo: "siim_mapdiv",
              constrain: true,
              items:[grid]
          });

          var featureInfoControl = new OpenLayers.Control.WMSGetFeatureInfo({
              url: 'http://localhost:9000/gis_proxy/WMSServer',
              title: 'Identificar elementos',
              layers: [Heron.options.map.layers[5]],
              queryVisible: true,
              infoFormat: 'text/plain',
              eventListeners: {
                  getfeatureinfo: function(event) {
                      var resultado = event.text.split(';');
                      if(resultado[11]!=null){
                          $scope.responseLoadDataGrid = {};
                          barmanpre = resultado[11];
                          loadDataGrid(barmanpre);
                          //store.loadData([[resultado[11]]]);
                          //gridDialog.show();
                      }
                  }
              }
          });


        Heron.options.map.toolbar = [
            {type: "scale", options: {width: 110}},
            {type: "-"} ,
            {type: "-"} ,
            {type: "pan"},
            {type: "zoomin"},
            {type: "zoomout"},
            {type: "zoomvisible"},
            {type: "-"} ,
            {type: "zoomprevious"},
            {type: "zoomnext"},
            {type: "-"},
            {type: "measurelength", options: {geodesic: true}},
            {type: "measurearea", options: {geodesic: true}},
            {type: "-"},
            {
                create: function(mapPanel, options){
                    options.handler = function () {
                        layerTreeDialog.add({
                            xtype: 'hr_layertreepanel'
                        });
                        layerTreeDialog.show();
                    };
                    return new Ext.Action(options);
                },
                options: {
                    text : 'Capas',
                    enableToggle : true,
                    toggleGroup : "toolGroup"
                }
            },
            {
                create: function(mapPanel, options){
                    options.handler = function(){
                        if(featureInfoControl.active){
                            featureInfoControl.deactivate();
                        }else{
                            featureInfoControl.activate();
                        }
                    };
                    return new Ext.Action(options);
                },
                options: {
                    text : 'Info Lotes',
                    enableToggle : true,
                    toggleGroup : "toolGroup"
                }
            }
        ];
          Heron.layout = {
              xtype: 'hr_mappanel',
              renderTo: 'siim_mapdiv',
              height: 400,
              width: '100%',
              hropts: Heron.options.map
          };

          function loadDataGrid(barmanpreParam) {
              var paramsSearch = {};
              $scope.responseLoadDataGrid = caliopewebTemplateSrv.loadDataGrid(
                  'SIIMForm', paramsSearch);
          };


          $scope.$watch('responseLoadDataGrid', function (value) {
              if( value !== undefined && value['error'] === undefined) {
                  var err = value['error'];
                  var append = false;
                  if( err === undefined ) {
                      var caliopeWebGrid = new CaliopeWebGrid();
                      caliopeWebGrid.addGridName('SIIMForm');
                      caliopeWebGrid.addData(value.data);
                      CaliopeWebGridDataDecorator.createStructureToRender(caliopeWebGrid);
                      var structureToRender = caliopeWebGrid.createStructureToRender();
                      console.log('Structure To Render', structureToRender);
                      $scope.data = structureToRender.data;
                      $scope.gridOptions = {
                          'data'  : 'data'
                      };
                  }
              } else {
                  $scope.data = [
                  ];
                  $scope.gridOptions = {
                      'data': 'data'
                  };
              }
          });

          Heron.App.create();
          Heron.App.map.addControl(featureInfoControl);
          Heron.App.show();

      }
      ]);
  
});
