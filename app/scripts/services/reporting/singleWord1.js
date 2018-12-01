'use strict';

/**
 * @ngdoc service
 * @name rcaApp.assessment
 * @description
 * # assessment
 * Service in the rcaApp.
 */
angular.module('rcaApp').service('SingleWord1', function ($window) {

    function singleWordSetup() {
      return {
        time: {
          startTime: null,
          endTime: null,
          duration: null
        },
        summaryColumns: [
          {title: 'Concrete', dataKey: 'concreteLabel'},
          {title: '', dataKey: 'concreteValue'},
          {title: 'Abstract', dataKey: 'abstractLabel'},
          {title: '', dataKey: 'abstractValue'},
          {title: 'Total', dataKey: 'total'}
        ],
        columns: [
          {title: '', dataKey: 'rowNumber'},
          {title: 'Item', dataKey: 'item'},
          {title: 'Time', dataKey: 'time'},
          {title: 'Target Word', dataKey: 'targetWord'},
          {title: 'Unrelated Distracter', dataKey: 'distractor1'},
          {title: 'Unrelated Distracter', dataKey: 'distractor2'},
          {title: 'Noun/Verb', dataKey: 'nounVerb'},
          {title: 'Concrete/Abstract', dataKey: 'concreteAbstract'}
        ],
        rows: [],
        summaryRows: [],
        colours: [],
        timeRank: [],
        correctAnswers: [],
        incorrectAnswers: [],
        total: {
          correct: {
            time: null,
            count: null
          },
          incorrect: {
            time: null,
            count: null
          }
        },
        nouns: {
          correct: {
            time: null,
            count: null
          },
          incorrect: {
            time: null,
            count: null
          }
        },
        verbs: {
          correct: {
            time: null,
            count: null
          },
          incorrect: {
            time: null,
            count: null
          }
        },
        abstractNouns: {
          correct: {
            time: null,
            count: null
          },
          incorrect: {
            time: null,
            count: null
          }
        },
        concreteNouns: {
          correct: {
            time: null,
            count: null
          },
          incorrect: {
            time: null,
            count: null
          }
        },
        abstractVerbs: {
          correct: {
            time: null,
            count: null
          },
          incorrect: {
            time: null,
            count: null
          }
        },
        concreteVerbs: {
          correct: {
            time: null,
            count: null
          },
          incorrect: {
            time: null,
            count: null
          }
        }
      };
    }

    this.calculate = function(data){

        var singleWord = singleWordSetup();

        singleWord.time.startTime = new Date(data[0].started);
        singleWord.time.endTime = new Date(data[data.length - 1].finished);
        singleWord.time.duration = singleWord.time.endTime - singleWord.time.startTime;
        singleWord.time.average = $window._.meanBy(data, 'timeTaken');

            //Data for colour coded response time table
            data.forEach(function (response, index) {

                var distractors = $window._.remove(response.answers, function (answer) {
                    return answer !== response.correctAnswer;
                });

                singleWord.rows.push({
                    rowNumber: index + 1,
                    item: response.question,
                    time: response.timeTaken / 1000,
                    targetWord: response.correctAnswer,
                    distractor1: distractors[0],
                    distractor2: distractors[1],
                    nounVerb: response.part,
                    concreteAbstract: response.type,
                    answer: response.answerGiven
                });

            });

            //Separate correct and incorrect answers
            singleWord.correctAnswers = $window._.filter(singleWord.rows, function (data) {
                return data.answer === data.targetWord;
            });

            singleWord.incorrectAnswers = $window._.filter(singleWord.rows, function (data) {
                return data.answer !== data.targetWord;
            });


            //Total Performance
            singleWord.total.correct.time = $window._(singleWord.correctAnswers).reduce(function (a, m, i, p) {
                return a + m.time / p.length;
            }, 0);

            singleWord.total.correct.count = singleWord.correctAnswers.length;

            singleWord.total.incorrect.time = $window._(singleWord.incorrectAnswers).reduce(function (a, m, i, p) {
                return a + m.time / p.length;
            }, 0);

            singleWord.total.incorrect.count = singleWord.incorrectAnswers.length;


            //Noun Performance
            singleWord.nouns.correct.time = $window._(singleWord.correctAnswers).filter({nounVerb: 'Noun'}).reduce(function (a, m, i, p) {
                return a + m.time / p.length;
            }, 0);

            singleWord.nouns.correct.count = $window._.filter(singleWord.correctAnswers, {nounVerb: 'Noun'}).length;

            singleWord.nouns.incorrect.time = $window._(singleWord.incorrectAnswers).filter({nounVerb: 'Noun'}).reduce(function (a, m, i, p) {
                return a + m.time / p.length;
            }, 0);

            singleWord.nouns.incorrect.count = $window._.filter(singleWord.incorrectAnswers, {nounVerb: 'Noun'}).length;


            //Verb Performance
            singleWord.verbs.correct.time = $window._(singleWord.correctAnswers).filter({nounVerb: 'Verb'}).reduce(function (a, m, i, p) {
                return a + m.time / p.length;
            }, 0);

            singleWord.verbs.correct.count = $window._.filter(singleWord.correctAnswers, {nounVerb: 'Verb'}).length;

            singleWord.verbs.incorrect.time = $window._(singleWord.incorrectAnswers).filter({nounVerb: 'Verb'}).reduce(function (a, m, i, p) {
                return a + m.time / p.length;
            }, 0);

            singleWord.verbs.incorrect.count = $window._.filter(singleWord.incorrectAnswers, {nounVerb: 'Verb'}).length;


            //Abstract Noun Performance
            singleWord.abstractNouns.correct.time = $window._(singleWord.correctAnswers).filter({nounVerb: 'Noun'}).filter({concreteAbstract: 'Abstract'}).reduce(function (a, m, i, p) {
                return a + m.time / p.length;
            }, 0);

            singleWord.abstractNouns.correct.count = $window._(singleWord.correctAnswers).filter({nounVerb: 'Noun'}).filter({concreteAbstract: 'Abstract'}).value().length;

            singleWord.abstractNouns.incorrect.time = $window._(singleWord.incorrectAnswers).filter({nounVerb: 'Noun'}).filter({concreteAbstract: 'Abstract'}).reduce(function (a, m, i, p) {
                return a + m.time / p.length;
            }, 0);

            singleWord.abstractNouns.incorrect.count = $window._(singleWord.incorrectAnswers).filter({nounVerb: 'Noun'}).filter({concreteAbstract: 'Abstract'}).value().length;


            //Concrete Noun Performance
            singleWord.concreteNouns.correct.time = $window._(singleWord.correctAnswers).filter({nounVerb: 'Noun'}).filter({concreteAbstract: 'Concrete'}).reduce(function (a, m, i, p) {
                return a + m.time / p.length;
            }, 0);

            singleWord.concreteNouns.correct.count = $window._(singleWord.correctAnswers).filter({nounVerb: 'Noun'}).filter({concreteAbstract: 'Concrete'}).value().length;

            singleWord.concreteNouns.incorrect.time = $window._(singleWord.incorrectAnswers).filter({nounVerb: 'Noun'}).filter({concreteAbstract: 'Concrete'}).reduce(function (a, m, i, p) {
                return a + m.time / p.length;
            }, 0);

            singleWord.concreteNouns.incorrect.count = $window._(singleWord.incorrectAnswers).filter({nounVerb: 'Noun'}).filter({concreteAbstract: 'Concrete'}).value().length;


            //Abstract Verb Performance
            singleWord.abstractVerbs.correct.time = $window._(singleWord.correctAnswers).filter({nounVerb: 'Verb'}).filter({concreteAbstract: 'Abstract'}).reduce(function (a, m, i, p) {
                return a + m.time / p.length;
            }, 0);

            singleWord.abstractVerbs.correct.count = $window._(singleWord.correctAnswers).filter({nounVerb: 'Verb'}).filter({concreteAbstract: 'Abstract'}).value().length;

            singleWord.abstractVerbs.incorrect.time = $window._(singleWord.incorrectAnswers).filter({nounVerb: 'Verb'}).filter({concreteAbstract: 'Abstract'}).reduce(function (a, m, i, p) {
                return a + m.time / p.length;
            }, 0);

            singleWord.abstractVerbs.incorrect.count = $window._(singleWord.incorrectAnswers).filter({nounVerb: 'Verb'}).filter({concreteAbstract: 'Abstract'}).value().length;


            //Concrete Verb Performance
            singleWord.concreteVerbs.correct.time = $window._(singleWord.correctAnswers).filter({nounVerb: 'Verb'}).filter({concreteAbstract: 'Concrete'}).reduce(function (a, m, i, p) {
                return a + m.time / p.length;
            }, 0);

            singleWord.concreteVerbs.correct.count = $window._(singleWord.correctAnswers).filter({nounVerb: 'Verb'}).filter({concreteAbstract: 'Concrete'}).value().length;

            singleWord.concreteVerbs.incorrect.time = $window._(singleWord.incorrectAnswers).filter({nounVerb: 'Verb'}).filter({concreteAbstract: 'Concrete'}).reduce(function (a, m, i, p) {
                return a + m.time / p.length;
            }, 0);

            singleWord.concreteVerbs.incorrect.count = $window._(singleWord.incorrectAnswers).filter({nounVerb: 'Verb'}).filter({concreteAbstract: 'Concrete'}).value().length;


            singleWord.summaryRows.push({
                concreteLabel: 'Nouns',
                concreteValue: singleWord.concreteNouns.correct.count + ' / 5',
                abstractLabel: 'Nouns',
                abstractValue: singleWord.abstractNouns.correct.count + ' / 5',
                total: singleWord.nouns.correct.count + ' / 10'
            });

            singleWord.summaryRows.push({
                concreteLabel: 'Verbs',
                concreteValue: singleWord.concreteVerbs.correct.count + ' / 5',
                abstractLabel: 'Verbs',
                abstractValue: singleWord.abstractVerbs.correct.count + ' / 5',
                total: singleWord.verbs.correct.count + ' / 10'
            });

            singleWord.summaryRows.push({
                concreteLabel: 'Concrete Total',
                concreteValue: singleWord.concreteNouns.correct.count + singleWord.concreteVerbs.correct.count + ' / 10',
                abstractLabel: 'Abstract Total',
                abstractValue: singleWord.abstractNouns.correct.count + singleWord.abstractVerbs.correct.count + ' / 10',
                total: singleWord.total.correct.count + ' / 20'
            });


            //Setting up color scale for use in ranking repsonse times

            singleWord.timeRank = $window._.sortBy($window._.map($window._.remove($window._.cloneDeep(singleWord.rows), function(row){
                return row.time !== '';
            }, 'time'), 'time'));

            singleWord.colours = $window.chroma.scale(['66bd7d', 'b6d382', 'ffe188', 'fa9c78', 'f7686c']).colors(singleWord.timeRank.length);

            return singleWord;
        };
});
