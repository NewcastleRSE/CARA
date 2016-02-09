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

    $scope.questionSets = {};

    $rootScope.$on('assessment-loaded', function(){
      $scope.questions = Assessment.questions.get();
    });


    $scope.saveAssessmentChanges = function() {
      Assessment.questions.set($scope.questions);
    };

    $scope.startAssessment = function() {
      Assessment.start();
    };
  });
