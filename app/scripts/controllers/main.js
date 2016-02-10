'use strict';

/**
 * @ngdoc function
 * @name rcaApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the rcaApp
 */
angular.module('rcaApp')
  .controller('MainCtrl', function ($scope, $rootScope, Assessment, $window) {
    $rootScope.navBarVis = true;

    angular.element('.vcenter').height($window.$( window ).height() - 50);
    angular.element('.vcenter').width($window.$('.container').width() - 50);

    Assessment.load();

    $rootScope.$on('assessment-loaded', function(){
      $scope.questions = Assessment.questions.get();
      console.log($scope.questions);
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


    $scope.saveAssessmentChanges = function() {
      //Assessment.questions.set($scope.questions);
      Assessment.questions.setIndex();
    };

    $scope.startAssessment = function() {
      Assessment.start();
    };
  });
