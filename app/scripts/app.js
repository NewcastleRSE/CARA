'use strict';

/**
 * @ngdoc overview
 * @name rcaApp
 * @description
 * # rcaApp
 *
 * Main module of the application.
 */
angular
  .module('rcaApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ui.router',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ]).config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise('/');
  //
  // Now set up the states
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    })
    .state('about', {
      url: '/about',
      templateUrl: 'views/about.html',
      controller: 'AboutCtrl'
    })
    .state('assessment', {
      url: '/assessment',
      templateUrl: 'views/assessment.html',
      controller: 'AssessmentCtrl'
    })
    .state('state2.list', {
      url: '/list',
      templateUrl: 'partials/state2.list.html',
      controller: function($scope) {
        $scope.things = ['A', 'Set', 'Of', 'Things'];
      }
    });
});

  /*.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/setup', {
        templateUrl: 'views/setup.html',
        controller: 'SetupCtrl',
        controllerAs: 'setup'
      })
      .otherwise({
        redirectTo: '/'
      });
  });*/
