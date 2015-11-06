'use strict';

/**
 * @ngdoc service
 * @name rcaApp.assessment
 * @description
 * # assessment
 * Service in the rcaApp.
 */
angular.module('rcaApp')
  .service('Assessment', function ($http, $state) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var Assessment = {};

    Assessment.started = false;

    Assessment.isWaiting = true;

    Assessment.questionType = null;

    Assessment.sections = ['singleWord-part-1', 'singleWord-part-2', 'sentence-part-1', 'sentence-part-2', 'paragraph'];

    Assessment.questions = {

      questions : [],

      get : function(key) {
        if (key) {
          return Assessment.questions.questions[key];
        } else {
          return Assessment.questions.questions;
        }

      },

      set : function(newQuestions) {
        Assessment.questions.questions = newQuestions;
        return Assessment.questions.questions;
      },

      current : {
        current: {
          section: null,
          question: null
        },
        set : function(newCurrent){
          Assessment.questions.current.current = newCurrent;
          if (newCurrent.section !== null){
            Assessment.questionType = Assessment.questions.questions[Assessment.questions.current.get().section].assessmentType;
          }
          return Assessment.questions.current.current;
        },
        get : function(returnData){
          returnData = returnData || false;

          if (returnData) {
            return Assessment.questions.questions[Assessment.questions.current.get().section].items[Assessment.questions.current.get().question];
          } else {
            return Assessment.questions.current.current;
          }

        },
        reset : function() {
          Assessment.questions.current.set({
            section: null,
            question: null
          });
        }
      },

      getNext : function() {
        if (Assessment.questions.current.get().section === null) {
          // Set to first section and question
          Assessment.questions.current.set({section: Assessment.sections[0], question: 0});
        } else {
          // Increment question
          var qNo = Assessment.questions.current.get().question + 1,
              sNo = Assessment.sections.indexOf(Assessment.questions.current.get().section),
              currentQuestion = Assessment.questions.current.get();

          if (Assessment.questions.questions[currentQuestion.section].items[qNo]) {
            Assessment.questions.current.set({section: Assessment.sections[sNo], question: qNo});
          } else {
            Assessment.questions.current.set({section: Assessment.sections[sNo + 1], question: 0});
          }



        }

        return Assessment.questions.current.get(true);
      },

      hasNext : function() {
        var hasNext = false;

        if (Assessment.questions.current.get().section === null) {
          hasNext = true;
        } else {
          // Increment question
          var qNo = Assessment.questions.current.get().question + 1,
            sNo = Assessment.sections.indexOf(Assessment.questions.current.get().section),
            currentQuestion = Assessment.questions.current.get();

          if (Assessment.questions.questions[currentQuestion.section].items[qNo]) {
            hasNext = true;
          } else {
            if (Assessment.questions.questions[Assessment.sections[sNo+1]] && Assessment.questions.questions[Assessment.sections[sNo+1]].items[0]) {
              hasNext = true;
            }
          }
        }

        return hasNext;

      },

      shuffle : function() {
        angular.forEach(Assessment.questions.get(), function(value, key){
          //console.log(key, value);
          Assessment.questions.get(key).items = (function(value){
            for(var j, x, i = value.length; i; j = Math.floor(Math.random() * i), x = value[--i], value[i] = value[j], value[j] = x){}
            return value;
          })(value.items);
        });
      },

      generateImagePaths : function() {

        var charMap = ['a', 'b', 'c', 'd'];



        angular.forEach(Assessment.questions.get('sentence-part-1').items, function (item, key) {
          angular.forEach(item.answers, function(answer, i){
            Assessment.questions.get('sentence-part-1').items[key].answers[i] = {'text' : answer, 'image' : item.pictures + charMap[i] + ' ' + answer + '.jpg'};
          });
        });
        angular.forEach(Assessment.questions.get('sentence-part-2').items, function (item, key) {
          angular.forEach(item.answers, function(answer, i){
            Assessment.questions.get('sentence-part-2').items[key].answers[i] = {'text' : answer, 'image' : item.pictures + charMap[i] + ' ' + answer + '.jpg'};
          });
        });
      }
    };

    Assessment.answers = {
      shuffle : function() {
        angular.forEach(Assessment.questions.get(), function(value, key){
          if (value.assessmentType === 'single' || value.assessmentType === 'sentence') {
            angular.forEach(Assessment.questions.get(key).items, function(value, itemkey) {
              Assessment.questions.get(key).items[itemkey].answers = (function(value){
                for(var j, x, i = value.length; i; j = Math.floor(Math.random() * i), x = value[--i], value[i] = value[j], value[j] = x){}
                return value;
              })(value.answers);
            });
          }
          if (value.assessmentType === 'paragraph') {
            angular.forEach(Assessment.questions.get(key).items, function(value, itemkey) {
              angular.forEach(value.questions, function(question, k){
                Assessment.questions.get(key).items[itemkey].questions[k].answers = (function(value){
                  for(var j, x, i = value.length; i; j = Math.floor(Math.random() * i), x = value[--i], value[i] = value[j], value[j] = x){}
                  return value;
                })(question.answers);
              });
            });
          }
        });
      }
    };

    Assessment.start = function() {
      console.log('Starting');

      $http({
        method: 'GET',
        url: '/data/concept-data.json'
      }).then(function successCallback(response) {

        Assessment.questions.set(response.data);
        Assessment.questions.generateImagePaths();
        Assessment.answers.shuffle();
        Assessment.questions.current.reset();
        Assessment.isWaiting = true;
        Assessment.started = true;
        $state.go('assessment');


      }, function errorCallback(response) {
        console.log(response);
      });
    };

    return Assessment;
  });
