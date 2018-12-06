'use strict';

/**
 * @ngdoc function
 * @name rcaApp.controller:CardSortingCtrl
 * @description
 * # AboutCtrl
 * Controller of the rcaApp
 */
angular.module('rcaApp')
  .controller('CardSortingCtrl', function ($scope, $rootScope, Assessment, $stateParams, $state) {
    $rootScope.navBarVis = false;

    $scope.debug = localStorage.getItem('rca-debug');
    $scope.currentSlot = $stateParams.slotId;

    Assessment.load($stateParams.slotId).then(function(){
      Assessment.questions.shuffle();
      $scope.assessment = Assessment.questions.get('card-sorting');

      $scope.assessment.started = new Date();

      $scope.assessment.items.map(function(it){
        // it.type = "item";
        it.image.src = "./images/sort-images/" + it.image.src;
        return it;
      });

      $scope.saveAssessment = function(){

        $scope.assessment.items = [];

        $scope.models.dropzones.forEach(function(dz, index){
          dz.list = dz.list.map(function(listItem){
            listItem.difficulty = index + 1;
            return listItem;
          });
          $scope.assessment.items = $scope.assessment.items.concat(dz.list);
        });

        $scope.assessment.completed = true;
        $scope.assessment.finished = new Date();
        $scope.assessment.duration = $scope.assessment.finished -  $scope.assessment.started;

        Assessment.questions.set($scope.assessment, 'card-sorting');
        Assessment.save(Assessment.questions.get()).then(function () {
          $state.go('slotSummary', {slotId: $scope.currentSlot});
        });
      };

      $scope.$on('bag-one.over', function (e, el) {
        el.addClass('over');
      });

      $scope.$on('bag-one.out', function (e, el) {
        el.removeClass('over');
      });

      $scope.models = {
        selected: null,
        templates: [
          {type: "item", id: 2, index: 0, src: $scope.assessment.items[0].image.src}
          // {type: "container", id: 1, columns: [[], []]}
        ],
        dropzones: [
          {
            "list": [],
            "name": "Not applicable",
            "difficulty": 0
          },
          {
            "list": [],
            "name": "Impossible or avoid",
            "difficulty": 4
          },
          {
            "list": [],
            "name": "Trying to read but difficult",
            "difficulty": 3
          },
          {
            "list": [],
            "name": "Trying to read and ok",
            "difficulty": 2
          },
          {
            "list": [],
            "name": "No problem",
            "difficulty": 1
          }
        ]
      };

    });
  });
