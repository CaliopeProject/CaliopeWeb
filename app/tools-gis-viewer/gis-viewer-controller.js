define(['angular', 'gis-ext-base','gis-heron'], function(angular) {
  'use strict';

  var moduleControllers = angular.module('GisViewerController',[]);

  moduleControllers.controller('GisViewerController',
      ['$scope', '$routeParams','caliopewebTemplateSrv',
      function ($scope, $routeParams, caliopewebTemplateSrv) {

          Ext.namespace('Heron.options.map');
          Ext.namespace('Heron.App.mapPanel');

          $scope.gridSelection = [];
          $scope.$on('findPredioByBarmanpre',  function(){
              console.log("gridSelection",$scope.gridSelection);
          });

          $scope.showGrillaPredios = false;
          $scope.data = [
          ];
          $scope.gridOptions = {
              data: 'data',
              selectedItems: $scope.gridSelection,
              multiSelect: false,
              columnDefs: [
                  {
                      field: 'area_construida',
                      displayName: 'Área construida'
                  },
                  {
                      field: 'area_terreno',
                      displayName: 'Área terreno'
                  },
                  {
                      field: 'cedula_catastral',
                      displayName: 'Cédula Catastral    '
                  },
                  {
                      field: 'chip',
                      displayName: 'Chip'
                  },
                  {
                      field: 'clase_predio',
                      displayName: 'Clase predio'
                  },
                  {
                      field: 'direccion_actual',
                      displayName: 'Dirección actual'
                  },
                  {
                      field: 'escritura',
                      displayName: 'Escritura'
                  },
                  {
                      field: 'matricula',
                      displayName: 'Matrícula'
                  },
                  {
                      field: 'notaria',
                      displayName: 'Notaría'
                  },
                  {
                      field: 'sector',
                      displayName: 'Sector'
                  },
                  {
                      displayName: 'Acciones',
                      cellTemplate: '<widget-seeinmap></widget-seeinmap>'

                  }
              ]

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
            ),
            new OpenLayers.Layer.WMS("Proyectos",
                "http://" + document.domain + ":" + location.port + "/gis_proxy/wms",
                {
                    id: 'capaProyectos',
                    layers: "mtv_gis:proyectos",
                    format: "image/png",
                    transparent: true,
                    visibility: false
                },
                {
                    isBaseLayer:false
                }
            ),
            new OpenLayers.Layer.WMS("Lotes",
                "http://" + document.domain + ":" + location.port + "/gis_proxy/catastro",
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

          var layerTreeAction;

          var layerTreeDialog = new Ext.Window({
              layout: "fit",
              width: 350,
              height: 150,
              renderTo: "siim_mapdiv",
              constrain: true,
              closeAction: 'hide'
          });

          var filt = new OpenLayers.Filter.Logical({
              type: OpenLayers.Filter.Logical.OR,
              filters: [
                  new OpenLayers.Filter.Comparison({
                      type: OpenLayers.Filter.Comparison.LIKE,
                      property: "TYPE",
                      value: "highway"
                  })
              ]
          });

          var proyectoSearchAction;

          var proyectoSearchDialog = new Ext.Window({
              layout: "fit",
              width: 350,
              height: 150,
              renderTo: "siim_mapdiv",
              constrain: true,
              closeAction: 'hide'
          });

          var formPanel = new GeoExt.form.FormPanel({
              protocol: new OpenLayers.Protocol.WFS({
                      url: 'http://' + document.domain + ':' + location.port + '/gis_proxy/wfs',
                      srsName: "EPSG:4686",
                      featureType: "proyectos",
                      featureNS: "mtv_gis",
                      geometryName: "the_geom"
              }),
              items: [{
                  xtype: "textfield",
                  name: "PROYECTO__like",
                  value: "",
                  fieldLabel: "  nombre"
              }],
              listeners: {
                  actioncomplete: function(form, action) {
                      var featureSearch = action.response.features[0];
                      Heron.App.map.zoomToExtent(featureSearch.geometry.getBounds(),true);
                  }
              }
          });

          formPanel.addButton({
              text: "search",
              handler: function() {
                  this.search();
              },
              scope: formPanel
          });

          var featureInfoAction;

          var featureInfoControl = new OpenLayers.Control.WMSGetFeatureInfo({
              url: 'http://' + document.domain + ':' + location.port + '/gis_proxy/catastro',
              title: 'Identificar elementos',
              layers: [Heron.options.map.layers[6]],
              queryVisible: true,
              infoFormat: 'text/plain',
              eventListeners: {
                  getfeatureinfo: function(event) {
                      featureInfoControl.activate();
                      var resultado = event.text.split(';');
                      if(resultado[11]!=null){
                          $scope.responseLoadDataGrid = {};
                          barmanpre = resultado[11];
                          console.log("barmanpre: ",barmanpre);
                          loadDataGrid(barmanpre);
                      }
                  },
                  beforegetfeatureinfo : function(event) {
                      featureInfoControl.deactivate();
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
                    layerTreeAction = new Ext.Action(options);
                    return layerTreeAction;
                },
                options: {
                    text : 'Capas'
                }
            },
            {
                create: function(mapPanel, options){
                    options.handler = function () {
                        proyectoSearchDialog.add(formPanel);
                        proyectoSearchDialog.show();
                    };
                    proyectoSearchAction = new Ext.Action(options);
                    return proyectoSearchAction;
                },
                options: {
                    text : 'Busqueda de proyectos'
                }
            },
            {
                create: function(mapPanel, options){
                    options.handler = function(){
                        $scope.showGrillaPredios = true;
                        $scope.$apply();
                        featureInfoControl.activate();
                    };
                    featureInfoAction = new Ext.Action(options);
                    return featureInfoAction;
                },
                options: {
                    iconCls: "icon-getfeatureinfo",
                    enableToggle : true,
                    allowDepress: false,
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
              var paramsSearch = {"sector": "008108150300122004"};
              $scope.responseLoadDataGrid = caliopewebTemplateSrv.loadDataGrid(
                  'catastro.getPredio', paramsSearch);
          };

          $scope.$watch('responseLoadDataGrid', function (value) {
              console.log("value: ",value);
              if( value !== undefined && value['error'] === undefined) {
                  var err = value['error'];
                  var append = false;
                  if( err === undefined ) {
                      var caliopeWebGrid = new CaliopeWebGrid();
                      caliopeWebGrid.addGridName('catastro.getPredio');
                      caliopeWebGrid.addData(value);
                      CaliopeWebGridDataDecorator.createStructureToRender(caliopeWebGrid);
                      var structureToRender = caliopeWebGrid.createStructureToRender();
                      console.log('Structure To Render', structureToRender);
                      $scope.data = structureToRender.data;
                      $scope.gridOptions = {
                          data  : 'data',
                          multiSelect: false,
                          selectedItems: $scope.gridSelection,
                          columnDefs: $scope.columnsDefGisGrid
                      };
                  }
              } else {
                  $scope.data = [];
                  $scope.gridOptions = {
                      data: 'data',
                      columnDefs: [
                          {
                              field: 'area_construida',
                              displayName: 'Área construida'
                          },
                          {
                              field: 'area_terreno',
                              displayName: 'Área terreno'
                          },
                          {
                              field: 'cedula_catastral',
                              displayName: 'Cédula Catastral    '
                          },
                          {
                              field: 'chip',
                              displayName: 'Chip'
                          },
                          {
                              field: 'clase_predio',
                              displayName: 'Clase predio'
                          },
                          {
                              field: 'direccion_actual',
                              displayName: 'Dirección actual'
                          },
                          {
                              field: 'escritura',
                              displayName: 'Escritura'
                          },
                          {
                              field: 'matricula',
                              displayName: 'Matrícula'
                          },
                          {
                              field: 'notaria',
                              displayName: 'Notaría'
                          },
                          {
                              field: 'sector',
                              displayName: 'Sector'
                          }
                      ]
                  };
              }
          });

          Heron.App.create();
          Heron.App.map.addControl(featureInfoControl);
          Heron.App.show();

      }
      ]);
  
});
