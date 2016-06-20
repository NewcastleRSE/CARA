'use strict';

describe('Controller: SlotSummaryCtrl', function () {

  // load the controller's module
  beforeEach(module('rcaApp'));

  var SlotSummaryCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SlotSummaryCtrl = $controller('SlotSummaryCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SlotSummaryCtrl.awesomeThings.length).toBe(3);
  });
});
