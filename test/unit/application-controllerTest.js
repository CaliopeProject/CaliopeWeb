'use strict';

describe('my services', function () {
    beforeEach(module('controller'));

    describe('version', function () {
        it('should return current version', inject(function(version) {
            expect(version).toEqual('0.0.1');
        }));
    });
});
