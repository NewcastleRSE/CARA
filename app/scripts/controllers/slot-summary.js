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

    $scope.slotId = $stateParams.slotId;

    $scope.questions = Assessment.questions.get();

    $scope.participantId = Assessment.name;

    $scope.viewReport = function($index, assessment) {

      Report(assessment);

    };

    $scope.hasCompleteSection = function(assessment){

      var hasCompleteSection = false;

      angular.forEach(assessment.questions, function(item){
        if (item.completed == true) {
          hasCompleteSection = true;
        }
      });

      return hasCompleteSection;
    };
  });
