'use strict';

/**
 * @ngdoc service
 * @name rcaApp.assessment
 * @description
 * # assessment
 * Service in the rcaApp.
 */
angular.module('rcaApp').service('Sentence1', function ($window) {

    function sentenceSetup() {
      return {
        summaryColumns: [
          {title: '', dataKey: 'type'},
          {title: 'Non-Reversible', dataKey: 'nonReversible'},
          {title: 'Reversible', dataKey: 'reversible'},
          {title: 'Total', dataKey: 'total'}
        ],
        columns: [
          {title: '', dataKey: 'rowNumber'},
          {title: 'Item', dataKey: 'item'},
          {title: 'Time', dataKey: 'time'},
          {title: 'Target Picture', dataKey: 'targetPicture'},
          {title: 'Distracter 1', dataKey: 'distractor1'},
          {title: 'Distracter 2', dataKey: 'distractor2'},
          {title: 'Distracter 3', dataKey: 'distractor3'}
        ],
        keyColumns: [
          {title: '', dataKey: 'rowNumber'},
          {title: 'Item', dataKey: 'item'},
          {title: 'Target Picture', dataKey: 'targetPicture'}
        ],
        summaryRows: [],
        rows: [],
        keyRows: [],
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
          },
          questionCount: null
        },
        phrases: {
          correct: {
            time: null,
            count: null
          },
          incorrect: {
            time: null,
            count: null
          },
          questionCount: null
        },
        simple: {
          correct: {
            time: null,
            count: null
          },
          incorrect: {
            time: null,
            count: null
          },
          questionCount: null
        },
        complex: {
          correct: {
            time: null,
            count: null
          },
          incorrect: {
            time: null,
            count: null
          },
          questionCount: null
        },
        nonReversiblePhrases: {
          correct: {
            time: null,
            count: null
          },
          incorrect: {
            time: null,
            count: null
          },
          questionCount: null
        },
        nonReversibleSimple: {
          correct: {
            time: null,
            count: null
          },
          incorrect: {
            time: null,
            count: null
          },
          questionCount: null
        },
        nonReversibleTotal: {
          correct: {
            time: null,
            count: null
          },
          incorrect: {
            time: null,
            count: null
          },
          questionCount: null
        },
        reversibleSimple: {
          correct: {
            time: null,
            count: null
          },
          incorrect: {
            time: null,
            count: null
          },
          questionCount: null
        },
        reversibleComplex: {
          correct: {
            time: null,
            count: null
          },
          incorrect: {
            time: null,
            count: null
          },
          questionCount: null
        },
        reversibleTotal: {
          correct: {
            time: null,
            count: null
          },
          incorrect: {
            time: null,
            count: null
          },
          questionCount: null
        }
      };
    }

        this.calculate = function(data) {

            var sentence = sentenceSetup();

            console.log(data[0]);

            //Data for colour coded response time table
            data.forEach(function (response, index) {

                sentence.rows.push({
                    rowNumber: index + 1,
                    item: response.pictures[0].split(' ')[0].toUpperCase() + ' ' + response.pictures[0].split(' ')[1].substring(0, response.pictures[0].split(' ')[1].length - 1),
                    targetPicture: 'A',
                    distractor1: 'B',
                    distractor2: 'C',
                    distractor3: 'D',
                    time: response.timeTaken / 1000,
                    answer: response.answers[response.answerPosition].image.split(' ')[1].substring(response.answers[response.answerPosition].image.split(' ')[1].length - 1).toUpperCase(),
                    type: response.type,
                    reversibility: response.reversibility
                });

                sentence.keyRows.push({
                  rowNumber: index + 1,
                  item: response.pictures[0].split(' ')[0].toUpperCase() + ' ' + response.pictures[0].split(' ')[1].substring(0, response.pictures[0].split(' ')[1].length - 1),
                  targetPicture: response.question
                });

            });

            //Separate correct and incorrect answers
            sentence.correctAnswers = $window._.filter(sentence.rows, function (data) {
                return data.answer === data.targetPicture;
            });

            sentence.incorrectAnswers = $window._.filter(sentence.rows, function (data) {
                return data.answer !== data.targetPicture;
            });


            //Total Performance
            sentence.total.correct.time = $window._(sentence.correctAnswers).reduce(function (a, m, i, p) {
                return a + m.time / p.length;
            }, 0);

            sentence.total.correct.count = sentence.correctAnswers.length;

            sentence.total.incorrect.time = $window._(sentence.incorrectAnswers).reduce(function (a, m, i, p) {
                return a + m.time / p.length;
            }, 0);

            sentence.total.incorrect.count = sentence.incorrectAnswers.length;

            sentence.total.questionCount = sentence.total.correct.count + sentence.total.incorrect.count;

            //Phrases Performance
            sentence.phrases.correct.time = $window._(sentence.correctAnswers).filter({type: 'phrase'}).reduce(function (a, m, i, p) {
                return a + m.time / p.length;
            }, 0);

            sentence.phrases.correct.count = $window._.filter(sentence.correctAnswers, {type: 'phrase'}).length;

            sentence.phrases.incorrect.time = $window._(sentence.incorrectAnswers).filter({type: 'phrase'}).reduce(function (a, m, i, p) {
                return a + m.time / p.length;
            }, 0);

            sentence.phrases.incorrect.count = $window._.filter(sentence.correctAnswers, {type: 'phrase'}).length;

            sentence.phrases.questionCount = sentence.phrases.correct.count + sentence.phrases.incorrect.count;

            //Simple Performance
            sentence.simple.correct.time = $window._(sentence.correctAnswers).filter({type: 'simple'}).reduce(function (a, m, i, p) {
                return a + m.time / p.length;
            }, 0);

            sentence.simple.correct.count = $window._.filter(sentence.correctAnswers, {type: 'simple'}).length;

            sentence.simple.incorrect.time = $window._(sentence.incorrectAnswers).filter({type: 'simple'}).reduce(function (a, m, i, p) {
                return a + m.time / p.length;
            }, 0);

            sentence.simple.incorrect.count = $window._.filter(sentence.correctAnswers, {type: 'simple'}).length;

            sentence.simple.questionCount = sentence.simple.correct.count + sentence.simple.incorrect.count;

            //Complex Performance
            sentence.complex.correct.time = $window._(sentence.correctAnswers).filter({type: 'complex'}).reduce(function (a, m, i, p) {
                return a + m.time / p.length;
            }, 0);

            sentence.complex.correct.count = $window._.filter(sentence.correctAnswers, {type: 'complex'}).length;

            sentence.complex.incorrect.time = $window._(sentence.incorrectAnswers).filter({type: 'complex'}).reduce(function (a, m, i, p) {
                return a + m.time / p.length;
            }, 0);

            sentence.complex.incorrect.count = $window._.filter(sentence.correctAnswers, {type: 'complex'}).length;

            sentence.complex.questionCount = sentence.complex.correct.count + sentence.complex.incorrect.count;

            //Non Reversible Phrases
            sentence.nonReversiblePhrases.correct.time = $window._(sentence.correctAnswers).filter({type: 'phrase'}).filter({reversibility: false}).reduce(function (a, m, i, p) {
                return a + m.time / p.length;
            }, 0);

            sentence.nonReversiblePhrases.correct.count = $window._(sentence.correctAnswers).filter({type: 'phrase'}).filter({reversibility: false}).value().length;

            sentence.nonReversiblePhrases.incorrect.time = $window._(sentence.incorrectAnswers).filter({type: 'phrase'}).filter({reversibility: false}).reduce(function (a, m, i, p) {
                return a + m.time / p.length;
            }, 0);

            sentence.nonReversiblePhrases.incorrect.count = $window._(sentence.incorrectAnswers).filter({type: 'phrase'}).filter({reversibility: false}).value().length;

            sentence.nonReversiblePhrases.questionCount = sentence.nonReversiblePhrases.correct.count + sentence.nonReversiblePhrases.incorrect.count;

            //Non Reversible Simple
            sentence.nonReversibleSimple.correct.time = $window._(sentence.correctAnswers).filter({type: 'simple'}).filter({reversibility: false}).reduce(function (a, m, i, p) {
                return a + m.time / p.length;
            }, 0);

            sentence.nonReversibleSimple.correct.count = $window._(sentence.correctAnswers).filter({type: 'simple'}).filter({reversibility: false}).value().length;

            sentence.nonReversibleSimple.incorrect.time = $window._(sentence.incorrectAnswers).filter({type: 'simple'}).filter({reversibility: false}).reduce(function (a, m, i, p) {
                return a + m.time / p.length;
            }, 0);

            sentence.nonReversibleSimple.incorrect.count = $window._(sentence.incorrectAnswers).filter({type: 'simple'}).filter({reversibility: false}).value().length;

            sentence.nonReversibleSimple.questionCount = sentence.nonReversibleSimple.correct.count + sentence.nonReversibleSimple.incorrect.count;

            //Non Reversible Total
            sentence.nonReversibleTotal.correct.time = $window._(sentence.correctAnswers).filter({reversibility: false}).reduce(function (a, m, i, p) {
                return a + m.time / p.length;
            }, 0);

            sentence.nonReversibleTotal.correct.count = $window._(sentence.correctAnswers).filter({reversibility: false}).value().length;

            sentence.nonReversibleTotal.incorrect.time = $window._(sentence.incorrectAnswers).filter({reversibility: false}).reduce(function (a, m, i, p) {
                return a + m.time / p.length;
            }, 0);

            sentence.nonReversibleTotal.incorrect.count = $window._(sentence.incorrectAnswers).filter({reversibility: false}).value().length;

            sentence.nonReversibleTotal.questionCount = sentence.nonReversibleTotal.correct.count + sentence.nonReversibleTotal.incorrect.count;

            //Reversible Simple
            sentence.reversibleSimple.correct.time = $window._(sentence.correctAnswers).filter({type: 'simple'}).filter({reversibility: true}).reduce(function (a, m, i, p) {
                return a + m.time / p.length;
            }, 0);

            sentence.reversibleSimple.correct.count = $window._(sentence.correctAnswers).filter({type: 'simple'}).filter({reversibility: true}).value().length;

            sentence.reversibleSimple.incorrect.time = $window._(sentence.incorrectAnswers).filter({type: 'simple'}).filter({reversibility: true}).reduce(function (a, m, i, p) {
                return a + m.time / p.length;
            }, 0);

            sentence.reversibleSimple.incorrect.count = $window._(sentence.incorrectAnswers).filter({type: 'simple'}).filter({reversibility: true}).value().length;

            sentence.reversibleSimple.questionCount = sentence.reversibleSimple.correct.count + sentence.reversibleSimple.incorrect.count;

            //Reversible Complex
            sentence.reversibleComplex.correct.time = $window._(sentence.correctAnswers).filter({type: 'complex'}).filter({reversibility: true}).reduce(function (a, m, i, p) {
                return a + m.time / p.length;
            }, 0);

            sentence.reversibleComplex.correct.count = $window._(sentence.correctAnswers).filter({type: 'complex'}).filter({reversibility: true}).value().length;

            sentence.reversibleComplex.incorrect.time = $window._(sentence.incorrectAnswers).filter({type: 'complex'}).filter({reversibility: true}).reduce(function (a, m, i, p) {
                return a + m.time / p.length;
            }, 0);

            sentence.reversibleComplex.incorrect.count = $window._(sentence.incorrectAnswers).filter({type: 'complex'}).filter({reversibility: true}).value().length;

            sentence.reversibleComplex.questionCount = sentence.reversibleComplex.correct.count + sentence.reversibleComplex.incorrect.count;

            //Reversible Total
            sentence.reversibleTotal.correct.time = $window._(sentence.correctAnswers).filter({reversibility: true}).reduce(function (a, m, i, p) {
                return a + m.time / p.length;
            }, 0);

            sentence.reversibleTotal.correct.count = $window._(sentence.correctAnswers).filter({reversibility: true}).value().length;

            sentence.reversibleTotal.incorrect.time = $window._(sentence.incorrectAnswers).filter({reversibility: true}).reduce(function (a, m, i, p) {
                return a + m.time / p.length;
            }, 0);

            sentence.reversibleTotal.incorrect.count = $window._(sentence.incorrectAnswers).filter({reversibility: true}).value().length;

            sentence.reversibleTotal.questionCount = sentence.reversibleTotal.correct.count + sentence.reversibleTotal.incorrect.count;


            sentence.timeRank = $window._.sortBy($window._.map($window._.remove($window._.cloneDeep(sentence.rows), function (row) {
                return row.time !== '';
            }, 'time'), 'time'));

            //Setting up color scale for use in ranking repsonse times
            sentence.colours = $window.chroma.scale(['66bd7d', 'b6d382', 'ffe188', 'fa9c78', 'f7686c']).colors(sentence.timeRank.length);


            return sentence;

        };
});