'use strict';

describe('Service: assessment', function () {

  // load the service's module
  beforeEach(module('rcaApp'));

  // instantiate service
  var assessment;
  beforeEach(inject(function (_assessment_) {
    assessment = _assessment_;
  }));

  it('should do something', function () {
    expect(!!assessment).toBe(true);
  });

});
