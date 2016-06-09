'use strict';

/**
 * @ngdoc function
 * @name rcaApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the rcaApp
 */
angular.module('rcaApp')
  .controller('MainCtrl', function ($scope, $rootScope, Assessment, $window, Storage, Report) {
    $rootScope.navBarVis = false;

    $rootScope.assessmentLoaded = false;

    Storage.load().then(function(assessments){
      $scope.assessments = assessments;
    });

    $rootScope.$on('storage-updated', function(){
      Storage.load().then(function(assessments){
        $scope.assessments = assessments;
      });
    });

    $rootScope.$on('assessment-loaded', function(){
      $scope.questions = Assessment.questions.get();
      console.log($scope.questions);
      $rootScope.assessmentLoaded = true;
    });

    $scope.goFullScreen = function() {
      var elem = document.getElementById('main-contain');
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      }
    };

    $scope.createIndex = function() {
      var section;

      for(section in $scope.questions) {
        if ($scope.questions[section].selected){
          console.log(section);
          console.log($scope.questions[section].assessmentType);
          console.log($scope.questions[section].items.$index);
        }
      }
    };

    $scope.startAssessment = function() {
      Assessment.start(true);
    };

    $scope.continueAssessment = function(){
      Assessment.continue();
    };

    $scope.selectAssessment = function(assessment, $index) {
      //Storage.currentSlot = $index;
      $scope.selectedAssessment = $index;
    };

    $scope.clearSlot = function() {
      console.log('current slot', Storage.currentSlot);
      $scope.assessments[Storage.currentSlot] = null;
      Storage.clearSlot();
    };

    $scope.createAssessment = function(key) {
      Storage.currentSlot = key;
      console.log('currentkey', key);
      Assessment.createAssessment().then(function(){
        Assessment.load();
      },function(response){
        console.log(response);
      });
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

    $scope.showDeleteConfirmDialog = function($event, $key) {

      //if ($event.type === 'touchend') {
      //  console.log('touched');
      $window.$('#confirmDelete').modal('show');
      //}

      console.log('current slot', $key);

      Storage.currentSlot = $key;

    };

    $scope.loadAssessment = function() {
      Storage.load('rca-assessment-' + Storage.currentSlot);
    };

    $scope.saveSetup = function(){
      //Storage.save($scope.questions, {name: Assessment.name, status: 'Not Started'});
      console.log($scope.questions);
      Assessment.save($scope.questions);
    };

    $scope.viewReport = function($index, assessment) {

        new Report(assessment);

        //console.log($index, assessment);
    };
  });

angular.module('rcaApp').filter('orderObjectBy', function() {
  return function(items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return (a === null ? 1 : (a[field] > b[field] ? 1 : -1));
    });
    if(reverse) {filtered.reverse();}
    return filtered;
  };
});

