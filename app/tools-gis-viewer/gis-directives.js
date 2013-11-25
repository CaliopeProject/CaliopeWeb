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

                        var findStyle = new OpenLayers.StyleMap({
                            "default": new OpenLayers.Style({
                                fillColor: "#ffcc66",
                                strokeColor: "#ff9933",
                                strokeWidth: 2,
                                graphicZIndex: 1
                            })
                        });

                        var selectedStyle = new OpenLayers.StyleMap({
                            "default": new OpenLayers.Style({
                                fillColor: "#66ccff",
                                strokeColor: "#3399ff",
                                graphicZIndex: 2
                            })
                        });

                        var featuresFinded = new OpenLayers.Layer.Vector("Elementos encontrados", {
                            styleMap: findStyle,
                            rendererOptions: {zIndexing: true}
                        });

                        var featuresSelected = new OpenLayers.Layer.Vector("Elementos seleccionados", {
                            styleMap: selectedStyle,
                            rendererOptions: {zIndexing: true}
                        });

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
                                    layers: "mtv_gis:prediacion_metrovivienda",
                                    format: "image/png",
                                    transparent: true,
                                    visibility: true
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
                            id:'identifyDialog',
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
                                        icon   : '/tools-gis-viewer/images/heron/silk/information.png',  // Use a URL in the icon config
                                        tooltip: 'Ver informaci&oacuten',
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
                            title: 'Resultado b&uacute;squeda de Proyectos',
                            stateful: true,
                            stateId: 'gridProyectos'
                        });

                        function showInfoProyectos(e){ // e is not a standard event object, it is a Ext.EventObject
                            //setStoreIdentify(featureSearch);
                            storeProyectos.removeAll();
                            arrayProyectos = [];
                            for (var i=0;i<featureSearch.length;i++)
                            {
                                var arrayProyecto = [featureSearch[i].data['proyecto'],featureSearch[i].data['id'],featureSearch[i].data['estado']];
                                arrayProyectos.push(arrayProyecto);
                            }
                            storeProyectos.loadData(arrayProyectos);
                        }

                        var toolPanelDisplayAction;

                        var datosProyectos = [
                            ['--',0],
                            ['USME 1',1],
                            ['LA VIA LACTEA',2]
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
                            emptyText:'Seleccione una Versi&oacuten',
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
                                            findByFeature("proyectos_mtv","mtv_gis","the_geom",rec.get('proyecto'),"proyecto",true,'zoomToFeature');
                                        }
                                    }]
                                },
                                {
                                    xtype: 'actioncolumn',
                                    width: 30,
                                    items: [{
                                        icon   : '/tools-gis-viewer/images/heron/silk/information.png',  // Use a URL in the icon config
                                        tooltip: 'Ver informaci&oacuten',
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
                            title: 'Resultado b&uacute;squeda de Proyectos',
                            stateful: true,
                            stateId: 'gridProyectos',
                            layout: 'fit'
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
                            idProperty: 'BARMANPRE',
                            fields: [
                                'BARMANPRE',
                                'CHIP',
                                'MATINM',
                                'DIRE']
                        });

                        // WFS actions

                        var saveStrategy = new OpenLayers.Strategy.Save();

                        saveStrategy.events.on({
                            'success': function(event) {
                                console.log("esto trae el evento: ",event);
                                alert('Se han guardado los cambios');
                                infoPrediosDialog.hide();
                            },
                            'fail': function(event) {
                                alert('No se han guardado los cambios');
                                infoPrediosDialog.hide();
                            },
                            scope: this
                        });

                        var wfsPrediosMTV = new OpenLayers.Layer.Vector("Elementos Predios Metrovivienda", {
                            strategies: [new OpenLayers.Strategy.BBOX(), saveStrategy],
                            projection: "EPSG:100000",
                            visibility: false,
                            protocol: new OpenLayers.Protocol.WFS({
                                version: "1.1.0",
                                srsName: "EPSG:100000",
                                url:  'http://' + document.domain + ':' + location.port + '/gis_proxy/wfs',
                                featureNS :  "mtv_gis",
                                featureType: "prediacion_metrovivienda",
                                geometryName: "the_geom",
                                schema: 'http://' + document.domain + ':' + location.port + '/gis_proxy/wfs/'+"DescribeFeatureType?version=1.1.0&typename=mtv_gis:prediacion_metrovivienda"
                            })
                        });

                        // end WFS actions

                        var featureSelected;

                        var gridPredios = new Ext.grid.GridPanel({
                            store: storePredios,
                            sm: new Ext.grid.RowSelectionModel({singleSelect: true}),
                            columns: [

                                {
                                    id       :'BARMANPRE',
                                    header   : 'Barmanpre',
                                    width    : 30,
                                    sortable : true,
                                    dataIndex: 'BARMANPRE'
                                },{
                                    id       :'CHIP',
                                    header   : 'Chip',
                                    width    : 160,
                                    sortable : true,
                                    dataIndex: 'CHIP'
                                },
                                {
                                    id       :'MATINM',
                                    header   : 'Matr&iacute;cula',
                                    width    : 90,
                                    sortable : true,
                                    dataIndex: 'MATINM'
                                },
                                {
                                    id       :'DIRE',
                                    header   : 'Direcci&oacuten',
                                    width    : 90,
                                    sortable : true,
                                    dataIndex: 'DIRE'
                                },
                                {
                                    xtype: 'actioncolumn',
                                    width: 30,
                                    items: [{
                                        icon   : '/tools-gis-viewer/images/heron/silk/information.png',  // Use a URL in the icon config
                                        tooltip: 'Ver informaci&oacuten',
                                        handler: function(grid, rowIndex, colIndex) {
                                            var rec = storePredios.getAt(rowIndex);
                                           // findByFeature("predios_metrovivienda","mtv_gis","the_geom",rec.get('chip'),"chip",true);
                                            featureSelected = featuresFinded.features[rowIndex];
                                            findByFeature("prediacion_metrovivienda","mtv_gis","the_geom",rec.get('CHIP'),"CHIP",true,'showInfoPredios');
                                            //featureInfoPredio(featureSelected);
                                        }
                                    }]
                                }
                            ],
                            stripeRows: true,
                            height: 350,
                            title: 'Resultado b&uacute;squeda de Predios',
                            stateful: true,
                            stateId: 'gridPredios'
                        });

                        gridPredios.getSelectionModel().on('rowselect', function(sm, rowIdx, r) {
                            var rec = storePredios.getAt(rowIdx);
                            var featureToShow = featuresFinded.features[rowIdx];
                            Heron.App.map.removeLayer(featuresSelected);
                            Heron.App.map.removeLayer(featuresFinded);
                            featuresSelected.removeAllFeatures();
                            featuresSelected.addFeatures(featureToShow);
                            Heron.App.map.addLayers([featuresFinded,featuresSelected]);
                            Heron.App.map.zoomToExtent(featureToShow.geometry.getBounds(),true);
                        });

                        var formPanelInfoPredio = new GeoExt.form.FormPanel({
                            title: 'Informaci&oacute;n del Predio',
                            id:'formPanelInfoPredio',
                            autoScroll: true,
                            items: [{
                                xtype: 'textfield',
                                fieldLabel: 'Barmanpre',
                                name: 'barmanpre',
                                readOnly: true
                            }, {
                                xtype: 'textfield',
                                fieldLabel: 'Chip',
                                name: 'chip',
                                readOnly: true
                            }, {
                                xtype: 'textfield',
                                fieldLabel: 'Matr&iacute;cula Inmobiliaria',
                                name: 'matinm',
                                readOnly: true
                            }, {
                                xtype: 'textfield',
                                fieldLabel: 'Direcci&oacuten',
                                name: 'dire',
                                readOnly: true
                            }, {
                                xtype: 'textfield',
                                fieldLabel: 'Nombre propietario',
                                name: 'nompropie'
                            }, {
                                xtype: 'textfield',
                                fieldLabel: 'Tipo identificaci&oacuten',
                                name: 'tipoiden'
                            }, comboProyectos,
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Observaci&oacuten',
                                name: 'observa'
                            }, {
                                xtype: 'textfield',
                                fieldLabel: 'Área m2',
                                name: 'aream2',
                                readOnly: true
                            }, {
                                xtype: 'textfield',
                                fieldLabel: 'Área Ha',
                                name: 'areaha',
                                readOnly: true
                            }, {
                                xtype: 'textfield',
                                fieldLabel: 'Observaci&oacuten 1',
                                name: 'observa1'
                            }]
                        });

                        formPanelInfoPredio.addButton({
                            text: "Guardar",
                            handler: savePredio,
                            scope: formPanelInfoPredio
                        });

                        var infoPrediosDialog = new Ext.Window({
                            layout: "fit",
                            width: 400,
                            height: 350,
                            autoScroll:true,
                            renderTo: "siim_mapdiv",
                            constrain: true,
                            closeAction: 'hide',
                            x: 10,
                            y:500,
                            items:[formPanelInfoPredio]
                        });


                        var newFeatureState;

                        function featureInfoPredio(){
                            console.log('entra al featureInfoPredio con',featureSearch);
                            if(featureSearch!=null){
                                console.log('pasa por aca');
                                newFeatureState = OpenLayers.State.UPDATE;
                                console.log('0');
                                comboProyectos.setValue(featureSearch.attributes['PROYECTO']);
                                console.log('1');
                                formPanelInfoPredio.getForm().setValues({
                                    barmanpre: featureSearch.attributes['BARMANPRE'],
                                    chip: featureSearch.attributes['CHIP'],
                                    matinm: featureSearch.attributes['MATRICULA'],
                                    dire: featureSearch.attributes['DIRECCION'],
                                    aream2: featureSearch.geometry.components[0].getArea(),
                                    areaha: (featureSearch.geometry.components[0].getArea()/10000),
                                    nompropie: featureSearch.attributes['NOM_PROPIE'],
                                    tipoiden: featureSearch.attributes['TIPO_IDEN'],
                                    observa:featureSearch.attributes['OBSERVA'],
                                    observa1: featureSearch.attributes['OBSERVA_1']
                                });
                                console.log('2');
                                console.log('termina de pasar');
                            }else{
                                newFeatureState = OpenLayers.State.INSERT;
                                comboProyectos.setValue('');
                                formPanelInfoPredio.getForm().setValues({
                                    barmanpre: featureSelected.attributes['BARMANPRE'],
                                    chip: featureSelected.attributes['CHIP'],
                                    matinm: featureSelected.attributes['MATINM'],
                                    dire: featureSelected.attributes['DIRE'],
                                    aream2: featureSelected.geometry.components[0].getArea(),
                                    areaha: (featureSelected.geometry.components[0].getArea()/10000),
                                    nompropie: '',
                                    tipoiden: '',
                                    observa: '',
                                    observa1: ''
                                });
                            }
                            infoPrediosDialog.show();
                        }

                        function savePredio(){
                            wfsPrediosMTV.removeAllFeatures();
                            var attributes = {
                                BARMANPRE: formPanelInfoPredio.getForm().findField('barmanpre').getValue(),
                                CHIP: formPanelInfoPredio.getForm().findField('chip').getValue(),
                                MATRICULA: formPanelInfoPredio.getForm().findField('matinm').getValue(),
                                DIRECCION: formPanelInfoPredio.getForm().findField('dire').getValue(),
                                NOM_PROPIE: formPanelInfoPredio.getForm().findField('nompropie').getValue(),
                                TIPO_IDEN: formPanelInfoPredio.getForm().findField('tipoiden').getValue(),
                                NUM_IDEN: 0,
                                NUM_PROP: 0,
                                PROYECTO: comboProyectos.getValue(),
                                OBSERVA: formPanelInfoPredio.getForm().findField('observa').getValue(),
                                AREA_m2: formPanelInfoPredio.getForm().findField('aream2').getValue(),
                                AREA_Ha: formPanelInfoPredio.getForm().findField('areaha').getValue(),
                                OBSERVA_1: formPanelInfoPredio.getForm().findField('observa1').getValue()
                            };

                            if(newFeatureState == OpenLayers.State.INSERT){
                                var newFeature;
                                newFeature = new OpenLayers.Feature.Vector(featureSelected.geometry,attributes);
                                newFeature.state = newFeatureState;
                                wfsPrediosMTV.addFeatures([newFeature]);
                            }else{
                                featureSearch.state = newFeatureState;
                                featureSearch.attributes['BARMANPRE'] = attributes['BARMANPRE'];
                                featureSearch.attributes['CHIP'] = attributes['CHIP'];
                                featureSearch.attributes['MATRICULA'] = attributes['MATRICULA'];
                                featureSearch.attributes['DIRECCION'] = attributes['DIRECCION'];
                                featureSearch.attributes['AREA_m2'] = attributes['AREA_m2'];
                                featureSearch.attributes['AREA_Ha'] = attributes['AREA_Ha'];;
                                featureSearch.attributes['NOM_PROPIE'] = attributes['NOM_PROPIE'];
                                featureSearch.attributes['TIPO_IDEN'] = attributes['TIPO_IDEN'];
                                featureSearch.attributes['OBSERVA'] = attributes['OBSERVA'];
                                featureSearch.attributes['OBSERVA_1'] = attributes['OBSERVA_1'];
                                wfsPrediosMTV.addFeatures([featureSearch]);
                            }
                            saveStrategy.save();
                        }

                        var formPanelSearchPredios = new GeoExt.form.FormPanel({
                            items: [campoPredio]
                        });

                        formPanelSearchPredios.addButton({
                            text: "Buscar",
                            handler: showPredios,
                            scope: formPanelSearchPredios
                        });

                        function showPredios(){
                            findPredios("loteo","mtv_gis","the_geom",campoPredio.getValue(),false);
                        }

                        formPanelSearchPredios.addButton({
                            text: "Limpiar",
                            handler: clearSearchPredios,
                            scope: formPanelSearchPredios
                        });

                        function clearSearchPredios(){
                            featuresFinded.removeAllFeatures();
                            storePredios.removeAll();
                            Heron.App.map.removeLayer(featuresFinded);
                            campoPredio.setValue('');
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
                                        featureSearch = null;
                                        if(result.features.length) {
                                            if(options.single == true) {
                                                featureSearch = response.features[0];
                                                toolPanelDialog.fireEvent(options.eventToFire);
                                            } else {
                                                featureSearch = response.features;
                                            }
                                        } else if(options.hover) {
                                            console.log("trata de hacer hover? :(");
                                        } else {
                                            if(options.eventToFire){
                                                toolPanelDialog.fireEvent(options.eventToFire);
                                            }else{
                                                alert("No hay registros");
                                            }
                                        }
                                    }// Reset the cursor.
                                    OpenLayers.Element.removeClass(Heron.App.map.viewPortDiv, "olCursorWait");

                                },
                                scope: this
                            });
                            if(options.hover == true) {
                                this.hoverResponse = response;
                            }
                        }

                        function findByFeature(feature,featurename,geometryname,value,propertyName,single,eventToFire) {
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
                            requestSearch(value, {single: single,property: propertyName, filter: filter,eventToFire:eventToFire});
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
                                                return featureSearch;
                                            } else {
                                                featuresFinded.removeAllFeatures();
                                                storePredios.removeAll();
                                                arrayPredios = [];
                                                console.log("result.features.length", result.features.length);
                                                for (var i=0;i<result.features.length;i++)
                                                {
                                                    featureSearch = response.features[i];
                                                    var arrayPredio = [featureSearch.data['BARMANPRE'],featureSearch.data['CHIP'],featureSearch.data['MATINM'],featureSearch.data['DIRE']];

                                                    arrayPredios.push(arrayPredio);
                                                }
                                                storePredios.loadData(arrayPredios);
                                                featuresFinded.addFeatures(result.features);
                                                Heron.App.map.addLayers([featuresFinded]);
                                                Heron.App.map.zoomToExtent(featuresFinded.getDataExtent());
                                                console.log('si funcionó?');
                                                //identifyDialog.fireEvent('showInfoProyecto');
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
                                        property: 'BARMANPRE',
                                        value: "*"+value.toUpperCase()+"*"
                                    }),
                                    new OpenLayers.Filter.Comparison({
                                        type: OpenLayers.Filter.Comparison.LIKE,
                                        property: 'CHIP',
                                        value: "*"+value.toUpperCase()+"*"
                                    }),
                                    new OpenLayers.Filter.Comparison({
                                        type: OpenLayers.Filter.Comparison.LIKE,
                                        property: 'MATINM',
                                        value: "*"+value.toUpperCase()+"*"
                                    }),
                                    new OpenLayers.Filter.Comparison({
                                        type: OpenLayers.Filter.Comparison.LIKE,
                                        property: 'DIRE',
                                        value: "*"+value.toUpperCase()+"*"
                                    })
                                ]
                            });
                            requestSearchPredios(value, {single: single,filter: filter});
                        }

                        function showVersionProyecto(){
                           findByFeature("proyectos_mtv","mtv_gis","the_geom",campoProyectos.getValue(),"proyecto",false);
                        }

                        var toolPanelSearchProyectos = new Ext.Panel({
                            title: 'Por proyectos',
                            items:[formPanelSearchProyectos,gridProyectos],
                            cls: 'empty'
                        });

                        var toolPanelSearchPorDivision = new Ext.Panel({
                            title: 'Por organizaci&oacuten',
                            html: 'aquí van las búsquedas por oranización administrativa',
                            cls: 'empty'
                        });

                        var toolPanelGridPredios = new Ext.FormPanel({
                            items:[gridPredios],
                            layout: 'fit'
                        });

                        var toolPanelSearchPredios = new Ext.Panel({
                            title: 'Por predios',
                            items:[formPanelSearchPredios,toolPanelGridPredios],
                            cls: 'empty'
                        });

                        var tabToolPanelSearchs = new Ext.TabPanel({
                            region:'west',
                            split:true,
                            activeTab: 0,
                            frame:true,
                            items: [toolPanelSearchPredios, toolPanelSearchProyectos, toolPanelSearchPorDivision]
                        });

                        var tabTools = new Ext.TabPanel({
                            id: 'toolTabPanel',
                            width:450,
                            activeTab: 0,
                            frame:true,
                            items:[
                                {
                                    title: 'B&uacute;squedas',
                                    items: tabToolPanelSearchs
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
                                        layerTreeDialog.add(layerTree);
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

                        var layerList = new GeoExt.tree.LayerContainer({
                            text: 'Capas',
                            leaf: false,
                            expanded: true,
                            loader: {
                                baseAttrs: {
                                    radioGroup: "active"
                                },
                                filter: function(record) {
                                    console.log("record",record);
                                    return record.get("layer").name.indexOf("Elementos") == -1
                                }
                            }
                        });
                        var registerRadio = function(node){
                            if(!node.hasListener("radiochange")) {
                                node.on("radiochange", function(node){
                                    /* set your active layer here */
                                    console.log("node",node);
                                });
                            }
                        }

                        var layerTree = new Ext.tree.TreePanel({
                            title: 'Capas',
                            root: layerList,
                            listeners: {
                                append: registerRadio,
                                insert: registerRadio
                            }
                        });

                        Heron.App.map.addControl(featureInfoControl);
                        Heron.App.map.addLayers([featuresFinded,featuresSelected,wfsPrediosMTV]);
                        toolPanelDialog.addEvents('showInfoPredios');
                        toolPanelDialog.on('showInfoPredios',featureInfoPredio,this);
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