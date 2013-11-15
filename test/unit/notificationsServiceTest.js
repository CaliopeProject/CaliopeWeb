/*jslint browser: true*/
/*global  jasmine, define, describe, beforeEach, it, expect, inject, angular */
define(['angular-mocks', 'notificationsService'], function() {

  describe("module_NotificationServices... ", function(){

    beforeEach(module('NotificationsServices'));

    describe("service_HandlerResponseServerSrv...", function(){

      it('service HandlerResponseServerSrv', inject(function(HandlerResponseServerSrv, $q, $rootScope){
        var deferred = $q.defer();
        var promise  = deferred.promise;
        var resolvedValue;

        var resul =  HandlerResponseServerSrv.addPromisesHandlerRespNotif(promise);
        resul.then(function(value){ resolvedValue = value;});
        deferred.resolve({result: {dato : {value : 123}}});
        // Simulate resolving of promise
        // Note that the 'then' function does not get called synchronously.
        // This is because we want the promise API to always be async, whether or not
        // it got called synchronously or asynchronously.
        // Propagate promise resolution to 'then' functions using $apply().
        $rootScope.$apply();
        expect(resolvedValue).toEqual({dato : 123});
      }));

    });

    describe("service_HandlerNotification..", function(){
      var handler;
      it('service HandlerNotification', inject(function(HandlerNotification){
        handler = jasmine.createSpyObj('HandlerNotification', ['sendmessage']);
        handler.sendmessage('Message');
        expect(handler.sendmessage).toHaveBeenCalled();
        expect(handler.sendmessage).toHaveBeenCalledWith('Message');
        expect(HandlerNotification.sendinfo).toBeDefined();
      }));
    });

  });
});
