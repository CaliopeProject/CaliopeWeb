/*jslint browser: true*/
/*global $scope, angular */
define(['angular','angular-ui-bootstrap-bower'], function(angular) {
  'use strict';
  var moduleControllers = angular.module('menu-right-controller', ['ui.bootstrap']);

  moduleControllers.controller('menuRightController',['$scope',
    function($scope){

      $scope.shortcuts = [
        { btn  : 'info',    icon  : 'pencil', url : '#/tools/wysihtml5-editor', ttip : 'Editor'},
        { btn  : 'warning', icon  : 'cogs'  , url : '#/kanban', ttip : 'Kanban'},
        { btn  : 'error',   icon  : 'globe' , url : '#/gis'   , ttip : 'Gis'},
        { btn  : 'inverse', icon  : 'heart' , url : '#/tools/upload/files', ttip : 'Cargar archivos'},
        { btn  : 'danger',  icon  : 'book' , url : '#/crear-proyectomtv/proyectomtv/create'   , ttip : 'Gis'},
        { btn  : 'inverse',  icon  : 'comments' , url : '#/caliopeweb-forms/SIIMForm/create'   , ttip : 'Gis'},
        { btn  : 'success',  icon  : 'coffee' , url : '#/caliopeweb-grids/SIIMForm' , ttip : 'Gis'}
      ];

      $scope.closeMenu = function(){
        $scope.$emit('closemenu');
      };
    }
  ]);
});
