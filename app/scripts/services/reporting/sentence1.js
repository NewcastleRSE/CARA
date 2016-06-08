'use strict';

/**
 * @ngdoc service
 * @name rcaApp.assessment
 * @description
 * # assessment
 * Service in the rcaApp.
 */
angular.module('rcaApp').service('Sentence1', function ($window) {

    var sentence = {
        summaryColumns: [
            {title: '', dataKey: 'type'},
            {title: 'Non-Reversible', dataKey: 'nonReversible'},
            {title: 'Reversible', dataKey: 'reversible'},
            {title: 'Total', dataKey: 'total'}
        ],
        columns: [
            {title: '', dataKey: 'rowNumber'},
            {title: 'Item', dataKey: 'item'},
            {title: 'Target Picture', dataKey: 'targetPicture'},
            {title: 'Distractor 1', dataKey: 'distractor1'},
            {title: 'Distractor 2', dataKey: 'distractor2'},
            {title: 'Distractor 3', dataKey: 'distractor3'},
            {title: 'Time', dataKey: 'time'}
        ],
        summaryRows: [],
        rows: [],
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
        calculate: function(data){

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
                    answer: response.answers[response.answerPosition].image.split(' ')[1].substring(response.answers[response.answerPosition].image.split(' ')[1].length - 1).toUpperCase()
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

            sentence.total.correct.count = sentence.incorrectAnswers.length;

            sentence.total.incorrect.time = $window._(sentence.incorrectAnswers).reduce(function (a, m, i, p) {
                return a + m.time / p.length;
            }, 0);

            sentence.total.incorrect.count = sentence.incorrectAnswers.length;

            sentence.summaryRows.push({
                type: 'Phrases',
                nonReversible: '/6',
                reversible: '',
                total: '/6'
            });

            sentence.summaryRows.push({
                type: 'Simple',
                nonReversible: '/28',
                reversible: '/9',
                total: '/37'
            });

            sentence.summaryRows.push({
                type: 'Complex',
                nonReversible: '',
                reversible: '/14',
                total: '/14'
            });

            sentence.summaryRows.push({
                type: 'Total',
                nonReversible: '/34',
                reversible: '/23',
                total: '/57'
            });

            sentence.timeRank = $window._.sortBy($window._.map($window._.remove($window._.cloneDeep(sentence.rows), function(row){
                return row.time !== '';
            }, 'time'), 'time'));

            //Setting up color scale for use in ranking repsonse times
            sentence.colours = $window.chroma.scale(['66bd7d', 'b6d382', 'ffe188', 'fa9c78', 'f7686c']).colors(sentence.timeRank.length);

        }
    };

    return sentence;
});