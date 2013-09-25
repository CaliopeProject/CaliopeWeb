define(['angular', 'gis-ext-base','gis-heron'], function(angular) {
  'use strict';

  var moduleControllers = angular.module('GisViewerController',[]);

  moduleControllers.controller('GisViewerController',
      ['$scope', '$routeParams','caliopewebTemplateSrv','caliopewebGridSrv', '$timeout',
      function ($scope, $routeParams, caliopewebTemplateSrv, caliopewebGridSrv, $timeout) {

          var sizeWindows = {};
          var timeoutId;
          var idContent = '#siim_mapdiv';
          sizeWindows.heightcontent = jQuery(idContent).height();
          sizeWindows.widthcontent  = jQuery(idContent).width();

          function position() {
              jQuery(idContent).html('');
              sizeWindows.heightcontent = jQuery(idContent).height();
              sizeWindows.widthcontent  = jQuery(idContent).width();

              Ext.namespace('Heron.options.map');
              Ext.namespace('Heron.App.mapPanel');

              $scope.gridSelection = [];
              $scope.$on('findPredioByBarmanpre',  function(){
                  console.log("gridSelection",$scope.gridSelection);
              });
              var cwGrid;
              $scope.featurelote;
              $scope.featurenamespace;
              $scope.geometryname;
              $scope.value;

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
                  cwGrid = $scope['gridPrediosmtv'];
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

                  cwGrid.setDecorators([CaliopeWebGridDataDecorator, CWGridColumnsDefNgGridDecorator])
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
                  maxResolution: 150,//Resolucion escala 1:100.000 es 0.0003174784228908226,
                  minResolution: 1,
                  zoom: 0
              };
              Heron.options.map.layers = [
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
                  new OpenLayers.Layer.WMS("Lotes",
                      "http://" + document.domain + ":" + location.port + "/gis_proxy/wms",
                      {
                          layers: "mtv_gis:lotes",
                          format: "image/png",
                          transparent: true
                      },
                      {
                          isBaseLayer:true
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
                  closeAction: 'hide'
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

              var formPanelSearchProyectos = new GeoExt.form.FormPanel({
                  items: [comboProyectos, comboVersiones]
              });

              formPanelSearchProyectos.addButton({
                  text: "Buscar",
                  handler: showVersionProyecto,
                  scope: formPanelSearchProyectos
              });

              function showVersionProyecto(){
                  //alert("estos son los valores seleccionados: Proyecto: "+comboProyectos.getValue()+" Versión: "+comboVersiones.getValue());
                  var newWMS = new OpenLayers.Layer.WMS("Proyectos",
                      "http://" + document.domain + ":" + location.port + "/gis_proxy/wms",
                      {
                          layers: "mtv_gis:proyectos_mtv_vr",
                          format: "image/png",
                          transparent: true,
                          visibility: false,
                          cql_filter: 'PROYECTO LIKE \''+comboProyectos.getValue()+'\' AND VERSION LIKE \''+comboVersiones.getValue()+'\''
                      },
                      {
                          isBaseLayer:false
                      }
                  )
                  Heron.App.map.addLayer(newWMS);
              }

              var toolPanelSearchProyectos = new Ext.Panel({
                  title: 'Por proyectos',
                  items:[formPanelSearchProyectos],
                  cls: 'empty'
              });

              var toolPanelSearchPorDivision = new Ext.Panel({
                  title: 'Por organización',
                  html: 'aquí van las búsquedas por oranización administrativa',
                  cls: 'empty'
              });

              var accordionToolPanelSearchs = new Ext.Panel({
                  region:'west',
                  split:true,
                  layout:'accordion',
                  items: [toolPanelSearchProyectos, toolPanelSearchPorDivision]
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
                  height: 250,
                  renderTo: "siim_mapdiv",
                  constrain: true,
                  closeAction: 'hide',
                  items: tabTools
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
                  if( sizeWindows.widthcontent !== jQuery(idContent).width()){
                      position(); }}, 2000);
          });

      }
   ]);
});
