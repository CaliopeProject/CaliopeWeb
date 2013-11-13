/*jslint browser: true*/
/*global define, describe, beforeEach, it, expect, inject, angular */
define(['angular', 'angular-mocks', 'application-app', 'application-controller'], function() {

  describe("moduleCaliopeController ...", function(){

    beforeEach(function(){
      this.addMatchers({
        toEqualData: function(expected) {
          return angular.equals(this.actual, expected);
        }
      });
    });


    beforeEach(module('caliope'));
    beforeEach(module('CaliopeController'));

    describe("CaliopeController ...", function(){

      var scope, ctrl;

      it('init controller', inject(function($rootScope, $controller){
        scope = $rootScope.$new();
        ctrl = $controller('CaliopeController', {$scope: scope});
        expect(ctrl).toBeDefined();
      }));

      it("init menu hiden", function() {
        expect(scope.showMenu).toBe(false);
      });

      it("user is not authenticated", function() {
        expect(scope.isAuthenticated()).toBe(false);
      });

      it("exist alert message format", function() {
        expect(scope.alerts).toEqualData([]);
      });

      it("have no pending requests", function() {
        expect(scope.hasPendingRequests()).toBe(false);
      });

    });
  });
});
