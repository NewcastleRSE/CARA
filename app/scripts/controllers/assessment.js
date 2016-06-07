'use strict';

/**
 * @ngdoc function
 * @name rcaApp.controller:AssessmentCtrl
 * @description
 * # AssessmentCtrl
 * Controller of the rcaApp
 */
angular.module('rcaApp')
  .controller('AssessmentCtrl', function ($scope, $rootScope, Assessment, $state, $timeout, $window, $stateParams) {

    $rootScope.navBarVis = false;

    $scope.debug = localStorage.getItem('rca-debug');

    if (Assessment.questions.get().length < 1) {
      $state.go('home');
    } else {

      $scope.questions = Assessment.questions.get();

      $scope.currentAssessmentType = $scope.questions[$stateParams.section].assessmentType;

      $scope.currentSection = $stateParams.section;
      $scope.currentSlot = $stateParams.slotId;
      $scope.currentItemIndex = $stateParams.itemIndex;
      $scope.paragraphQIndex = $stateParams.paragraphQIndex !== null ? $stateParams.paragraphQIndex : false;
      $scope.newSection = true;
      $scope.currentPage = 0;

      $scope.newTimestamp = function() {
        return new Date();
      };

      $scope.setAnswer = function($item, $answer, $index) {

        //console.log($item, $answer, $index);
        //console.log($scope.currentSection);

        $item.finished = new Date();
        $item.timeTaken = $item.finished - $item.started;
        $item.finished = $item.finished.toString();
        $item.started = $item.started.toString();

        $item.answerGiven = $answer;
        $item.answerPosition = $index;

        //console.log($scope.paragraphQIndex, $scope.questions[$stateParams.section].items[$scope.currentItemIndex].questions[$scope.paragraphQIndex + 1])

        // Check if this a question for a paragraph and we have another question
        if ($scope.paragraphQIndex && $scope.paragraphQIndex !== false && $scope.questions[$stateParams.section].items[$scope.currentItemIndex].questions[$scope.paragraphQIndex + 1]) {
          $state.go('assessmentQuestions.paragraph', {"paragraphQIndex" : ($scope.paragraphQIndex + 1)})
        }
        // check we have another question
        else if ($scope.questions[$stateParams.section].items[$scope.currentItemIndex + 1]) {

          // check if we are finishing the practice section
          var finishingPractice = ($scope.questions[$stateParams.section].items[$scope.currentItemIndex].practice === true && $scope.questions[$stateParams.section].items[$scope.currentItemIndex + 1].practice === false)

          if (finishingPractice) {
            // Show Start test screen
            $state.go('assessment.begin',{slotId:$scope.currentSlot, section: $scope.currentSection})
          } else {
            //Show next question
            $state.go('assessmentQuestions',{slotId:$scope.currentSlot, section: $scope.currentSection, itemIndex: $scope.currentItemIndex+1})
          }

        } else {
          // Section Completed
          $scope.questions[$stateParams.section].completed = true;
          Assessment.save($scope.questions).then(function(){
            $state.go('slotSummary', {slotId:$scope.currentSlot});
          });

        }

      };

    }

    $scope.setCurrentPageIndex = function (index) {
      $scope.currentIndex = index;
    };

    $scope.isCurrentPageIndex = function (index) {
      console.log(index);
      return $scope.currentIndex === index;
    };

    $scope.acceptParagraph = function($item){
      $item.finished = new Date();
      $item.timeTaken = $item.finished - $item.started;
      $item.finished = $item.finished.toString();
      $item.started = $item.started.toString();

      $state.go('assessmentQuestions.paragraph', {"paragraphQIndex" : 0});

    };

  });
