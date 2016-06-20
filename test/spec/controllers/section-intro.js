'use strict';

describe('Controller: SectionIntroCtrl', function () {

  // load the controller's module
  beforeEach(module('rcaApp'));

  var SectionIntroCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SectionIntroCtrl = $controller('SectionIntroCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SectionIntroCtrl.awesomeThings.length).toBe(3);
  });
});
