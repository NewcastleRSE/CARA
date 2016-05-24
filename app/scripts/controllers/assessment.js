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

        // check we have another question
        if ($scope.questions[$stateParams.section].items[$scope.currentItemIndex + 1]) {

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

        //if ($scope.pages.eq($scope.currentPage+1).length > 0) {
        //  $scope.setWaiting(true);
        //  $scope.currentPage++;
        //} else {
        //  // Show finshed page
        //  $scope.started = false;
        //  Assessment.status = 'Complete';
        //  Assessment.save($scope.questions);
        //  $scope.complete = true;
        //  $scope.results = {};
        //  angular.copy($scope.questions, $scope.results);
        //}

      };

      $scope.getNextQuestion = function() {

      }

    }

    //angular.element('.vcenter').height($window.$( window ).height() - $window.$('.navbar-fixed-bottom').height());
    //angular.element('.vcenter').width($window.$('.container').width());


    //$scope.createIndex = function() {
    //  var section;
    //
    //  for(section in $scope.questions) {
    //    if ($scope.questions[section].selected){
    //      console.log(section);
    //    }
    //  }
    //};

    $scope.setCurrentPageIndex = function (index) {
      $scope.currentIndex = index;
    };

    $scope.isCurrentPageIndex = function (index) {
      console.log(index);
      return $scope.currentIndex === index;
    };

    $scope.setWaiting = function(value) {

      if (value === true && $scope.pages.eq([$scope.currentPage+1]).scope()) {

        var nextSectionType = $scope.pages.eq([$scope.currentPage+1]).scope().$parent.$parent.q.assessmentType;

        $scope.nextSectionNew = nextSectionType !== $scope.sectionType;

        $scope.sectionType = nextSectionType;

        if ($scope.pages.eq([$scope.currentPage+1]).scope().question) {
          $scope.sectionType = $scope.sectionType + '-2';
        }
      }

      $scope.waiting = value;
    };

/*    $scope.showNext = function(){
      $scope.waiting = false;
    };*/




    //$scope.waiting = Assessment.isWaiting;





    //$scope.setAnswer = function($item, $answer, $index) {
    //
    //  $item.finished = new Date();
    //  $item.timeTaken = $item.finished - $item.started;
    //  $item.finished = $item.finished.toString();
    //  $item.started = $item.started.toString();
    //
    //  $item.answerGiven = $answer;
    //  $item.answerPosition = $index;
    //
    //  if ($scope.pages.eq($scope.currentPage+1).length > 0) {
    //    $scope.setWaiting(true);
    //    $scope.currentPage++;
    //  } else {
    //    // Show finshed page
    //    $scope.started = false;
    //    Assessment.status = 'Complete';
    //    Assessment.save($scope.questions);
    //    $scope.complete = true;
    //    $scope.pages.hide();
    //    $scope.results = {};
    //    angular.copy($scope.questions, $scope.results);
    //  }
    //  //item.answerGiven = answer;item.finish = newTimestamp(); setWaiting(true);
    //
    //
    //  //console.log($scope.pages.eq([$scope.currentPage]).scope().$parent.$parent.$parent.$parent.q);
    //  //console.log($scope.pages.eq([$scope.currentPage]).prev().scope().$parent.$parent.$parent.$parent.q);
    //};

    $scope.acceptParagraph = function($item){
      $item.finished = new Date();
      $item.timeTaken = $item.finished - $item.started;
      $item.finished = $item.finished.toString();
      $item.started = $item.started.toString();

      $scope.currentPage++;
      $scope.setWaiting(true);
      //setWaiting(true);item.finish = newTimestamp(); currentPage++
    };

/*    $scope.showNextPage = function() {
      console.log($scope.questions);
      $scope.currentPage = 1;
      $scope.setWaiting(false);
    };*/


    $scope.showNextPage = function() {

      if (! $scope.pages) {
        $scope.pages = angular.element('[id^="page-"]');
      }

      $scope.pages.hide();

      $window.$('.vcenter').css('color', '#fff');

      if ($scope.pages.eq([$scope.currentPage]).length > 0) {

        if ($scope.pages.eq([$scope.currentPage]).data('selected') !== false) {

          if ($scope.pages.eq([$scope.currentPage]).scope().question) {
            $scope.pages.eq([$scope.currentPage]).scope().question.started = new Date();
          } else {
            $scope.pages.eq([$scope.currentPage]).scope().item.started = new Date();
          }

          $scope.pages.eq([$scope.currentPage]).show();
          $scope.setWaiting(false);
        } else {
          $scope.setWaiting(true);
          $scope.currentPage++;
          $scope.showNextPage();
        }
      } else {
        // Show finshed page
        $scope.started = false;
        $scope.complete = true;
        Assessment.status = 'Complete';
        Assessment.save($scope.questions);
        $scope.setWaiting(false);
        $scope.results = {};
        angular.copy($scope.questions, $scope.results);
      }

      $timeout(function () {
        //DOM has finished rendering
        $timeout(function(){
          angular.element('.vcenter').height($window.$( window ).height() - $window.$('.navbar-fixed-bottom').height());
          angular.element('.vcenter').width($window.$('.container').width());
        });

        $timeout(function(){
          $window.$('.vcenter').css('color', '#000');
        });
      });

    };

    $scope.savedProgressText = 'Save Progress';
    $scope.saveProgress = function() {

      Assessment.status = 'In Progress';
      Assessment.save($scope.questions).then(function(){
        $scope.savedProgressText = 'Saved';

        $timeout(function(){
          $scope.savedProgressText = 'Save Progress';
        }, 1000)
      });
    };

  });
