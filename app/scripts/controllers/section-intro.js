'use strict';

/**
 * @ngdoc function
 * @name rcaApp.controller:SectionIntroCtrl
 * @description
 * # SectionIntroCtrl
 * Controller of the rcaApp
 */
angular.module('rcaApp')
  .controller('SectionIntroCtrl', function ($scope, Assessment, $stateParams) {
    Assessment.load($stateParams.slotId).then(function(){
      $scope.questions = Assessment.questions.get();

      $scope.currentSection = $stateParams.section;
      $scope.currentSlot = $stateParams.slotId;


      function getFirstRealQuestion() {
        var firstIndex = 0;
        $scope.questions[$scope.currentSection].items.forEach(function(item){
          if (item.practice === false || item.practice === undefined) {
            return firstIndex;
          }
          firstIndex++;
        });

        return firstIndex;
      }


      $scope.firstRealQuestion = getFirstRealQuestion();
    });


  });
