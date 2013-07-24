/*jslint browser: true*/
/*global define, console, $*/

define(['angular'], function (angular) {
  'use strict';  
  
var dirmodule = angular.module('kanbanBoardCtrl', []);

dirmodule.controller("kanbanBoardCtrl", function($scope) {
    $scope.columns = [
        {
            name: 'To Do', 
            notes: [
                {description: 'Buscar que hacer'},
                {description: 'El ser o el ente?'},
                {description: 'Salvar al mundo (con la panza llena)'},
                {description: 'Adoptar una directiva sin controlador'}
            ]
        },
        {
            name: 'Doing', 
            notes: [
                {description: 'plantilla de tareas'}
            ]
        },
        {
            name: 'Done', 
            notes: [
                {description: 'Perder muchoooo tiempo contando llaves, corchetes y paréntesis'},
                {description: 'hablar mal de JS'},
                {description: 'desterrar a Java'}
            ]
        }
    ];
    
});

});
