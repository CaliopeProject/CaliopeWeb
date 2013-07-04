define(['angular,ext-all,ext-base,openlayers,geoext,heron,jQuery'], function(angular,ext-all,ext-base,openlayers,geoext,heron,jQuery) {
  'use strict';
   heron.layout = {
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
			split	: true,
			border: false,
			items: [
				{
					xtype: 'hr_mappanel',
					id: 'hr-map',
					region: 'center',
					collapsible: false,
					border: false,
					hropts: heron.options.map
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
});