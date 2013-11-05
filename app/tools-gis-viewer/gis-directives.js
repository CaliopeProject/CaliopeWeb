/*jslint browser: true*/
/*global $scope, angular, CaliopeWebGridDataDecorator, CWGridColumnsDefNgGridDecorator, Ext*/

define(['angular', 'jquery','gis-ext-all','caliopeweb-template-services' ,'gis-ext-base' ,'gis-heron', 'gis-ext-base'], function(angular, jquery) {
    'use strict';

    angular.module('gis-directives',['CaliopeWebTemplatesServices'])
        .directive('widgetGis', function($timeout) {
            var directive = {
                templateUrl: 'tools-gis-viewer/gis-partial.html',
                restrict: 'E',
                replace: true,
                scope: true,
                link: function postLink($scope, $element, $attrs, $controller) {
                    var maxFeatures = 10;
                    var sizeWindows = {};
                    var timeoutId;
                    var featureSearch;
                    sizeWindows.heightcontent = window.innerHeight - 60;
                    sizeWindows.widthcontent  = window.innerWidth - 14;

                    function position() {
                        jquery('#' + $element.attr('id')).html('');
                        if(jquery('#' + $element.attr('id')).height() > 150){
                            sizeWindows.heightcontent = jquery('#' + $element.attr('id')).height();
                            sizeWindows.widthcontent  = jquery('#' + $element.attr('id')).width();
                        }

                        Ext.namespace('Heron.options.map');
                        Ext.namespace('Heron.App.mapPanel');

                        $scope.gridSelection = [];
                        $scope.$on('findPredioByBarmanpre',  function(){
                            console.log("gridSelection",$scope.gridSelection);
                        });
                        var cwGrid;

                        $scope.showGrillaPredios = false;
                        $scope.data = [];

                        $scope.initGrid = function() {

                            /*$scope.gridOptions = {
                             data: 'data',
                             selectedItems: $scope.gridSelection,
                             multiSelect: false,
                             columnDefs: 'columnDefs'
                             };*/
                            $scope.parent="parent";
                            cwGrid = $scope.gridPrediosmtv;
                            console.log("cwGrid",cwGrid);
                            cwGrid.addColumn('area_construida', {"name": 'Área construida', "show" : true});
                            cwGrid.addColumn('area_terreno', {"name": 'Área Terreno', "show" : true});
                            cwGrid.addColumn('cedula_catastral', {"name": 'Cédula Catastral', "show" : true});
                            cwGrid.addColumn('chip', {"name": 'Chip', "show" : true});
                            cwGrid.addColumn('clase_predio', {"name": 'Clase Predio', "show" : true});
                            cwGrid.addColumn('direccion_actual', {"name": 'Dirección Actual', "show" : true});
                            cwGrid.addColumn('escritura', {"name": 'Escritura', "show" : true});
                            cwGrid.addColumn('matricula', {"name": 'Matrícula', "show" : true});
                            cwGrid.addColumn('notaria', {"name": 'Notaria', "show" : true});
                            cwGrid.addColumn('sector', {"name": 'Sector', "show" : true});
                            cwGrid.addColumn('actions', {"name": 'Acciones', "show" : true, "width" : 200});

                            cwGrid.addColumnProperties('actions', {
                                "htmlContent": '<widget-seeinmap ng-attr-feature="{{featurelote}}" ng-attr-featurename="{{featurenamespace}}" ng-attr-geometryname="{{geometryname}}" ng-attr-value="{{value}}"></widget-seeinmap>'
                            });

                            cwGrid.setDecorators([CaliopeWebGridDataDecorator, CWGridColumnsDefNgGridDecorator]);
                            $scope.cwGrid = cwGrid;
                        };

                        var barmanpre;

                        var bounds = new OpenLayers.Bounds(
                            74734.664050978,70950.10415,
                            114513.28634902,132480.78275
                        );

                        Heron.options.map.settings = {
                            //projection: 'EPSG:4686',
                            projection: 'EPSG:100000',
                            units: 'm',
                            maxExtent: bounds,
                            maxResolution: 150,
                            minResolution: 1,
                            zoom: 0
                        };
                        Heron.options.map.layers = [
                            new OpenLayers.Layer.WMS("Sector Catastral",
                                "http://" + document.domain + ":" + location.port + "/gis_proxy/wms",
                                {
                                    id: 'capaSectorCatastral',
                                    layers: "mtv_gis:mtv_scatlocal",
                                    format: "image/png",
                                    transparent: true,
                                    visibility: false
                                },
                                {
                                    isBaseLayer:true
                                }
                            ),
                            new OpenLayers.Layer.WMS("Malla Vial",
                                "http://" + document.domain + ":" + location.port + "/gis_proxy/wms",
                                {
                                    id: 'capaMallaVial',
                                    layers: "mtv_gis:mvilocal",
                                    format: "image/png",
                                    transparent: true,
                                    visibility: false
                                },
                                {
                                    isBaseLayer:false
                                }
                            ),
                            new OpenLayers.Layer.WMS("Proyectos",
                                "http://" + document.domain + ":" + location.port + "/gis_proxy/wms",
                                {
                                    id: 'capaProyectos',
                                    layers: "mtv_gis:proyectos_mtv",
                                    format: "image/png",
                                    transparent: true,
                                    visibility: false
                                },
                                {
                                    isBaseLayer:false
                                }
                            ),
                            new OpenLayers.Layer.WMS("Predios proyectos",
                                "http://" + document.domain + ":" + location.port + "/gis_proxy/wms",
                                {
                                    id: 'capaPrediosMTV',
                                    layers: "mtv_gis:predios_metrovivienda",
                                    format: "image/png",
                                    transparent: true,
                                    visibility: false
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

                        var identifyAction;

                        var identifyDialog = new Ext.Window({
                            layout: "fit",
                            width: 350,
                            height: 150,
                            renderTo: "siim_mapdiv",
                            constrain: true,
                            closeAction: 'hide',
                            x: 10,
                            y:500
                        });

                        var arrayIdentify = [];

                        var storeIdentify;
                        function setStoreIdentify(featureIdentify){
                            var arrayFieldsIdentify = [];
                            console.log("featureIdentify.data",featureIdentify.data);
                            storeIdentify = new Ext.data.ArrayStore({
                                // store configs
                                autoDestroy: true,
                                storeId: 'storeIdentify',
                                idProperty: 'proyecto',
                                fields: [
                                    'proyecto',
                                    'id',
                                    'estado']
                            });
                        }
                        var gridIdentify = new Ext.grid.GridPanel({
                            store: storeProyectos,
                            columns: [

                                {
                                    id       :'id',
                                    header   : 'Id',
                                    width    : 30,
                                    sortable : true,
                                    dataIndex: 'id'
                                },{
                                    id       :'proyecto',
                                    header   : 'Proyecto',
                                    width    : 160,
                                    sortable : true,
                                    dataIndex: 'proyecto'
                                },
                                {
                                    id       :'estado',
                                    header   : 'Estado',
                                    width    : 90,
                                    sortable : true,
                                    dataIndex: 'estado'
                                },
                                {
                                    xtype: 'actioncolumn',
                                    width: 30,
                                    items: [{
                                        icon   : '/tools-gis-viewer/images/heron/silk/magnifier_zoom_in.png',  // Use a URL in the icon config
                                        tooltip: 'Ver en mapa',
                                        handler: function(grid, rowIndex, colIndex) {
                                            var rec = storeProyectos.getAt(rowIndex);
                                            findByFeature("proyectos_mtv","mtv_gis","the_geom",rec.get('proyecto'),"proyecto",true);
                                        }
                                    }]
                                },
                                {
                                    xtype: 'actioncolumn',
                                    width: 30,
                                    items: [{
                                        icon   : '/tools-gis-viewer/images/heron/silk/information.png',  // Use a URL in the icon config
                                        tooltip: 'Ver información',
                                        handler: function(grid, rowIndex, colIndex) {
                                            var rec = storeProyectos.getAt(rowIndex);
                                            findByFeature("proyectos_mtv","mtv_gis","the_geom",rec.get('id'),"id",false);
                                        }
                                    }]
                                }
                            ],
                            stripeRows: true,
                            height: 350,
                            width: 600,
                            title: 'Resultado búsqueda de Proyectos',
                            stateful: true,
                            stateId: 'gridProyectos'
                        });

                        var toolPanelDisplayAction;

                        var datosProyectos = [
                            ['--',0],
                            ['USME 1',1],
                            ['LA VíA LÁCTEA',2]
                        ];

                        var datosVersiones = [
                            [1],
                            [2]
                        ];

                        var storeProyectos = new Ext.data.ArrayStore({
                            autoDestroy: true,
                            storeId: 'storeProyectos',
                            idIndex: 0,
                            fields: [
                                'proyecto',
                                'id'
                            ],
                            data: datosProyectos
                        });

                        var storeVersiones = new Ext.data.ArrayStore({
                            autoDestroy: true,
                            storeId: 'storeVersiones',
                            idIndex: 0,
                            fields: [
                                'idVersion'
                            ],
                            data: datosVersiones
                        });

                        var comboProyectos = new Ext.form.ComboBox({
                            store: storeProyectos,
                            displayField:'proyecto',
                            typeAhead: true,
                            mode: 'local',
                            forceSelection: true,
                            triggerAction: 'all',
                            emptyText:'Seleccione un Proyecto',
                            selectOnFocus:true,
                            fieldLabel: 'Proyectos',
                            listeners:{
                                'select': activeComboVersiones
                            }
                        });

                        var campoProyectos = new Ext.form.TextField({
                            name: 'campoProyectos',
                            fieldLabel: 'Proyectos'
                        });

                        var comboVersiones = new Ext.form.ComboBox({
                            store: storeVersiones,
                            displayField:'idVersion',
                            typeAhead: true,
                            mode: 'local',
                            forceSelection: true,
                            triggerAction: 'all',
                            emptyText:'Seleccione una Versión',
                            selectOnFocus:true,
                            fieldLabel: 'Versiones',
                            disabled : true
                        });

                        function activeComboVersiones (){
                            if(comboProyectos.getValue()=="--"){
                                comboVersiones.reset();
                                comboVersiones.disable();
                            }else{
                                comboVersiones.enable();
                            }
                        }

                        var arrayProyectos = [];

                        var storeProyectos = new Ext.data.ArrayStore({
                            // store configs
                            autoDestroy: true,
                            storeId: 'storeProyectos',
                            idProperty: 'proyecto',
                            fields: [
                                'proyecto',
                                'id',
                                'estado']
                        });

                        var gridProyectos = new Ext.grid.GridPanel({
                            store: storeProyectos,
                            columns: [

                                {
                                    id       :'id',
                                    header   : 'Id',
                                    width    : 30,
                                    sortable : true,
                                    dataIndex: 'id'
                                },{
                                    id       :'proyecto',
                                    header   : 'Proyecto',
                                    width    : 160,
                                    sortable : true,
                                    dataIndex: 'proyecto'
                                },
                                {
                                    id       :'estado',
                                    header   : 'Estado',
                                    width    : 90,
                                    sortable : true,
                                    dataIndex: 'estado'
                                },
                                {
                                    xtype: 'actioncolumn',
                                    width: 30,
                                    items: [{
                                        icon   : '/tools-gis-viewer/images/heron/silk/magnifier_zoom_in.png',  // Use a URL in the icon config
                                        tooltip: 'Ver en mapa',
                                        handler: function(grid, rowIndex, colIndex) {
                                            var rec = storeProyectos.getAt(rowIndex);
                                            findByFeature("proyectos_mtv","mtv_gis","the_geom",rec.get('proyecto'),"proyecto",true);
                                        }
                                    }]
                                },
                                {
                                    xtype: 'actioncolumn',
                                    width: 30,
                                    items: [{
                                        icon   : '/tools-gis-viewer/images/heron/silk/information.png',  // Use a URL in the icon config
                                        tooltip: 'Ver información',
                                        handler: function(grid, rowIndex, colIndex) {
                                            var rec = storeProyectos.getAt(rowIndex);
                                            console.log("get id",rec.get('id'));
                                            findByFeature("proyectos_mtv","mtv_gis","the_geom",rec.get('id'),"id",true);
                                        }
                                    }]
                                }
                            ],
                            stripeRows: true,
                            height: 350,
                            width: 600,
                            title: 'Resultado búsqueda de Proyectos',
                            stateful: true,
                            stateId: 'gridProyectos'
                        });

                        var formPanelSearchProyectos = new GeoExt.form.FormPanel({
                            items: [campoProyectos]
                        });

                        formPanelSearchProyectos.addButton({
                            text: "Buscar",
                            handler: showVersionProyecto,
                            scope: formPanelSearchProyectos
                        });
                        //------------------------------------------------

                        var campoPredio = new Ext.form.TextField({
                            name: 'campoProyectos',
                            fieldLabel: 'Buscar en predios'
                        });

                        var arrayPredios = [];

                        var storePredios = new Ext.data.ArrayStore({
                            // store configs
                            autoDestroy: true,
                            storeId: 'storePredios',
                            idProperty: 'barmanpre',
                            fields: [
                                'barmanpre',
                                'chip',
                                'matricula',
                                'direccion']
                        });

                        var gridPredios = new Ext.grid.GridPanel({
                            store: storePredios,
                            columns: [

                                {
                                    id       :'barmanpre',
                                    header   : 'Barmanpre',
                                    width    : 30,
                                    sortable : true,
                                    dataIndex: 'barmanpre'
                                },{
                                    id       :'chip',
                                    header   : 'Chip',
                                    width    : 160,
                                    sortable : true,
                                    dataIndex: 'chip'
                                },
                                {
                                    id       :'matricula',
                                    header   : 'Matrícula',
                                    width    : 90,
                                    sortable : true,
                                    dataIndex: 'matricula'
                                },
                                {
                                    id       :'direccion',
                                    header   : 'Dirección',
                                    width    : 90,
                                    sortable : true,
                                    dataIndex: 'direccion'
                                },
                                {
                                    xtype: 'actioncolumn',
                                    width: 30,
                                    items: [{
                                        icon   : '/tools-gis-viewer/images/heron/silk/magnifier_zoom_in.png',  // Use a URL in the icon config
                                        tooltip: 'Ver en mapa',
                                        handler: function(grid, rowIndex, colIndex) {
                                            var rec = storePredios.getAt(rowIndex);
                                            findByFeature("predios_metrovivienda","mtv_gis","the_geom",rec.get('chip'),"chip",true);
                                        }
                                    }]
                                },
                                {
                                    xtype: 'actioncolumn',
                                    width: 30,
                                    items: [{
                                        icon   : '/tools-gis-viewer/images/heron/silk/information.png',  // Use a URL in the icon config
                                        tooltip: 'Ver información',
                                        handler: function(grid, rowIndex, colIndex) {
                                            var rec = storePredios.getAt(rowIndex);
                                            findByFeature("predios_metrovivienda","mtv_gis","the_geom",rec.get('chip'),"chip",true);
                                        }
                                    }]
                                }
                            ],
                            stripeRows: true,
                            height: 350,
                            width: 600,
                            title: 'Resultado búsqueda de Predios',
                            stateful: true,
                            stateId: 'gridPredios'
                        });

                        var formPanelSearchPredios = new GeoExt.form.FormPanel({
                            items: [campoPredio]
                        });

                        formPanelSearchPredios.addButton({
                            text: "Buscar",
                            handler: showPredios,
                            scope: formPanelSearchPredios
                        });

                        function showPredios(){
                            findPredios("predios_metrovivienda","mtv_gis","the_geom",campoPredio.getValue(),false);
                        }

                        //-------------------------------------

                        var protocol;
                        var response;

                        function requestSearch(value, options) {
                            options = options || {};
                            var filter = options.filter;
                            // Set the cursor to "wait" to tell the user we're working.
                            OpenLayers.Element.addClass(Heron.App.map.viewPortDiv, "olCursorWait");
                            response = protocol.read({
                                maxFeatures:10,
                                filter: filter,
                                callback: function(result) {

                                    if(result.success()) {
                                        if(result.features.length) {
                                            if(options.single == true) {
                                                featureSearch = response.features[0];
                                                setStoreIdentify(featureSearch);
                                                identifyDialog.show();
                                                Heron.App.map.zoomToExtent(featureSearch.geometry.getBounds(),true);
                                            } else {
                                                storeProyectos.removeAll();
                                                arrayProyectos = [];
                                                for (var i=0;i<result.features.length;i++)
                                                {
                                                    featureSearch = response.features[i];
                                                    var arrayProyecto = [featureSearch.data['proyecto'],featureSearch.data['id'],featureSearch.data['estado']];
                                                    arrayProyectos.push(arrayProyecto);
                                                }
                                                storeProyectos.loadData(arrayProyectos);
                                            }
                                        } else if(options.hover) {
                                            console.log("trata de hacer hover? :(");
                                        } else {
                                            alert("No hay registros");
                                        }
                                    }
                                    // Reset the cursor.

                                    OpenLayers.Element.removeClass(Heron.App.map.viewPortDiv, "olCursorWait");
                                },
                                scope: this
                            });
                            if(options.hover == true) {
                                this.hoverResponse = response;
                            }
                        }

                        function findByFeature(feature,featurename,geometryname,value,propertyName,single) {
                            protocol = new OpenLayers.Protocol.WFS({
                                url:  'http://' + document.domain + ':' + location.port + '/gis_proxy/wfs',
                                srsName: "EPSG:100000",
                                featureType: feature,
                                featureNS: featurename,
                                geometryName: geometryname
                            });
                            var filter = new OpenLayers.Filter.Comparison({
                                type: OpenLayers.Filter.Comparison.LIKE,
                                property: propertyName,
                                value: "*"+value.toUpperCase()+"*"
                            });
                            requestSearch(value, {single: single,property: propertyName, filter: filter});
                        }

                        function requestSearchPredios(value, options) {
                            options = options || {};
                            var filter = options.filter;
                            // Set the cursor to "wait" to tell the user we're working.
                            OpenLayers.Element.addClass(Heron.App.map.viewPortDiv, "olCursorWait");
                            response = protocol.read({
                                maxFeatures:10,
                                filter: filter,
                                callback: function(result) {

                                    if(result.success()) {
                                        if(result.features.length) {
                                            if(options.single == true) {
                                                featureSearch = response.features[0];
                                                setStoreIdentify(featureSearch);
                                                identifyDialog.show();
                                                Heron.App.map.zoomToExtent(featureSearch.geometry.getBounds(),true);
                                            } else {
                                                storePredios.removeAll();
                                                arrayPredios = [];
                                                console.log("result.features.length", result.features.length);
                                                for (var i=0;i<result.features.length;i++)
                                                {
                                                    featureSearch = response.features[i];
                                                    var arrayPredio = [featureSearch.data['barmanpre'],featureSearch.data['chip'],featureSearch.data['matricula'],featureSearch.data['direccion']];

                                                    arrayPredios.push(arrayPredio);
                                                }
                                                storePredios.loadData(arrayPredios);
                                            }
                                        } else if(options.hover) {
                                            console.log("trata de hacer hover? :(");
                                        } else {
                                            alert("No hay registros");
                                        }
                                    }
                                    // Reset the cursor.

                                    OpenLayers.Element.removeClass(Heron.App.map.viewPortDiv, "olCursorWait");
                                },
                                scope: this
                            });
                            if(options.hover == true) {
                                this.hoverResponse = response;
                            }
                        }

                        function findPredios(feature,featurename,geometryname,value,single) {
                            protocol = new OpenLayers.Protocol.WFS({
                                url:  'http://' + document.domain + ':' + location.port + '/gis_proxy/wfs',
                                srsName: "EPSG:100000",
                                featureType: feature,
                                featureNS: featurename,
                                geometryName: geometryname
                            });
                            var filter = new OpenLayers.Filter.Logical({
                                type: OpenLayers.Filter.Logical.OR,
                                filters: [
                                    new OpenLayers.Filter.Comparison({
                                        type: OpenLayers.Filter.Comparison.LIKE,
                                        property: 'barmanpre',
                                        value: "*"+value.toUpperCase()+"*"
                                    }),
                                    new OpenLayers.Filter.Comparison({
                                        type: OpenLayers.Filter.Comparison.LIKE,
                                        property: 'chip',
                                        value: "*"+value.toUpperCase()+"*"
                                    }),
                                    new OpenLayers.Filter.Comparison({
                                        type: OpenLayers.Filter.Comparison.LIKE,
                                        property: 'matricula',
                                        value: "*"+value.toUpperCase()+"*"
                                    }),
                                    new OpenLayers.Filter.Comparison({
                                        type: OpenLayers.Filter.Comparison.LIKE,
                                        property: 'direccion',
                                        value: "*"+value.toUpperCase()+"*"
                                    })
                                ]
                            });
                            requestSearchPredios(value, {single: single,filter: filter});
                        }

                        function showVersionProyecto(){
                            /*
                             var newWMS = new OpenLayers.Layer.WMS("Proyecto "+campoProyectos.getValue(),
                             "http://" + document.domain + ":" + location.port + "/gis_proxy/wms",
                             {
                             layers: "mtv_gis:proyectos_mtv",
                             format: "image/png",
                             transparent: true,
                             visibility: false,
                             cql_filter: 'PROYECTO LIKE \''+comboProyectos.getValue()+'\' AND VERSION LIKE \''+comboVersiones.getValue()+'\''
                             },
                             {
                             isBaseLayer:false
                             }
                             );
                             Heron.App.map.addLayer(newWMS);
                             * */

                            findByFeature("proyectos_mtv","mtv_gis","the_geom",campoProyectos.getValue(),"proyecto",false);
                        }

                        var toolPanelSearchProyectos = new Ext.Panel({
                            title: 'Por proyectos',
                            items:[formPanelSearchProyectos,gridProyectos],
                            cls: 'empty'
                        });

                        var toolPanelSearchPorDivision = new Ext.Panel({
                            title: 'Por organización',
                            html: 'aquí van las búsquedas por oranización administrativa',
                            cls: 'empty'
                        });

                        var toolPanelSearchPredios = new Ext.Panel({
                            title: 'Por predios',
                            items:[formPanelSearchPredios,gridPredios],
                            cls: 'empty'
                        });

                        var accordionToolPanelSearchs = new Ext.Panel({
                            region:'west',
                            split:true,
                            layout:'accordion',
                            items: [toolPanelSearchPredios, toolPanelSearchProyectos, toolPanelSearchPorDivision]
                        });

                        var tabTools = new Ext.TabPanel({
                            id: 'toolTabPanel',
                            width:450,
                            activeTab: 0,
                            frame:true,
                            items:[
                                {
                                    title: 'Búsquedas',
                                    items: accordionToolPanelSearchs
                                },
                                {
                                    title: 'Exportar',
                                    html: 'Tab de exportar'
                                }
                            ]
                        });

                        var toolPanelDialog = new Ext.Window({
                            id:'toolPanel',
                            layout: "fit",
                            width: 450,
                            height: 450,
                            renderTo: "siim_mapdiv",
                            constrain: true,
                            closeAction: 'hide',
                            items: tabTools,
                            x: 10
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
                            {type: "measurelength", options: {geodesic: false}},
                            {type: "measurearea", options: {geodesic: false}},
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
                                    options.handler = function(){
                                        /*
                                         $scope.showGrillaPredios = true;
                                         $scope.$apply();
                                         */
                                        identifyDialog.show();
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
                            },
                            {
                                create: function(mapPanel, options){
                                    options.handler = function () {
                                        //toolPanelDialog.add(formPanel);
                                        toolPanelDialog.show();
                                    };
                                    toolPanelDisplayAction = new Ext.Action(options);
                                    return toolPanelDisplayAction;
                                },
                                options: {
                                    text : 'Herramientas'
                                }
                            }
                        ];
                        Heron.layout = {
                            xtype: 'hr_mappanel',
                            renderTo: 'siim_mapdiv',
                            height: sizeWindows.heightcontent,
                            width:  sizeWindows.widthcontent,
                            hropts: Heron.options.map
                        };

                        function loadDataGrid(barmanpreParam) {
                            var paramsSearch = {"sector": "008108150300122004"};
                            $scope.value = barmanpreParam;
                            $scope.featurelote = "lotes";
                            $scope.featurenamespace = "mtv_gis";
                            $scope.geometryname = "the_geom";
                            $scope.initGrid();
                            cwGrid.setParameters(paramsSearch);
                            $scope[cwGrid.getGridDataName()] = cwGrid.loadDataFromServer();
                        };

                        Heron.App.create();
                        Heron.App.map.addControl(featureInfoControl);
                        Heron.App.show();
                    }

                    position();
                    angular.element(window).bind('resize', function(){
                        timeoutId = $timeout(function() {
                            if( sizeWindows.widthcontent !== jquery($element.attr('id')).width()){
                                position(); }}, 2000);
                    });

                }
            };

            return directive;
        });

});