'use strict';

/**
 * @ngdoc function
 * @name rcaApp.controller:CardSortingCtrl
 * @description
 * # AboutCtrl
 * Controller of the rcaApp
 */
angular.module('rcaApp')
  .controller('CardSortingCtrl', function ($scope, $rootScope, Assessment) {
    $rootScope.navBarVis = false;

    $scope.debug = localStorage.getItem('rca-debug');

    Assessment.load('rca-assessment-1').then(function(questions){
        console.log(questions)
        Assessment.questions.shuffle();
        $scope.assessment = Assessment.questions.get('card-sorting');

        $scope.assessment.items.map(function(it){
            it.type = "item";
            it.image.src = "/images/sort-images/" + it.image.src
            return it;
        })

        $scope
    .$on('bag-one.over', function (e, el) {
      el.addClass('over');
    });
    $scope.$on('bag-one.out', function (e, el) {
      el.removeClass('over');
    });

        console.log($scope.assessment.items)

        $scope.models = {
            selected: null,
            templates: [
                {type: "item", id: 2, index: 0, src: $scope.assessment.items[0].image.src}
                // {type: "container", id: 1, columns: [[], []]}
            ],
            dropzones: [
                {
                    "list": [],
                    "name": "1 - Easy"
                },
                {
                    "list": [],
                    "name": "2"
                },
                {
                    "list": [],
                    "name": "3"
                },
                {
                    "list": [],
                    "name": "4 - Difficult"
                }
            ]
        };
    
        $scope.$watch('models.dropzones', function(model) {
            $scope.modelAsJson = angular.toJson(model, true);
        }, true);
    })

   



    

  });
