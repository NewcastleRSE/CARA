'use strict';

/**
 * @ngdoc function
 * @name rcaApp.controller:SlotSummaryCtrl
 * @description
 * # SlotSummaryCtrl
 * Controller of the rcaApp
 */
angular.module('rcaApp')
  .controller('SlotSummaryCtrl', function ($scope, Assessment, $stateParams) {
    Assessment.load($stateParams.slotId);

    $scope.questions = Assessment.questions.get();
  });
