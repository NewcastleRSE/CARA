'use strict';

/**
 * @ngdoc function
 * @name rcaApp.controller:AssessmentCtrl
 * @description
 * # AssessmentCtrl
 * Controller of the rcaApp
 */
angular.module('rcaApp')
  .controller('AssessmentCtrl', function ($scope, $rootScope, Assessment, $state) {

    $rootScope.navBarVis = false;

    if (Assessment.started !== true) {
      $state.go('home');
    }

    $scope.setWaiting = function(value) {

      if (value === true && $scope.pages.eq([$scope.currentPage+1]).scope()) {

        $scope.sectionType = $scope.pages.eq([$scope.currentPage+1]).scope().$parent.$parent.q.assessmentType;

        if ($scope.pages.eq([$scope.currentPage+1]).scope().question) {
          $scope.sectionType = $scope.sectionType + '-2';
        }
      }

      $scope.waiting = value;
    };

    $scope.showNext = function(){
      $scope.waiting = false;
    };

    $scope.questions = Assessment.questions.get();

    $scope.waiting = Assessment.isWaiting;

    $scope.sectionType = 'single';
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

      if ($scope.pages.eq($scope.currentPage+1).length > 0) {
        $scope.setWaiting(true);
        $scope.currentPage++;
      } else {
        // Show finshed page
        $scope.started = false;
        $scope.complete = true;
        $scope.pages.hide();
        console.log($scope.questions);
        console.log(JSON.stringify($scope.questions));
        $scope.results = {};
        angular.copy($scope.questions, $scope.results);
      }
      //item.answerGiven = answer;item.finish = newTimestamp(); setWaiting(true);
    };

    $scope.acceptParagraph = function($item){
      $item.finished = new Date();
      $item.timeTaken = $item.finished - $item.started;
      $item.finished = $item.finished.toString();
      $item.started = $item.started.toString();

      $scope.currentPage++;
      $scope.setWaiting(true);
      //setWaiting(true);item.finish = newTimestamp(); currentPage++
    };

    $scope.showNextPage = function() {
      if (! $scope.pages) {
        $scope.pages = angular.element('[id^="page-"]');
      }

      $scope.pages.hide();

      if ($scope.pages.eq([$scope.currentPage]).length > 0) {

        if ($scope.pages.eq([$scope.currentPage]).scope().question) {
          $scope.pages.eq([$scope.currentPage]).scope().question.started = new Date();
        } else {
          $scope.pages.eq([$scope.currentPage]).scope().item.started = new Date();
        }
        $scope.pages.eq([$scope.currentPage]).show();
      } else {
        // Show finshed page
        $scope.started = false;
        $scope.complete = true;
        $scope.results = {};
        angular.copy($scope.questions, $scope.results);
      }

      $scope.setWaiting(false);


    };

  });
