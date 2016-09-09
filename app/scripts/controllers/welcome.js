'use strict';

/**
 * @ngdoc function
 * @name rcaApp.controller:WelcomeCtrl
 * @description
 * # WelcomeCtrl
 * Controller of the rcaApp
 */
angular.module('rcaApp')
  .controller('WelcomeCtrl', function ($scope, $rootScope, $window) {

    $scope.acceptCheckBox = false;

    $scope.getStartedSref = $window.localStorage.getItem('caraHasReadInstructions') ? 'home' : 'instructions';

    $scope.hasReadInstructions = function(){
      return $window.localStorage.getItem('caraHasReadInstructions');
    };

    $scope.$watch('acceptCheckBox', function(newVal){
      if (newVal === true) {
        $window.localStorage.setItem('caraHasReadInstructions', 'true');
      } else {
        $window.localStorage.removeItem('caraHasReadInstructions');
      }
    })

  });
