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
    'angularMoment',
    'btford.markdown',
    // 'ngRaven',
    angularDragula(angular)
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
    .state('welcome', {
      url: '/',
      templateUrl: 'views/welcome.html',
      controller: 'WelcomeCtrl'
    })
    .state('home', {
      url: '/home',
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    })
    .state('instructions', {
      url: '/instructions',
      templateUrl: 'views/instructions.html',
      controller: 'WelcomeCtrl'
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
    .state('cardSorting', {
      url: '/:slotId/card-sorting/0',
      templateUrl: 'views/card-sorting.html',
      controller: 'CardSortingCtrl'
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
}).run(function($rootScope, $transitions){
  $transitions.onSuccess({}, function(transition) {
    $rootScope.containerClass = transition.to().name;
  });

  $rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams){
    $rootScope.containerClass = toState.name;
    console.log(toState.name);
  });
});
