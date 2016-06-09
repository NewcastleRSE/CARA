'use strict';

/**
 * @ngdoc function
 * @name rcaApp.controller:SlotSummaryCtrl
 * @description
 * # SlotSummaryCtrl
 * Controller of the rcaApp
 */
angular.module('rcaApp')
  .controller('SlotSummaryCtrl', function ($scope, Assessment, $stateParams, $rootScope, Report, Storage) {
    Storage.load($stateParams.slotId).then(function(assessment){
      $scope.slotId = $stateParams.slotId;

      $scope.assessment = assessment;

      $scope.viewReport = function($index, assessment) {

        new Report(assessment);

      };

      $scope.hasCompleteSection = function(assessment){

        var hasCompleteSection = false;

        angular.forEach(assessment.questions, function(item){
          if (item.completed === true) {
            hasCompleteSection = true;
          }
        });

        return hasCompleteSection;
      };
    });




  });
