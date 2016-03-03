'use strict';

/**
 * @ngdoc service
 * @name rcaApp.assessment
 * @description
 * # assessment
 * Service in the rcaApp.
 */
angular.module('rcaApp')
  .service('Assessment', function ($http, $state, $rootScope, Storage, $q) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var Assessment = {};

    Assessment.started = false;

    Assessment.isWaiting = true;

    Assessment.questionType = null;

    Assessment.sections = ['singleWord-part-1', 'singleWord-part-2', 'sentence-part-1', 'sentence-part-2', 'paragraph'];

    Assessment.questions = {

      questions : [],

      setup : function() {

        var x;

        for(x in Assessment.questions.questions) {
          Assessment.questions.questions[x].selected = true;
        }
        Assessment.questions.generateImagePaths();

        Assessment.answers.shuffle();

      },

      get : function(key) {
        if (key) {
          return Assessment.questions.questions[key];
        } else {
          return Assessment.questions.questions;
        }

      },

      set : function(newQuestions) {
        Assessment.questions.questions = newQuestions;

        return Assessment.questions;
      },

      reset : function(){
        return Assessment.questions;
      },

      setIndex : function() {
        console.log('All', Assessment.questions.get());

        var section;

        for(section in Assessment.questions.get()){
          console.log(Assessment.questions.get(section));
        }
      },

/*      filter : function(propertyArray) {

      },*/

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

        angular.forEach(Assessment.questions.get('sentence-part-1').items, function (item, key) {
          angular.forEach(item.answers, function(answer, i){
            Assessment.questions.get('sentence-part-1').items[key].answers[i] = {'text' : answer, 'image' : item.pictures[i]};
          });
        });
        angular.forEach(Assessment.questions.get('sentence-part-2').items, function (item, key) {
          angular.forEach(item.answers, function(answer, i){
            Assessment.questions.get('sentence-part-2').items[key].answers[i] = {'text' : answer, 'image' : item.pictures[i]};
          });
        });



/*        var charMap = ['a', 'b', 'c', 'd'];
        angular.forEach(Assessment.questions.get('sentence-part-1').items, function (item, key) {
          angular.forEach(item.answers, function(answer, i){
            Assessment.questions.get('sentence-part-1').items[key].answers[i] = {'text' : answer, 'image' : item.pictures + charMap[i] + ' ' + answer.replace(/\ \(.*\)/gi, '') + '.jpg'};
          });
        });
        angular.forEach(Assessment.questions.get('sentence-part-2').items, function (item, key) {
          angular.forEach(item.answers, function(answer, i){
            Assessment.questions.get('sentence-part-2').items[key].answers[i] = {'text' : answer, 'image' : item.pictures + charMap[i] + ' ' + answer.replace(/\ \(.*\)/gi, '') + '.jpg'};
          });
        });*/
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

    Assessment.createAssessment = function() {
      return $q(function(resolve, reject){
        $http({
          method: 'GET',
          url: 'data/exercise-data.json'
        }).then(function successCallback(response) {

          Assessment.questions.set(response.data).setup();
          Storage.save(response.data, {status: 'Not Started', name : Assessment.makeID()}).then(function(){
            resolve();
          });




        }, function errorCallback(response) {
          reject(response);
        });
      });
    };

    Assessment.load = function() {

      var assessment = Storage.load('rca-assessment-' + Storage.currentSlot);

      Assessment.name = assessment.name;
      Assessment.modified = assessment.modified;
      Assessment.status = assessment.status;
      Assessment.questions.set(assessment.questions);

      $rootScope.$emit('assessment-loaded');
    };

    Assessment.start = function() {
      console.log('Starting');
      $state.go('assessment');
      Assessment.questions.current.reset();
      Assessment.isWaiting = true;
      Assessment.started = true;

    };

    Assessment.continue = function() {
      var report = Storage.load('rca-assessment-' + Storage.currentSlot);

      Assessment.load(report);
      Assessment.start();
    };

    Assessment.makeID = function() {
        var text = [];
        var possible = 'ABCDEFGHIJKLMNPQRTUVWXYZ';
        var idLength = 6;
        var numberPosition = Math.floor(Math.random() * idLength);

        for( var i=0; i < idLength; i++ ){
          if (i === numberPosition) {
            text.push(Storage.currentSlot);
          } else {
            text.push( possible.charAt(Math.floor(Math.random() * possible.length)) );
          }
        }



        return text.join('');
    };

    Assessment.save = function(questions){
      return Storage.save(questions, {name: Assessment.name, status: Assessment.status});
    };

    return Assessment;
  });
