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

    angular.element('.vcenter').height($window.$( window ).height() - 50);
    angular.element('.vcenter').width($window.$('.container').width() - 50);

    $rootScope.assessmentLoaded = false;

    $scope.assessments = Storage.load();

    $rootScope.$on('storage-updated', function(){
      $scope.assessments = Storage.load();
    });

    $rootScope.$on('assessment-loaded', function(){
      $scope.questions = Assessment.questions.get();
      console.log($scope.questions);
      $rootScope.assessmentLoaded = true;
    });

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
      Storage.currentSlot = $index;
      $scope.selectedAssessment = $index;
    };

    $scope.clearSlot = function() {
      $scope.assessments['rca-assessment-' + Storage.currentSlot] = null;
      Storage.clearSlot();
    };

    $scope.createAssessment = function() {
      Assessment.createAssessment().then(function(){
        Assessment.load();
      },function(response){
        console.log(response);
      });
    };

    $scope.customiseAssessment = function($event) {

      console.log($event);

      if ($event.type === 'touchend') {
        console.log('touched');
      $("#customiseAssessment").modal("show");
      }

      Assessment.load();
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

        Report(assessment);

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
    if(reverse) filtered.reverse();
    return filtered;
  };
});

