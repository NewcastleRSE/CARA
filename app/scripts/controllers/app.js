'use strict';

/**
 * @ngdoc function
 * @name rcaApp.controller:AppCtrl
 * @description
 * # AppCtrl
 * Controller of the rcaApp
 */
angular.module('rcaApp')
  .controller('AppCtrl', function ($scope,$window) {
    $scope.doc = $window.document;
  });
