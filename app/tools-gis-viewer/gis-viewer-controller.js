define(['angular', 'gis-ext-base','gis-heron'], function(angular) {
  'use strict';

  var moduleControllers = angular.module('GisViewerController',[]);

  moduleControllers.controller('GisViewerController',
      ['$scope', '$routeParams',
      function ($scope, $routeParams) {
          Ext.namespace('Heron.options.map');
          Ext.namespace('Heron.App.mapPanel');
          var bounds = new OpenLayers.Bounds(
              -74.221, 4.471,
              -74.008, 4.849
          );

        var capaConsulta;
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
                "http://localhost:9000/gis_proxy/wms",
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
              constrain: true
          });
          //OpenLayers.ProxyHost = "http://192.168.0.28/cgi-bin/proxy.cgi?url=";
          var featureInfoControl = new OpenLayers.Control.WMSGetFeatureInfo({
              url: 'http://localhost:9000/gis_proxy/wms',
              title: 'Identificar elementos',
              layers: [Heron.options.map.layers[5]],
              queryVisible: true,
              infoFormat: 'text/plain',
              eventListeners: {
                  getfeatureinfo: function(event) {
                      var resultado = event.text.split(';');
                      if(resultado[11]!=null){
                          alert(resultado[11]);
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
            {type: "capas",
					options: {
						text: 'Capas',
						iconCls: 'bmenu',
						handler: function () {
                            layerTreeDialog.add({
                                xtype: 'hr_layertreepanel'
                            });
							layerTreeDialog.show();

						 }
					}
				},
            {type: "Info", options: {
                text: 'Info Lotes',
                handler:function(){
                    if(featureInfoControl.active){
                        featureInfoControl.deactivate();
                    }else{
                        featureInfoControl.activate();
                    }
                }
            }}

                        ];
          Heron.layout = {
              xtype: 'hr_mappanel',
              renderTo: 'siim_mapdiv',
              height: 400,
              width: '100%',
              hropts: Heron.options.map
          };
          Heron.App.create();
          Heron.App.map.addControl(featureInfoControl);
          Heron.App.show();

      }
      ]);
  
});
