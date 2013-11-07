'use strict';

define(['angular', 'application-controller'], function(angular) {
  describe('my services', function () {

    beforeEach(module('CaliopeController'));

    describe('version', function () {
      it('should return current version', inject(function(version) {
        expect(version).toEqual('0.0.1');
      }));
    });

    describe("A suite", function() {
      it("contains spec with an expectation", function() {
        expect(true).toBe(true);
      });
    });

    describe("A suite is just a function", function() {
      var a;
      it("and so is a spec", function() {
        a = true;
        expect(a).toBe(true);
      });
    });

    describe("The 'toBe' matcher compares with ===", function() {
      it("and has a positive case ", function() {
        expect(true).toBe(true);
      });

      it("and can have a negative case", function() {
        expect(false).not.toBe(true);
      });
    })

  });
});
