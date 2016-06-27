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

    $scope.isFullScreen = window.innerHeight == screen.height;

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
