/*jslint browser: true*/
/*global define*/
define(
  (function(){
    var ws         = 'ws://';
    var urlws      = '/api/ws';
    var http       = 'http://';
    var domainname = document.domain;
    var pruebaPrue = '192.168.50.32';
    var localport  = location.port ;

    //filie uploader
    var port1      = '9020';
    var url1       = '/upload/';

    return {
      'caliope_server_address'   : ws    + domainname + ':' + localport + urlws,
      //'caliope_server_address'   : ws    + pruebaPrue + ':' + localport + urlws,
      'hyperion_server_address'  : http  + domainname + ':' +  port1 + url1
    }
  }())
);
