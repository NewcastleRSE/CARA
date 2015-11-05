'use strict';

describe('Controller: SetupCtrl', function () {

  // load the controller's module
  beforeEach(module('rcaApp'));

  var SetupCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SetupCtrl = $controller('SetupCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SetupCtrl.awesomeThings.length).toBe(3);
  });
});
