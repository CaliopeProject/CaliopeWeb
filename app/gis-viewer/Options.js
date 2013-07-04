define(['angular,ext-all,ext-base,openlayers,geoext,heron,jQuery'], function(angular,ext-all,ext-base,openlayers,geoext,heron,jQuery) {
  'use strict';
OpenLayers.IMAGE_RELOAD_ATTEMPTS = 5;
OpenLayers.Util.onImageLoadErrorColor = "transparent";
OpenLayers.Tile.Image.useBlankTile = false;
OpenLayers.DOTS_PER_INCH = 25.4 / 0.28;
var bounds = new OpenLayers.Bounds(
        -74.45030703362895, 3.7310251306313797,
        -73.98650718403472, 4.836778959081053
    );
heron.options.map.settings = {
	projection: 'EPSG:4686',
	units: 'degrees',
	maxExtent: bounds,
	maxResolution: 0.0043193508923815,
	xy_precision: 3,
	max_features: 10,
	zoom: 1,
	theme: null
};

heron.options.map.layers = [

                        	/*
                        	 * ==================================
                        	 *            Capas
                        	 * ==================================
                        	 */

                        	new OpenLayers.Layer.WMS(
                        			"Ortoimagen 2010 IDECA ",
                        			'http://imagenes.catastrobogota.gov.co/arcgis/services/Ortho2010/MapServer/WMSServer?',
                        			{layers: "0", format: 'image/png'},
                        			{singleTile: true, isBaseLayer: true, visibility: false, noLegend: true}
                        	),new OpenLayers.Layer.WMS(
                        			"Capas Base",
                        			'http://192.168.0.11:8081/geoserver/mtv_sig/wms?',
                        			{layers: "capasBase", format: 'image/png'},
                        			{singleTile: true, isBaseLayer: false, visibility: false, noLegend: true}
                        	),new OpenLayers.Layer.WMS(
                        			"Malla Vial",
                        			'http://mapas.catastrobogota.gov.co/arcgiswsh/Mapa_Referencia/Mapa_Referencia/MapServer/WMSServer?',
                        			{layers: "18", format: 'image/png'},
                        			{singleTile: true, isBaseLayer: false, visibility: false, noLegend: true}
                        	)
                        	
                        ];
                        heron.options.map.toolbar = [
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
});