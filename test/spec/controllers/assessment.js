'use strict';

describe('Controller: AssessmentCtrl', function () {

  // load the controller's module
  beforeEach(module('rcaApp'));

  var AssessmentCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AssessmentCtrl = $controller('AssessmentCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AssessmentCtrl.awesomeThings.length).toBe(3);
  });
});
