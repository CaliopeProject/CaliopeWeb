/*jslint browser: true*/
/*global jasmine, define, describe, beforeEach, it, expect, inject, angular */
define(['angular-mocks', 'application-app', 'application-servicesWebSocket'], function() {

  describe("moduleWebSocket ...", function(){

    beforeEach(module('webSocket'));

    describe("webSocket ...", function(){
      beforeEach(inject(function(webSocket){
        var websck;

        var datasend = {
           id           : "b1f1f1c3-5151-42ca-b770-daee1a4b115d"
          ,jsonrpc      : "2.0"
          ,method       : "login.authenticate_with_uuid"
          ,params       : {session_uuid : "5106b9f4-a464-4c69-b9cc-e84dd8d3be22"}
        };

        var answer = {
           id: "b1f1f1c3-5151-42ca-b770-daee1a4b115d"
          ,jsonrpc: "2.0"
          ,result: {
               first_name : {value  : "User"}
              ,last_name  : {value : "Test"}
          }
        };

        websck = jasmine.createSpyObj('webSocket', ['initWebSockets', 'webSockets']);
        websck.initWebSockets();
        expect(websck.initWebSockets).toHaveBeenCalled();

        it('init websocket', function() {
          expect(webSocket.initWebSockets).toBe(Object);
          expect(webSocket.initWebSockets(datasend)).toEqual(answer);
        });

      }));
    });

  });
});
