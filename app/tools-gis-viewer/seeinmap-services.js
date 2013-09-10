/*jslint browser: true*/
/*global localStorage, Crypto, $scope*/
define(['angular', 'angular-ui-bootstrap-bower'], function(angular) {
    'use strict';

    var moduleServices = angular.module('seeinmap-services', ['ui.bootstrap.dialog']);
    var protocol;
    var response;
    moduleServices.factory('seeinmapService',
        ['SessionSrv', '$log','$http', '$q', '$location', '$dialog', '$rootScope', 'webSocket', 'caliopewebTemplateSrv'
            , function( security,    $log,  $http,   $q,   $location,   $dialog,   $rootScope,   webSocket, tempServices) {

           // The public API of the service
            var service =  {
                findByPredio: function(feature,featurename,geometryname,value) {
                    protocol = new OpenLayers.Protocol.WFS({
                        url:  'http://' + document.domain + ':' + location.port + '/gis_proxy/wfs',
                        srsName: "EPSG:4686",
                        featureType: feature,
                        featureNS: featurename,
                        geometryName: geometryname
                    });
                    this.request(value, {single: true});
                },
                request: function(value, options) {
                    options = options || {};
                    var filter = new OpenLayers.Filter.Comparison({
                        type: OpenLayers.Filter.Comparison.LIKE,
                        property: "LotCodigo",
                        value: value
                    });
                    // Set the cursor to "wait" to tell the user we're working.
                    OpenLayers.Element.addClass(Heron.App.map.viewPortDiv, "olCursorWait");

                    response = protocol.read({
                        maxFeatures: options.single == true ? this.maxFeatures : undefined,
                        filter: filter,
                        callback: function(result) {
                            if(result.success()) {
                                if(result.features.length) {
                                    if(options.single == true) {
                                        var featureSearch = response.features[0];
                                        Heron.App.map.zoomToExtent(featureSearch.geometry.getBounds(),true);
                                    } else {
                                        console.log("trae varios",result.features);
                                    }
                                } else if(options.hover) {
                                    console.log("trata de hacer hover? :(");
                                } else {
                                    console.log("no funcionó :(");
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


            };

            return service;

        }]);
});

