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

            if(item.name === 'Sentences Part 1'){
              hasCompleteSection = assessment.questions['sentence-part-2'].completed;
            }

            if(item.name === 'Sentences Part 2'){
              hasCompleteSection = assessment.questions['sentence-part-1'].completed;
            }
          }
        });

        return hasCompleteSection;
      };

      $scope.allSectionsComplete = function(assessment){

        var allComplete = true;

        angular.forEach(assessment.questions, function(item){
          if (item.completed === false) {
            allComplete = false;
          }
        });

        return allComplete;
      };
    });




  });
