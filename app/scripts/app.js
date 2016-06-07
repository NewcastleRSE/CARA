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
    'ngTouch',
    'frapontillo.bootstrap-switch',
    'angularMoment'
  ]).config( [
  '$compileProvider',
  function( $compileProvider )
  {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|chrome-extension-resource):/);
    // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
  }
]).config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /
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
    .state('slotSummary', {
      url: '/:slotId',
      templateUrl: 'views/slot-summary.html',
      controller: 'SlotSummaryCtrl'
    })
    .state('assessment', {
      url: '/:slotId/:section',
      templateUrl: 'views/assessment-intro.html',
      controller: 'SectionIntroCtrl'
    })
    .state('assessment.practice', {
      url: '/practice',
      templateUrl: 'views/assessment-practice-intro.html',
      controller: function($scope) {}
    })
    .state('assessment.begin', {
      url: '/begin',
      templateUrl: 'views/assessment-begin-test.html',
      controller: function($scope) {}
    })
    .state('assessmentQuestions', {
      url: '/:slotId/:section/{itemIndex:int}',
      templateUrl: 'views/assessment.html',
      controller: 'AssessmentCtrl'
    })
    .state('assessmentQuestions.paragraph', {
      url: '/{paragraphQIndex:int}',
      templateUrl: 'views/assessment-para-questions.html',
      controller: 'AssessmentCtrl'
    })
    .state('report', {
      url: '/report',
      templateUrl: 'views/report.html',
      controller: 'ReportCtrl'
    })
    .state('state2.list', {
      url: '/list',
      templateUrl: 'partials/state2.list.html',
      controller: function($scope) {
        $scope.things = ['A', 'Set', 'Of', 'Things'];
      }
    });
}).run(function($rootScope){

  $rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams){
    $rootScope.containerClass = toState.name;
    //console.log(toState.name);
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
