'use strict';

/**
 * @ngdoc function
 * @name rcaApp.controller:AppCtrl
 * @description
 * # AppCtrl
 * Controller of the rcaApp
 */
angular.module('rcaApp')
  .controller('AppCtrl', function ($scope,$window, $state, $timeout) {
    console.log($state.current);
    $scope.doc = $window.document;

    console.log($state);

    $scope.currentStateName = $state.current.name.replace(/\./g,'-');

    $scope.$on('$stateChangeSuccess', function(event, toState){
      console.log('State changed');
      console.log(toState.name);

      $scope.currentStateName = $state.current.name.replace(/\./g,'-');

      console.log('state: ', $scope.currentStateName);
    });

    //$scope.isFullScreen = window.innerHeight == screen.height;
    $scope.isFullScreen = document.getElementById('main-contain').innerHeight == screen.height;

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

    $scope.confirmAssessmentExit = function() {
      console.log($state.current.name);

      $scope.progressLost = $state.current.name === 'assessmentQuestions';

      $window.$('#confirmExit').modal('show');
    };

    $window.$(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange', function(event){

      $timeout(function(){
        if (document.fullscreenElement || document.webkitFullscreenElement ) {
          $scope.isFullScreen = true;
        } else {
          $scope.isFullScreen = false;
        }
      }, 0);

    });
  });
