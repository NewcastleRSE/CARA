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
      $scope.paragraphQIndex = $stateParams.paragraphQIndex !== undefined ? $stateParams.paragraphQIndex : false;
      $scope.newSection = true;
      $scope.currentPage = 0;

      $scope.newTimestamp = function() {
        return new Date();
      };

      $scope.setAnswer = function($item, $answer, $index) {

        $item.finished = new Date();
        $item.timeTaken = $item.finished - $item.started;
        $item.finished = $item.finished.toString();
        $item.started = $item.started.toString();

        $item.answerGiven = $answer;
        $item.answerPosition = $index;

        // Check if this a question for a paragraph and we have another question
        if ($scope.paragraphQIndex !== undefined && $scope.paragraphQIndex !== false && $scope.questions[$stateParams.section].items[$scope.currentItemIndex].questions[$scope.paragraphQIndex + 1]) {
          $state.go('assessmentQuestions.paragraph', {'paragraphQIndex' : ($scope.paragraphQIndex + 1)});
        }
        // check we have another question
        else if ($scope.questions[$stateParams.section].items[$scope.currentItemIndex + 1]) {

          // check if we are finishing the practice section
          var finishingPractice = ($scope.questions[$stateParams.section].items[$scope.currentItemIndex].practice === true && ($scope.questions[$stateParams.section].items[$scope.currentItemIndex + 1].practice === false || $scope.questions[$stateParams.section].items[$scope.currentItemIndex + 1].practice === undefined));

          if (finishingPractice) {
            // Show Start test screen
            $state.go('assessment.begin',{slotId:$scope.currentSlot, section: $scope.currentSection});
          } else {
            //Show next question
            $state.go('assessmentQuestions',{slotId:$scope.currentSlot, section: $scope.currentSection, itemIndex: $scope.currentItemIndex+1});
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

    $scope.currentItemIsPractice = function(){
      return $scope.questions[$stateParams.section].items[$scope.currentItemIndex].practice;
    };

    $scope.isParagraph = function() {
      return $stateParams.section === 'paragraph' && $state.current.name === 'assessmentQuestions';
    };

    $scope.acceptParagraph = function($item){
      $item.finished = new Date();
      $item.timeTaken = $item.finished - $item.started;
      $item.finished = $item.finished.toString();
      $item.started = $item.started.toString();

      $state.go('assessmentQuestions.paragraph', {'paragraphQIndex' : 0});
    };

    $scope.selectReadingScale = function($item, $value) {
      $scope.answerPresent = true;

      $scope.answerGiven = $value;
      $item.answerGiven = $value;

      document.getElementById("div-1").classList.remove("selected");
      document.getElementById("div-2").classList.remove("selected");
      document.getElementById("div-3").classList.remove("selected");
      document.getElementById("div-4").classList.remove("selected");
      document.getElementById("div-5").classList.remove("selected");

      console.log("div-" + $value + " set selected");
      console.log(document.getElementById("div-" + $value));

      document.getElementById("div-" + $value).classList.add("selected");

      document.getElementById("continue-button").disabled = false;
    }

    $scope.acceptReadingScale = function($item, $index) {
      $item.finished = new Date();
      $item.timeTaken = $item.finished - $item.started;
      $item.finished = $item.finished.toString();
      $item.started = $item.started.toString();

      if ($scope.questions[$stateParams.section].items[$scope.currentItemIndex + 1]) {

        // check if we are finishing the practice section
        var finishingPractice = ($scope.questions[$stateParams.section].items[$scope.currentItemIndex].practice === true && ($scope.questions[$stateParams.section].items[$scope.currentItemIndex + 1].practice === false || $scope.questions[$stateParams.section].items[$scope.currentItemIndex + 1].practice === undefined));

        if (finishingPractice) {
          // Show Start test screen
          $state.go('assessment.begin', {slotId: $scope.currentSlot, section: $scope.currentSection});
        } else {
          //Show next question
          $state.go('assessmentQuestions', {
            slotId: $scope.currentSlot,
            section: $scope.currentSection,
            itemIndex: $scope.currentItemIndex + 1
          });
        }
      } else {
        // Section Completed
        $scope.questions[$stateParams.section].completed = true;
        Assessment.save($scope.questions).then(function () {
          $state.go('slotSummary', {slotId: $scope.currentSlot});
        })
      }
    }
  });

angular.module('rcaApp').filter('removeBracketedText', function () {
    return function (input) {
      return input.replace(/\([a-z ]+\)/gi, ' ');
    };
  });
