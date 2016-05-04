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
    Assessment.load($stateParams.slotId);

    $scope.questions = Assessment.questions.get();


    $scope.currentSection = $stateParams.section;
    $scope.currentSlot = $stateParams.slotId;
  });
