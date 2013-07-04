define(['gis-ext-base','gis-heron'], function() {
  'use strict';

Ext.namespace("Heron")

console.log('Heron.noAutoLaunch',Heron.noAutoLaunch)

OpenLayers.IMAGE_RELOAD_ATTEMPTS = 5;
OpenLayers.Util.onImageLoadErrorColor = "transparent";
OpenLayers.Tile.Image.useBlankTile = false;
OpenLayers.DOTS_PER_INCH = 25.4 / 0.28;
var bounds = new OpenLayers.Bounds(
        -74.45030703362895, 3.7310251306313797,
        -73.98650718403472, 4.836778959081053
    );
Heron.options.map.settings = {
        projection: 'EPSG:4686',
        units: 'degrees',
        maxExtent: bounds,
        maxResolution: 0.0043193508923815,
        xy_precision: 3,
        max_features: 10,
        zoom: 1,
        theme: null
};

Heron.options.map.layers = [

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
        xtype: 'panel',
        id: 'hr-container-main',
        layout: 'border',

        items: [
                {
                        xtype: 'panel',

                        id: 'hr-menu-left-container',
                        layout: 'accordion',
                        region: "west",
                        width: 240,
                        collapsible: true,
                        split: true,
                        border: false,
                        items: [
                                {
                                        xtype: 'hr_layertreepanel'
                                },
                                
                                {
                    xtype: 'hr_formsearchpanel',
                    title: __('Búsqueda'),
                    bodyStyle: 'padding: 6px',
                    style: {
                        fontFamily: 'Verdana, Arial, Helvetica, sans-serif',
                        fontSize: '12px'
                    },
                    border: true,

                    protocol: new OpenLayers.Protocol.WFS({
                        version: "1.0.0",
                        url: "http://localhost:8081/geoserver/mtv_sig/ows?",
                        srsName: "EPSG:4686",
                        featureType: "lote",
                        featureNS: "mtv_sig",
                        geometryName: "the_geom"
                    }),
                    items: [
                        {
                            xtype: "textfield",
                            name: "lotcodigo__like",
                            value: '',
                            fieldLabel: "  nombre"
                        }
                    ],
                    hropts: {
                        onSearchCompleteZoom: 1,
                        autoWildCardAttach: true,
                        caseInsensitiveMatch: true,
                        logicalOperator: OpenLayers.Filter.Logical.AND
                    }
                }
                        ]
                },
                {
                        xtype: 'panel',

                        id: 'hr-map-and-info-container',
                        layout: 'border',
                        region: 'center',
                        width: '100%',
                        split   : true,
                        border: false,
                        items: [
                                {
                                        xtype: 'hr_mappanel',
                                        id: 'hr-map',
                                        region: 'center',
                                        collapsible: false,
                                        border: false,
                                        hropts: Heron.options.map
                                }
                        ]
                },
                {
                        xtype: 'panel',

                        id: 'hr-menu-right-container',
                        layout: 'accordion',
                        region: "east",
                        width: 200,
                        collapsible: true,
                        collapsed: false,
                        split: true,
                        border: false,
                        items: [
                                {
                                        xtype: 'hr_layerlegendpanel',

                    bodyStyle: 'padding:10px 10px',
                    border: false,
                                        defaults: {
                                                labelCls: 'hr-legend-panel-header',
                                                useScaleParameter: true,
                                                baseParams: {
                                                        FORMAT: 'image/png',
                                                        LEGEND_OPTIONS: 'forceLabels:on;fontName=Verdana;fontSize:11'
                                                }
                                        },
                                        hropts: {
                                                prefetchLegends: false
                                        }
                                }
                        ]
                }
        ]
};

Heron.App.create();
Heron.App.show();

});