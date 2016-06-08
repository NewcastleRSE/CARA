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
            {title: '', dataKey: 'lengthScore'},
            {title: 'Question Type', dataKey: 'questionType'},
            {title: '', dataKey: 'typeScore'}
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
                        readingTime: readingTime
                    });

                    rowCounter++;
                });
            });

            //Separate correct and incorrect answers
            paragraph.correctAnswers = $window._.filter(paragraph.rows, function (data) {
                return data.answer === data.targetPicture;
            });

            paragraph.incorrectAnswers = $window._.filter(paragraph.rows, function (data) {
                return data.answer !== data.targetPicture;
            });


            //Total Performance
            paragraph.total.correct.time = $window._(paragraph.correctAnswers).reduce(function (a, m, i, p) {
                return a + m.time / p.length;
            }, 0);

            paragraph.total.correct.count = paragraph.incorrectAnswers.length;

            paragraph.total.incorrect.time = $window._(paragraph.incorrectAnswers).reduce(function (a, m, i, p) {
                return a + m.time / p.length;
            }, 0);

            paragraph.total.incorrect.count = paragraph.incorrectAnswers.length;

            paragraph.summaryRows.push({
                length: '< 40 Words',
                paragraphs: 'Paragraphs 1 & 2',
                lengthScore: '/4',
                questionType: 'Main ideas stated',
                typeScore: '/15'
            });

            paragraph.summaryRows.push({
                length: '41-60 Words',
                paragraphs: 'Paragraph 3-7',
                lengthScore: '/20',
                questionType: 'Main ideas implied',
                typeScore: '/13'
            });

            paragraph.summaryRows.push({
                length: '61-80 Words',
                paragraphs: 'Paragraphs 8-13',
                lengthScore: '/24',
                questionType: 'Details stated',
                typeScore: '/15'
            });

            paragraph.summaryRows.push({
                length: '100 Words',
                paragraphs: 'Paragraph 14',
                lengthScore: '/4',
                questionType: 'Details implied',
                typeScore: '/13'
            });

            paragraph.summaryRows.push({
                length: '> 200 Words',
                paragraphs: 'Paragraph 15',
                lengthScore: '/4',
                questionType: 'Gist',
                typeScore: '/9'
            });

            paragraph.summaryRows.push({
                length: '',
                paragraphs: '',
                lengthScore: '',
                questionType: 'Total',
                typeScore: '/65'
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