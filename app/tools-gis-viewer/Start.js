define(['gis-ext-base','gis-heron'], function() {
  'use strict';

Ext.namespace("Heron")


Heron.layout = {
        xtype: 'hr_mappanel',
//         renderTo: 'mapdiv',
        height: 400,
        width: 600,
// 
//         /* More optional ExtJS Panel properties here, see ExtJS API docs */
// 
//         /** Below are Heron-specific settings for the Heron MapPanel (xtype: 'hr_mappanel') */
         hropts: {
                 layers: [new OpenLayers.Layer.WMS("Global Imagery",
                                                                   "http://maps.opengeo.org/geowebcache/service/wms",
                                   {layers: "bluemarble"})]
         }
};



Heron.App.create();
Heron.App.show();

});