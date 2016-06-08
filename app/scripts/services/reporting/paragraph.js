'use strict';

/**
 * @ngdoc service
 * @name rcaApp.assessment
 * @description
 * # assessment
 * Service in the rcaApp.
 */
angular.module('rcaApp').service('Paragraph', function ($window) {

    var paragraph = {
        summaryColumns: [
            {title: 'Length', dataKey: 'length'},
            {title: 'Paragraphs', dataKey: 'paragraphs'},
            {title: 'Total', dataKey: 'lengthScore'},
            {title: 'Question Type', dataKey: 'questionType'},
            {title: 'Total', dataKey: 'typeScore'}
        ],
        columns: [
            {title: '', dataKey: 'rowNumber'},
            {title: 'Item', dataKey: 'item'},
            {title: 'Target', dataKey: 'target'},
            {title: 'Distractor 1', dataKey: 'distractor1'},
            {title: 'Distractor 2', dataKey: 'distractor2'},
            {title: 'Time', dataKey: 'time'},
            {title: 'Reading Time', dataKey: 'readingTime'}
        ],
        summaryRows: [],
        rows: [],
        colours: [],
        timeRank: [],
        readingColours: [],
        readingTimeRank: [],
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
        mainIdeasStated: {
            correct: {
                time: null,
                count: null
            },
            incorrect: {
                time: null,
                count: null
            }
        },
        mainIdeasImplied: {
            correct: {
                time: null,
                count: null
            },
            incorrect: {
                time: null,
                count: null
            }
        },
        detailsStated: {
            correct: {
                time: null,
                count: null
            },
            incorrect: {
                time: null,
                count: null
            }
        },
        detailsImplied: {
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

            console.log(data);

            var rowCounter = 1;

            //Data for colour coded response time table
            data.forEach(function (response, index) {

                var item = 'P' + (index + 1);
                var readingTime = response.timeTaken / 1000;

                response.questions.forEach(function (question) {

                    var distractors = $window._.remove(question.answers, function (answer) {
                        return answer !== question.correctAnswer;
                    });

                    paragraph.rows.push({
                        rowNumber: rowCounter,
                        item: item,
                        questionCount: response.questions.length,
                        target: question.correctAnswer,
                        distractor1: distractors[0],
                        distractor2: distractors[1],
                        time: question.timeTaken / 1000,
                        answer: question.answerGiven,
                        readingTime: readingTime,
                        type: question.type
                    });

                    rowCounter++;
                });
            });

            //Separate correct and incorrect answers
            paragraph.correctAnswers = $window._.filter(paragraph.rows, function (data) {
                return data.answer === data.target;
            });

            paragraph.incorrectAnswers = $window._.filter(paragraph.rows, function (data) {
                return data.answer !== data.target;
            });


            //Total Performance
            paragraph.total.correct.time = $window._(paragraph.correctAnswers).reduce(function (a, m, i, p) {
                return a + m.time / p.length;
            }, 0);

            paragraph.total.correct.count = paragraph.correctAnswers.length;

            paragraph.total.incorrect.time = $window._(paragraph.incorrectAnswers).reduce(function (a, m, i, p) {
                return a + m.time / p.length;
            }, 0);

            paragraph.total.incorrect.count = paragraph.incorrectAnswers.length;


            //MIS Performance
            paragraph.mainIdeasStated.correct.time = $window._(paragraph.correctAnswers).filter({type: 'MIS'}).reduce(function (a, m, i, p) {
                return a + m.time / p.length;
            }, 0);

            paragraph.mainIdeasStated.correct.count = $window._.filter(paragraph.correctAnswers, {type: 'MIS'}).length;

            paragraph.mainIdeasStated.incorrect.time = $window._(paragraph.incorrectAnswers).filter({type: 'MIS'}).reduce(function (a, m, i, p) {
                return a + m.time / p.length;
            }, 0);

            paragraph.mainIdeasStated.incorrect.count = $window._.filter(paragraph.incorrectAnswers, {type: 'MIS'}).length;

            //MII Performance
            paragraph.mainIdeasImplied.correct.time = $window._(paragraph.correctAnswers).filter({type: 'MII'}).reduce(function (a, m, i, p) {
                return a + m.time / p.length;
            }, 0);

            paragraph.mainIdeasImplied.correct.count = $window._.filter(paragraph.correctAnswers, {type: 'MII'}).length;

            paragraph.mainIdeasImplied.incorrect.time = $window._(paragraph.incorrectAnswers).filter({type: 'MII'}).reduce(function (a, m, i, p) {
                return a + m.time / p.length;
            }, 0);

            paragraph.mainIdeasImplied.incorrect.count = $window._.filter(paragraph.incorrectAnswers, {type: 'MII'}).length;

            //DS Performance
            paragraph.detailsStated.correct.time = $window._(paragraph.correctAnswers).filter({type: 'DS'}).reduce(function (a, m, i, p) {
                return a + m.time / p.length;
            }, 0);

            paragraph.detailsStated.correct.count = $window._.filter(paragraph.correctAnswers, {type: 'DS'}).length;

            paragraph.detailsStated.incorrect.time = $window._(paragraph.incorrectAnswers).filter({type: 'DS'}).reduce(function (a, m, i, p) {
                return a + m.time / p.length;
            }, 0);

            paragraph.detailsStated.incorrect.count = $window._.filter(paragraph.incorrectAnswers, {type: 'DS'}).length;

            //DI Performance
            paragraph.detailsImplied.correct.time = $window._(paragraph.correctAnswers).filter({type: 'DI'}).reduce(function (a, m, i, p) {
                return a + m.time / p.length;
            }, 0);

            paragraph.detailsImplied.correct.count = $window._.filter(paragraph.correctAnswers, {type: 'DI'}).length;

            paragraph.detailsImplied.incorrect.time = $window._(paragraph.incorrectAnswers).filter({type: 'DI'}).reduce(function (a, m, i, p) {
                return a + m.time / p.length;
            }, 0);

            paragraph.detailsImplied.incorrect.count = $window._.filter(paragraph.incorrectAnswers, {type: 'DI'}).length;


            paragraph.summaryRows.push({
                length: '< 40 Words',
                paragraphs: 'Paragraphs 1 & 2',
                lengthScore: '/4',
                questionType: 'Main ideas stated',
                typeScore: paragraph.mainIdeasStated.correct.count + ' / 15'
            });

            paragraph.summaryRows.push({
                length: '41-60 Words',
                paragraphs: 'Paragraph 3-7',
                lengthScore: '/20',
                questionType: 'Main ideas implied',
                typeScore: paragraph.mainIdeasImplied.correct.count + ' / 13'
            });

            paragraph.summaryRows.push({
                length: '61-80 Words',
                paragraphs: 'Paragraphs 8-13',
                lengthScore: '/24',
                questionType: 'Details stated',
                typeScore: paragraph.detailsStated.correct.count + ' / 15'
            });

            paragraph.summaryRows.push({
                length: '100 Words',
                paragraphs: 'Paragraph 14',
                lengthScore: '/4',
                questionType: 'Details implied',
                typeScore: paragraph.detailsImplied.correct.count + ' / 13'
            });

            paragraph.summaryRows.push({
                length: '> 200 Words',
                paragraphs: 'Paragraph 15',
                lengthScore: '/4',
                questionType: 'Gist',
                lengthType: '/9',
                typeScore: 0
            });

            paragraph.summaryRows.push({
                length: '',
                paragraphs: '',
                lengthScore: '',
                questionType: 'Total',
                typeScore: paragraph.total.correct.count + ' / 65'
            });

            paragraph.timeRank = $window._.sortBy($window._.map($window._.remove($window._.cloneDeep(paragraph.rows), function(row){
                return row.time !== '';
            }, 'time'), 'time'));


            paragraph.readingTimeRank = $window._.sortBy($window._.map($window._.remove($window._.cloneDeep(paragraph.rows), function(row){
                return row.readingTime !== '';
            }, 'readingTime'), 'readingTime'));


            paragraph.colours = $window.chroma.scale(['66bd7d', 'b6d382', 'ffe188', 'fa9c78', 'f7686c']).colors(paragraph.timeRank.length);


            paragraph.readingColours = $window.chroma.scale(['66bd7d', 'b6d382', 'ffe188', 'fa9c78', 'f7686c']).colors(paragraph.readingTimeRank.length);

        }
    };

    return paragraph;
});