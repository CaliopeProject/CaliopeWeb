define(['angular', 'gis-ext-base','gis-heron'], function(angular) {
  'use strict';

  var moduleControllers = angular.module('GisViewerController',[]);
  var layerTreeDialog;
  moduleControllers.controller('GisViewerController', 
      ['$scope', '$routeParams', 
      function ($scope, $routeParams) {
			
	var bounds = new OpenLayers.Bounds(
        -74.221, 4.471,
        -74.008, 4.849
    );
	  
	  Ext.namespace('Heron.options.map');
		Heron.options.map.settings = {
			projection: 'EPSG:4686',
			maxExtent: bounds,
			maxResolution: 0.0010794266378287,//Resolucion escala 1:100.000 es 0.0003174784228908226,
			zoom: 0
		};
		Heron.options.map.layers = [
		
				  new OpenLayers.Layer.WMS("Orto Imagen IDECA",
				  "http://imagenes.catastrobogota.gov.co/arcgis/services/Ortho2010/MapServer/WMSServer?",
				  {layers: "0"})/*,
                        	new OpenLayers.Layer.WMS("Area Territorial",
								  "http://mapas.catastrobogota.gov.co/arcgiswsh/Mapa_Referencia/Mapa_referencia/MapServer/WMSServer?",
				  {layers: "4"})*/
                        ];
                        Heron.options.map.toolbar = [
                        	{type: "scale", options: {width: 110}},
                        	{type: "-"} ,
                        	{type: "featureinfo", options: {popupWindow: {}}},
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
							    layerTreeDialog= new Ext.Window({
							    layout: "fit",
							    width: 350,
							    autoHeight: true,
							    items: [{								
								 xtype: 'hr_layertreepanel'
								}
							    ]
							});
							layerTreeDialog.show();
						 }
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
        /*
		Ext.namespace("Heron");
		var bounds = new OpenLayers.Bounds(
				-81.5625,2.8125,-78.75,5.625
			);
        
		Ext.namespace("Heron.options.map");
       Heron.options.map.settings = {
	projection: 'EPSG:4326',
	units: 'degrees',
	maxExtent: bounds,
	xy_precision: 3,
	max_features: 10,
	zoom: 1,
	theme: null
};

Heron.options.map.layers = [


                        	new OpenLayers.Layer.WMS("Global Imagery",
								  "http://maps.opengeo.org/geowebcache/service/wms",
				  {layers: "bluemarble"})
                        	
                        ];
                        Heron.options.map.toolbar = [
                        	{type: "scale", options: {width: 110}},
                        	{type: "-"} ,
                        	{type: "featureinfo", options: {popupWindow: {}}},
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
                        	{type: "measurearea", options: {geodesic: true}}
                        ];
		Heron.layout = {
	xtype: 'hr_mappanel',
	renderTo: 'mapdiv',
	height: 400,
	width: '100%',
	hropts: Heron.options.map
	};
		*/
		Heron.App.create();
		Heron.App.show();
      }
      ]);
  
});
