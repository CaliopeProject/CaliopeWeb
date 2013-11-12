define(['angular-mocks', 'application-controller'], function() {

  beforeEach(module('CaliopeController'));

  beforeEach(function(){
    module('angular-table');
    module('events');
  });

  module(function ($provide) {
    $provide.value('yourService', serviceMock);
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