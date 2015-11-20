'use strict';

/**
 * @ngdoc function
 * @name rcaApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the rcaApp
 */
angular.module('rcaApp')
  .controller('MainCtrl', function ($scope, $rootScope, Assessment) {
    $rootScope.navBarVis = false;

    $scope.startAssessment = function() {
      Assessment.start();
    };
  });
