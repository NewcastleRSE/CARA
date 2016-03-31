'use strict';

/**
 * @ngdoc service
 * @name rcaApp.assessment
 * @description
 * # assessment
 * Service in the rcaApp.
 */
angular.module('rcaApp').service('Report', function ($window) {

    return function(assessment) {

        console.log(assessment.questions);

        var singleWordColumns = [
            {title: '', dataKey: 'rowNumber'},
            {title: 'Item', dataKey: 'item'},
            {title: 'Target Word', dataKey: 'targetWord'},
            {title: 'Distractor 1', dataKey: 'distractor1'},
            {title: 'Distractor 2', dataKey: 'distractor2'},
            {title: 'Noun/Verb', dataKey: 'nounVerb'},
            {title: 'Concrete/Abstract', dataKey: 'concreteAbstract'},
            {title: 'Time', dataKey: 'time'}
        ];

        var sentenceColumns = [
            {title: '', dataKey: 'rowNumber'},
            {title: 'Item', dataKey: 'item'},
            {title: 'Target Picture', dataKey: 'targetPicture'},
            {title: 'Distractor 1', dataKey: 'distractor1'},
            {title: 'Distractor 2', dataKey: 'distractor2'},
            {title: 'Distractor 3', dataKey: 'distractor3'},
            {title: 'Time', dataKey: 'time'}
        ];

        var paragraphColumns = [
            {title: '', dataKey: 'rowNumber'},
            {title: 'Item', dataKey: 'item'},
            {title: 'Target', dataKey: 'target'},
            {title: 'Distractor 1', dataKey: 'distractor1'},
            {title: 'Distractor 2', dataKey: 'distractor2'},
            {title: 'Time', dataKey: 'time'},
            {title: 'Reading Time', dataKey: 'readingTime'}
        ];

        var tableRows = {
            singleWord1: [],
            singleWord2: [],
            sentence1: [],
            sentence2: [],
            paragraph: []
        };

        assessment.questions['singleWord-part-1'].items.forEach(function (response, index) {

            var distractors = $window._.remove(response.answers, function (answer) {
                return answer !== response.correctAnswer;
            });

            tableRows.singleWord1.push({
                rowNumber: index + 1,
                item: response.question,
                targetWord: response.correctAnswer,
                distractor1: distractors[0],
                distractor2: distractors[1],
                nounVerb: response.part,
                concreteAbstract: response.type,
                time: response.timeTaken / 1000,
                answer: response.answerGiven
            });

        });

        assessment.questions['singleWord-part-2'].items.forEach(function (response, index) {

            var distractors = $window._.remove(response.answers, function (answer) {
                return answer !== response.correctAnswer;
            });

            tableRows.singleWord2.push({
                rowNumber: index + 1,
                item: response.question,
                targetWord: response.correctAnswer,
                distractor1: distractors[0],
                distractor2: distractors[1],
                nounVerb: response.part,
                concreteAbstract: response.type,
                time: response.timeTaken / 1000,
                answer: response.answerGiven
            });
        });

        assessment.questions['sentence-part-1'].items.forEach(function (response, index) {

            tableRows.sentence1.push({
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

        assessment.questions['sentence-part-2'].items.forEach(function (response, index) {

            tableRows.sentence2.push({
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

        var rowCounter = 1;

        assessment.questions['paragraph'].items.forEach(function (response, index) {

            var item = 'P' + (index + 1);
            var readingTime = response.timeTaken / 1000;

            response.questions.forEach(function (question) {

                var distractors = $window._.remove(question.answers, function (answer) {
                    return answer !== question.correctAnswer;
                });

                tableRows.paragraph.push({
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

        var singleWord1CorrectAnswers = $window._.filter(tableRows.singleWord1, function (data) {
                return data.answer === data.targetWord;
            }),
            singleWord1IncorrectAnswers = $window._.filter(tableRows.singleWord1, function (data) {
                return data.answer !== data.targetWord;
            }),
            singleWord2CorrectAnswers = $window._.filter(tableRows.singleWord2, function (data) {
                return data.answer === data.targetWord;
            }),
            singleWord2IncorrectAnswers = $window._.filter(tableRows.singleWord2, function (data) {
                return data.answer !== data.targetWord;
            }),
            sentence1CorrectAnswers = $window._.filter(tableRows.sentence1, function (data) {
                return data.answer === data.targetPicture;
            }),
            sentence1IncorrectAnswers = $window._.filter(tableRows.sentence1, function (data) {
                return data.answer !== data.targetPicture;
            }),
            sentence2CorrectAnswers = $window._.filter(tableRows.sentence2, function (data) {
                return data.answer === data.targetPicture;
            }),
            sentence2IncorrectAnswers = $window._.filter(tableRows.sentence2, function (data) {
                return data.answer !== data.targetPicture;
            }),
            paragraphCorrectAnswers = $window._.filter(tableRows.paragraph, function (data) {
                return data.answer === data.target;
            }),
            paragraphIncorrectAnswers = $window._.filter(tableRows.paragraph, function (data) {
                return data.answer !== data.target;
            });

        var singleWord1 = {
            total: {
                correct: {
                    time: $window._(singleWord1CorrectAnswers).reduce(function (a, m, i, p) {
                        return a + m.time / p.length;
                    }, 0),
                    count: singleWord1CorrectAnswers.length
                },
                incorrect: {
                    time: $window._(singleWord1IncorrectAnswers).reduce(function (a, m, i, p) {
                        return a + m.time / p.length;
                    }, 0),
                    count: singleWord1IncorrectAnswers.length
                }
            },
            nouns: {
                correct: {
                    time: $window._(singleWord1CorrectAnswers).filter({nounVerb: 'Noun'}).reduce(function (a, m, i, p) {
                        return a + m.time / p.length;
                    }, 0),
                    count: $window._.filter(singleWord1CorrectAnswers, {nounVerb: 'Noun'}).length
                },
                incorrect: {
                    time: $window._(singleWord1IncorrectAnswers).filter(singleWord1CorrectAnswers, {nounVerb: 'Noun'}).reduce(function (a, m, i, p) {
                        return a + m.time / p.length;
                    }, 0),
                    count: $window._.filter(singleWord1IncorrectAnswers, {nounVerb: 'Noun'}).length
                }
            },
            verbs: {
                correct: {
                    time: $window._(singleWord1CorrectAnswers).filter({nounVerb: 'Verb'}).reduce(function (a, m, i, p) {
                        return a + m.time / p.length;
                    }, 0),
                    count: $window._.filter(singleWord1CorrectAnswers, {nounVerb: 'Verb'}).length
                },
                incorrect: {
                    time: $window._(singleWord1IncorrectAnswers).filter({nounVerb: 'Verb'}).reduce(function (a, m, i, p) {
                        return a + m.time / p.length;
                    }, 0),
                    count: $window._.filter(singleWord1IncorrectAnswers, {nounVerb: 'Verb'}).length
                }
            },
            abstractNouns: {
                correct: {
                    time: $window._(singleWord1CorrectAnswers).filter({nounVerb: 'Noun'}).filter({concreteAbstract: 'Abstract'}).reduce(function (a, m, i, p) {
                        return a + m.time / p.length;
                    }, 0),
                    count: $window._.filter($window._.filter(singleWord1CorrectAnswers, {nounVerb: 'Noun'}), {concreteAbstract: 'Abstract'}).length
                },
                incorrect: {
                    time: $window._(singleWord1IncorrectAnswers).filter({nounVerb: 'Noun'}).filter({concreteAbstract: 'Abstract'}).reduce(function (a, m, i, p) {
                        return a + m.time / p.length;
                    }, 0),
                    count: $window._.filter($window._.filter(singleWord1IncorrectAnswers, {nounVerb: 'Noun'}), {concreteAbstract: 'Abstract'}).length
                }
            },
            concreteNouns: {
                correct: {
                    time: $window._(singleWord1CorrectAnswers).filter({nounVerb: 'Noun'}).filter({concreteAbstract: 'Concrete'}).reduce(function (a, m, i, p) {
                        return a + m.time / p.length;
                    }, 0),
                    count: $window._.filter($window._.filter(singleWord1CorrectAnswers, {nounVerb: 'Noun'}), {concreteAbstract: 'Concrete'}).length
                },
                incorrect: {
                    time: $window._(singleWord1IncorrectAnswers).filter({nounVerb: 'Noun'}).filter({concreteAbstract: 'Concrete'}).reduce(function (a, m, i, p) {
                        return a + m.time / p.length;
                    }, 0),
                    count: $window._.filter($window._.filter(singleWord1IncorrectAnswers, {nounVerb: 'Noun'}), {concreteAbstract: 'Concrete'}).length
                }
            },
            abstractVerbs: {
                correct: {
                    time: $window._(singleWord1CorrectAnswers).filter({nounVerb: 'Verb'}).filter({concreteAbstract: 'Abstract'}).reduce(function (a, m, i, p) {
                        return a + m.time / p.length;
                    }, 0),
                    count: $window._.filter($window._.filter(singleWord1CorrectAnswers, {nounVerb: 'Verb'}), {concreteAbstract: 'Abstract'}).length
                },
                incorrect: {
                    time: $window._(singleWord1IncorrectAnswers).filter({nounVerb: 'Verb'}).filter({concreteAbstract: 'Abstract'}).reduce(function (a, m, i, p) {
                        return a + m.time / p.length;
                    }, 0),
                    count: $window._.filter($window._.filter(singleWord1IncorrectAnswers, {nounVerb: 'Verb'}), {concreteAbstract: 'Abstract'}).length
                }
            },
            concreteVerbs: {
                correct: {
                    time: $window._(singleWord1CorrectAnswers).filter({nounVerb: 'Verb'}).filter({concreteAbstract: 'Concrete'}).reduce(function (a, m, i, p) {
                        return a + m.time / p.length;
                    }, 0),
                    count: $window._.filter($window._.filter(singleWord1CorrectAnswers, {nounVerb: 'Verb'}), {concreteAbstract: 'Concrete'}).length
                },
                incorrect: {
                    time: $window._(singleWord1IncorrectAnswers).filter({nounVerb: 'Verb'}).filter({concreteAbstract: 'Concrete'}).reduce(function (a, m, i, p) {
                        return a + m.time / p.length;
                    }, 0),
                    count: $window._.filter($window._.filter(singleWord1IncorrectAnswers, {nounVerb: 'Verb'}), {concreteAbstract: 'Concrete'}).length
                }
            }
        };

        var singleWord2 = {
            total: {
                correct: {
                    time: $window._(singleWord2CorrectAnswers).reduce(function (a, m, i, p) {
                        return a + m.time / p.length;
                    }, 0),
                    count: singleWord2CorrectAnswers.length
                },
                incorrect: {
                    time: $window._(singleWord2IncorrectAnswers).reduce(function (a, m, i, p) {
                        return a + m.time / p.length;
                    }, 0),
                    count: singleWord2IncorrectAnswers.length
                }
            },
            nouns: {
                correct: {
                    time: $window._(singleWord2CorrectAnswers).filter({nounVerb: 'Noun'}).reduce(function (a, m, i, p) {
                        return a + m.time / p.length;
                    }, 0),
                    count: $window._.filter(singleWord2CorrectAnswers, {nounVerb: 'Noun'}).length
                },
                incorrect: {
                    time: $window._(singleWord2IncorrectAnswers).filter(singleWord2CorrectAnswers, {nounVerb: 'Noun'}).reduce(function (a, m, i, p) {
                        return a + m.time / p.length;
                    }, 0),
                    count: $window._.filter(singleWord2IncorrectAnswers, {nounVerb: 'Noun'}).length
                }
            },
            verbs: {
                correct: {
                    time: $window._(singleWord2CorrectAnswers).filter({nounVerb: 'Verb'}).reduce(function (a, m, i, p) {
                        return a + m.time / p.length;
                    }, 0),
                    count: $window._.filter(singleWord2CorrectAnswers, {nounVerb: 'Verb'}).length
                },
                incorrect: {
                    time: $window._(singleWord2IncorrectAnswers).filter({nounVerb: 'Verb'}).reduce(function (a, m, i, p) {
                        return a + m.time / p.length;
                    }, 0),
                    count: $window._.filter(singleWord2IncorrectAnswers, {nounVerb: 'Verb'}).length
                }
            },
            abstractNouns: {
                correct: {
                    time: $window._(singleWord2CorrectAnswers).filter({nounVerb: 'Noun'}).filter({concreteAbstract: 'Abstract'}).reduce(function (a, m, i, p) {
                        return a + m.time / p.length;
                    }, 0),
                    count: $window._.filter($window._.filter(singleWord2CorrectAnswers, {nounVerb: 'Noun'}), {concreteAbstract: 'Abstract'}).length
                },
                incorrect: {
                    time: $window._(singleWord2IncorrectAnswers).filter({nounVerb: 'Noun'}).filter({concreteAbstract: 'Abstract'}).reduce(function (a, m, i, p) {
                        return a + m.time / p.length;
                    }, 0),
                    count: $window._.filter($window._.filter(singleWord2IncorrectAnswers, {nounVerb: 'Noun'}), {concreteAbstract: 'Abstract'}).length
                }
            },
            concreteNouns: {
                correct: {
                    time: $window._(singleWord2CorrectAnswers).filter({nounVerb: 'Noun'}).filter({concreteAbstract: 'Concrete'}).reduce(function (a, m, i, p) {
                        return a + m.time / p.length;
                    }, 0),
                    count: $window._.filter($window._.filter(singleWord2CorrectAnswers, {nounVerb: 'Noun'}), {concreteAbstract: 'Concrete'}).length
                },
                incorrect: {
                    time: $window._(singleWord2IncorrectAnswers).filter({nounVerb: 'Noun'}).filter({concreteAbstract: 'Concrete'}).reduce(function (a, m, i, p) {
                        return a + m.time / p.length;
                    }, 0),
                    count: $window._.filter($window._.filter(singleWord2IncorrectAnswers, {nounVerb: 'Noun'}), {concreteAbstract: 'Concrete'}).length
                }
            },
            abstractVerbs: {
                correct: {
                    time: $window._(singleWord2CorrectAnswers).filter({nounVerb: 'Verb'}).filter({concreteAbstract: 'Abstract'}).reduce(function (a, m, i, p) {
                        return a + m.time / p.length;
                    }, 0),
                    count: $window._.filter($window._.filter(singleWord2CorrectAnswers, {nounVerb: 'Verb'}), {concreteAbstract: 'Abstract'}).length
                },
                incorrect: {
                    time: $window._(singleWord2IncorrectAnswers).filter({nounVerb: 'Verb'}).filter({concreteAbstract: 'Abstract'}).reduce(function (a, m, i, p) {
                        return a + m.time / p.length;
                    }, 0),
                    count: $window._.filter($window._.filter(singleWord2IncorrectAnswers, {nounVerb: 'Verb'}), {concreteAbstract: 'Abstract'}).length
                }
            },
            concreteVerbs: {
                correct: {
                    time: $window._(singleWord2CorrectAnswers).filter({nounVerb: 'Verb'}).filter({concreteAbstract: 'Concrete'}).reduce(function (a, m, i, p) {
                        return a + m.time / p.length;
                    }, 0),
                    count: $window._.filter($window._.filter(singleWord2CorrectAnswers, {nounVerb: 'Verb'}), {concreteAbstract: 'Concrete'}).length
                },
                incorrect: {
                    time: $window._(singleWord2IncorrectAnswers).filter({nounVerb: 'Verb'}).filter({concreteAbstract: 'Concrete'}).reduce(function (a, m, i, p) {
                        return a + m.time / p.length;
                    }, 0),
                    count: $window._.filter($window._.filter(singleWord2IncorrectAnswers, {nounVerb: 'Verb'}), {concreteAbstract: 'Concrete'}).length
                }
            }
        };

        var sentence1 = {
            total: {
                correct: {
                    time: $window._(sentence1CorrectAnswers).reduce(function (a, m, i, p) {
                        return a + m.time / p.length;
                    }, 0),
                    count: sentence1CorrectAnswers.length
                },
                incorrect: {
                    time: $window._(sentence1IncorrectAnswers).reduce(function (a, m, i, p) {
                        return a + m.time / p.length;
                    }, 0),
                    count: sentence1IncorrectAnswers.length
                }
            }
        };

        var sentence2 = {
            total: {
                correct: {
                    time: $window._(sentence2CorrectAnswers).reduce(function (a, m, i, p) {
                        return a + m.time / p.length;
                    }, 0),
                    count: sentence2CorrectAnswers.length
                },
                incorrect: {
                    time: $window._(sentence2IncorrectAnswers).reduce(function (a, m, i, p) {
                        return a + m.time / p.length;
                    }, 0),
                    count: sentence2IncorrectAnswers.length
                }
            }
        };

        var paragraph = {
            total: {
                correct: {
                    time: $window._(paragraphCorrectAnswers).reduce(function (a, m, i, p) {
                        return a + m.time / p.length;
                    }, 0),
                    count: paragraphCorrectAnswers.length
                },
                incorrect: {
                    time: $window._(paragraphIncorrectAnswers).reduce(function (a, m, i, p) {
                        return a + m.time / p.length;
                    }, 0),
                    count: paragraphIncorrectAnswers.length
                }
            }
        };

        var singleWord1ResponseTimes = new CanvasJS.Chart('singleWord1BarChart', {
            title:{
                text: 'Single Word Part 1 Response Times',
                fontSize: 16
            },
            axisX: {
                labelAngle: 135
            },
            axisY:{
                title: 'Time in Seconds',
                titleFontSize: 14,
                margin: 5
            },
            data: [
                {
                    type: 'column',
                    color: '#66BD7D',
                    name: 'Correct',
                    dataPoints: [
                        { label: 'Total', y: singleWord1.total.correct.time },
                        { label: 'Nouns', y: singleWord1.nouns.correct.time },
                        { label: 'Verbs', y: singleWord1.verbs.correct.time },
                        { label: 'Abstract Nouns', y: singleWord1.abstractNouns.correct.time },
                        { label: 'Concrete Nouns', y: singleWord1.concreteNouns.correct.time },
                        { label: 'Abstract Verbs', y: singleWord1.abstractVerbs.correct.time },
                        { label: 'Concrete Verbs', y: singleWord1.concreteVerbs.correct.time }
                    ]
                },
                {
                    type: 'column',
                    color: '#f7686c',
                    name: 'Incorrect',
                    dataPoints: [
                        { label: 'Total', y: singleWord1.total.incorrect.time },
                        { label: 'Nouns', y: singleWord1.nouns.incorrect.time },
                        { label: 'Verbs', y: singleWord1.verbs.incorrect.time },
                        { label: 'Abstract Nouns', y: singleWord1.abstractNouns.incorrect.time },
                        { label: 'Concrete Nouns', y: singleWord1.concreteNouns.incorrect.time },
                        { label: 'Abstract Verbs', y: singleWord1.abstractVerbs.incorrect.time },
                        { label: 'Concrete Verbs', y: singleWord1.concreteVerbs.incorrect.time }
                    ]
                }
            ]
        });

        var singleWord1Totals = new CanvasJS.Chart('singleWord1Pie1', {
            title:{
                text: 'Single Word Part 1 All Answers',
                fontSize: 16
            },
            legend: {
                maxWidth: 180,
                itemWidth: 100
            },
            data: [
                {
                    type: 'pie',
                    showInLegend: true,
                    dataPoints: [
                        { legendText: 'Correct', y: singleWord1.total.correct.count, indexLabel: singleWord1.total.correct.count.toString(), color: '#66BD7D'},
                        { legendText: 'Incorrect', y: singleWord1.total.incorrect.count, indexLabel: singleWord1.total.incorrect.count.toString(), color: '#f7686c'}
                    ]
                }
            ]
        });

        var singleWord1Nouns = new CanvasJS.Chart('singleWord1Pie2', {
            title:{
                text: 'Single Word Part 1 Nouns',
                fontSize: 16
            },
            legend: {
                maxWidth: 180,
                itemWidth: 100
            },
            data: [
                {
                    type: 'pie',
                    showInLegend: true,
                    dataPoints: [
                        { legendText: 'Correct', y: singleWord1.nouns.correct.count, indexLabel: singleWord1.nouns.correct.count.toString(), color: '#66BD7D'},
                        { legendText: 'Incorrect', y: singleWord1.nouns.incorrect.count, indexLabel: singleWord1.nouns.incorrect.count.toString(), color: '#f7686c'}
                    ]
                }
            ]
        });

        var singleWord1Verbs = new CanvasJS.Chart('singleWord1Pie3', {
            title:{
                text: 'Single Word Part 1 Verbs',
                fontSize: 16
            },
            legend: {
                maxWidth: 180,
                itemWidth: 100
            },
            data: [
                {
                    type: 'pie',
                    showInLegend: true,
                    dataPoints: [
                        { legendText: 'Correct', y: singleWord1.verbs.correct.count, indexLabel: singleWord1.verbs.correct.count.toString(), color: '#66BD7D'},
                        { legendText: 'Incorrect', y: singleWord1.verbs.incorrect.count, indexLabel: singleWord1.verbs.incorrect.count.toString(), color: '#f7686c'}
                    ]
                }
            ]
        });

        var singleWord1AbstractNouns = new CanvasJS.Chart('singleWord1Pie4', {
            title:{
                text: 'Single Word Part 1 Abstract Nouns',
                fontSize: 16
            },
            legend: {
                maxWidth: 180,
                itemWidth: 100
            },
            data: [
                {
                    type: 'pie',
                    showInLegend: true,
                    dataPoints: [
                        { legendText: 'Correct', y: singleWord1.abstractNouns.correct.count, indexLabel: singleWord1.abstractNouns.correct.count.toString(), color: '#66BD7D'},
                        { legendText: 'Incorrect', y: singleWord1.abstractNouns.incorrect.count, indexLabel: singleWord1.abstractNouns.incorrect.count.toString(), color: '#f7686c'}
                    ]
                }
            ]
        });

        var singleWord1ConcreteNouns = new CanvasJS.Chart('singleWord1Pie5', {
            title:{
                text: 'Single Word Part 1 Concrete Nouns',
                fontSize: 16
            },
            legend: {
                maxWidth: 180,
                itemWidth: 100
            },
            data: [
                {
                    type: 'pie',
                    showInLegend: true,
                    dataPoints: [
                        { legendText: 'Correct', y: singleWord1.concreteNouns.correct.count, indexLabel: singleWord1.concreteNouns.correct.count.toString(), color: '#66BD7D'},
                        { legendText: 'Incorrect', y: singleWord1.concreteNouns.incorrect.count, indexLabel: singleWord1.concreteNouns.incorrect.count.toString(), color: '#f7686c'}
                    ]
                }
            ]
        });

        var singleWord1AbstractVerbs = new CanvasJS.Chart('singleWord1Pie6', {
            title:{
                text: 'Single Word Part 1 Abstract Verbs',
                fontSize: 16
            },
            legend: {
                maxWidth: 180,
                itemWidth: 100
            },
            data: [
                {
                    type: 'pie',
                    showInLegend: true,
                    dataPoints: [
                        { legendText: 'Correct', y: singleWord1.abstractVerbs.correct.count, indexLabel: singleWord1.abstractVerbs.correct.count.toString(), color: '#66BD7D'},
                        { legendText: 'Incorrect', y: singleWord1.abstractVerbs.incorrect.count, indexLabel: singleWord1.abstractVerbs.incorrect.count.toString(), color: '#f7686c'}
                    ]
                }
            ]
        });

        var singleWord1ConcreteVerbs = new CanvasJS.Chart('singleWord1Pie7', {
            title:{
                text: 'Single Word Part 1 Concrete Verbs',
                fontSize: 16
            },
            legend: {
                maxWidth: 180,
                itemWidth: 100
            },
            data: [
                {
                    type: 'pie',
                    showInLegend: true,
                    dataPoints: [
                        { legendText: 'Correct', y: singleWord1.concreteVerbs.correct.count, indexLabel: singleWord1.concreteVerbs.correct.count.toString(), color: '#66BD7D'},
                        { legendText: 'Incorrect', y: singleWord1.concreteVerbs.incorrect.count, indexLabel: singleWord1.concreteVerbs.incorrect.count.toString(), color: '#f7686c'}
                    ]
                }
            ]
        });

        var singleWord2ResponseTimes = new CanvasJS.Chart('singleWord2BarChart', {
            title:{
                text: 'Single Word Part 2 Response Times',
                fontSize: 16
            },
            axisX: {
                labelAngle: 135
            },
            axisY:{
                title: 'Time in Seconds',
                titleFontSize: 14,
                margin: 5
            },
            data: [
                {
                    type: 'column',
                    color: '#66BD7D',
                    name: 'Correct',
                    dataPoints: [
                        { label: 'Total', y: singleWord2.total.correct.time },
                        { label: 'Nouns', y: singleWord2.nouns.correct.time },
                        { label: 'Verbs', y: singleWord2.verbs.correct.time },
                        { label: 'Abstract Nouns', y: singleWord2.abstractNouns.correct.time },
                        { label: 'Concrete Nouns', y: singleWord2.concreteNouns.correct.time },
                        { label: 'Abstract Verbs', y: singleWord2.abstractVerbs.correct.time },
                        { label: 'Concrete Verbs', y: singleWord2.concreteVerbs.correct.time }
                    ]
                },
                {
                    type: 'column',
                    color: '#f7686c',
                    name: 'Incorrect',
                    dataPoints: [
                        { label: 'Total', y: singleWord2.total.incorrect.time },
                        { label: 'Nouns', y: singleWord2.nouns.incorrect.time },
                        { label: 'Verbs', y: singleWord2.verbs.incorrect.time },
                        { label: 'Abstract Nouns', y: singleWord2.abstractNouns.incorrect.time },
                        { label: 'Concrete Nouns', y: singleWord2.concreteNouns.incorrect.time },
                        { label: 'Abstract Verbs', y: singleWord2.abstractVerbs.incorrect.time },
                        { label: 'Concrete Verbs', y: singleWord2.concreteVerbs.incorrect.time }
                    ]
                }
            ]
        });

        var singleWord2Totals = new CanvasJS.Chart('singleWord2Pie1', {
            title:{
                text: 'Single Word Part 2 All Answers',
                fontSize: 16
            },
            legend: {
                maxWidth: 180,
                itemWidth: 100
            },
            data: [
                {
                    type: 'pie',
                    showInLegend: true,
                    dataPoints: [
                        { legendText: 'Correct', y: singleWord2.total.correct.count, indexLabel: singleWord2.total.correct.count.toString(), color: '#66BD7D'},
                        { legendText: 'Incorrect', y: singleWord2.total.incorrect.count, indexLabel: singleWord2.total.incorrect.count.toString(), color: '#f7686c'}
                    ]
                }
            ]
        });

        var singleWord2Nouns = new CanvasJS.Chart('singleWord2Pie2', {
            title:{
                text: 'Single Word Part 2 Nouns',
                fontSize: 16
            },
            legend: {
                maxWidth: 180,
                itemWidth: 100
            },
            data: [
                {
                    type: 'pie',
                    showInLegend: true,
                    dataPoints: [
                        { legendText: 'Correct', y: singleWord2.nouns.correct.count, indexLabel: singleWord2.nouns.correct.count.toString(), color: '#66BD7D'},
                        { legendText: 'Incorrect', y: singleWord2.nouns.incorrect.count, indexLabel: singleWord2.nouns.incorrect.count.toString(), color: '#f7686c'}
                    ]
                }
            ]
        });

        var singleWord2Verbs = new CanvasJS.Chart('singleWord2Pie3', {
            title:{
                text: 'Single Word Part 2 Verbs',
                fontSize: 16
            },
            legend: {
                maxWidth: 180,
                itemWidth: 100
            },
            data: [
                {
                    type: 'pie',
                    showInLegend: true,
                    dataPoints: [
                        { legendText: 'Correct', y: singleWord2.verbs.correct.count, indexLabel: singleWord2.verbs.correct.count.toString(), color: '#66BD7D'},
                        { legendText: 'Incorrect', y: singleWord2.verbs.incorrect.count, indexLabel: singleWord2.verbs.incorrect.count.toString(), color: '#f7686c'}
                    ]
                }
            ]
        });

        var singleWord2AbstractNouns = new CanvasJS.Chart('singleWord2Pie4', {
            title:{
                text: 'Single Word Part 2 Abstract Nouns',
                fontSize: 16
            },
            legend: {
                maxWidth: 180,
                itemWidth: 100
            },
            data: [
                {
                    type: 'pie',
                    showInLegend: true,
                    dataPoints: [
                        { legendText: 'Correct', y: singleWord2.abstractNouns.correct.count, indexLabel: singleWord2.abstractNouns.correct.count.toString(), color: '#66BD7D'},
                        { legendText: 'Incorrect', y: singleWord2.abstractNouns.incorrect.count, indexLabel: singleWord2.abstractNouns.incorrect.count.toString(), color: '#f7686c'}
                    ]
                }
            ]
        });

        var singleWord2ConcreteNouns = new CanvasJS.Chart('singleWord2Pie5', {
            title:{
                text: 'Single Word Part 2 Concrete Nouns',
                fontSize: 16
            },
            legend: {
                maxWidth: 180,
                itemWidth: 100
            },
            data: [
                {
                    type: 'pie',
                    showInLegend: true,
                    dataPoints: [
                        { legendText: 'Correct', y: singleWord2.concreteNouns.correct.count, indexLabel: singleWord2.concreteNouns.correct.count.toString(), color: '#66BD7D'},
                        { legendText: 'Incorrect', y: singleWord2.concreteNouns.incorrect.count, indexLabel: singleWord2.concreteNouns.incorrect.count.toString(), color: '#f7686c'}
                    ]
                }
            ]
        });

        var singleWord2AbstractVerbs = new CanvasJS.Chart('singleWord2Pie6', {
            title:{
                text: 'Single Word Part 2 Abstract Verbs',
                fontSize: 16
            },
            legend: {
                maxWidth: 180,
                itemWidth: 100
            },
            data: [
                {
                    type: 'pie',
                    showInLegend: true,
                    dataPoints: [
                        { legendText: 'Correct', y: singleWord2.abstractVerbs.correct.count, indexLabel: singleWord2.abstractVerbs.correct.count.toString(), color: '#66BD7D'},
                        { legendText: 'Incorrect', y: singleWord2.abstractVerbs.incorrect.count, indexLabel: singleWord2.abstractVerbs.incorrect.count.toString(), color: '#f7686c'}
                    ]
                }
            ]
        });

        var singleWord2ConcreteVerbs = new CanvasJS.Chart('singleWord2Pie7', {
            title:{
                text: 'Single Word Part 2 Concrete Verbs',
                fontSize: 16
            },
            legend: {
                maxWidth: 180,
                itemWidth: 100
            },
            data: [
                {
                    type: 'pie',
                    showInLegend: true,
                    dataPoints: [
                        { legendText: 'Correct', y: singleWord2.concreteVerbs.correct.count, indexLabel: singleWord2.concreteVerbs.correct.count.toString(), color: '#66BD7D'},
                        { legendText: 'Incorrect', y: singleWord2.concreteVerbs.incorrect.count, indexLabel: singleWord2.concreteVerbs.incorrect.count.toString(), color: '#f7686c'}
                    ]
                }
            ]
        });

        var sentence1Totals = new CanvasJS.Chart('sentence1Pie1', {
            title:{
                text: 'Sentence Part 1 All Answers',
                fontSize: 16
            },
            legend: {
                maxWidth: 180,
                itemWidth: 100
            },
            data: [
                {
                    type: 'pie',
                    showInLegend: true,
                    dataPoints: [
                        { legendText: 'Correct', y: sentence1.total.correct.count, indexLabel: sentence1.total.correct.count.toString(), color: '#66BD7D'},
                        { legendText: 'Incorrect', y: sentence1.total.incorrect.count, indexLabel: sentence1.total.incorrect.count.toString(), color: '#f7686c'}
                    ]
                }
            ]
        });

        var sentence2Totals = new CanvasJS.Chart('sentence2Pie1', {
            title:{
                text: 'Sentence Part 1 All Answers',
                fontSize: 16
            },
            legend: {
                maxWidth: 180,
                itemWidth: 100
            },
            data: [
                {
                    type: 'pie',
                    showInLegend: true,
                    dataPoints: [
                        { legendText: 'Correct', y: sentence2.total.correct.count, indexLabel: sentence2.total.correct.count.toString(), color: '#66BD7D'},
                        { legendText: 'Incorrect', y: sentence2.total.incorrect.count, indexLabel: sentence2.total.incorrect.count.toString(), color: '#f7686c'}
                    ]
                }
            ]
        });

        var paragraphTotals = new CanvasJS.Chart('paragraphPie1', {
            title:{
                text: 'Paragraph All Answers',
                fontSize: 16
            },
            legend: {
                maxWidth: 180,
                itemWidth: 100
            },
            data: [
                {
                    type: 'pie',
                    showInLegend: true,
                    dataPoints: [
                        { legendText: 'Correct', y: paragraph.total.correct.count, indexLabel: paragraph.total.correct.count.toString(), color: '#66BD7D'},
                        { legendText: 'Incorrect', y: paragraph.total.incorrect.count, indexLabel: paragraph.total.incorrect.count.toString(), color: '#f7686c'}
                    ]
                }
            ]
        });

        singleWord1ResponseTimes.render();
        singleWord1Totals.render();
        singleWord1Nouns.render();
        singleWord1Verbs.render();
        singleWord1AbstractNouns.render();
        singleWord1ConcreteNouns.render();
        singleWord1AbstractVerbs.render();
        singleWord1ConcreteVerbs.render();

        singleWord2ResponseTimes.render();
        singleWord2Totals.render();
        singleWord2Nouns.render();
        singleWord2Verbs.render();
        singleWord2AbstractNouns.render();
        singleWord2ConcreteNouns.render();
        singleWord2AbstractVerbs.render();
        singleWord2ConcreteVerbs.render();

        sentence1Totals.render();

        sentence2Totals.render();

        paragraphTotals.render();

        //Setting up color scale for use in ranking repsonse times
        var singleWord1TimeRanked = $window._.sortBy($window._.map($window._.remove($window._.cloneDeep(tableRows.singleWord1), function(row){
            return row.time !== '';
        }, 'time'), 'time'));

        var singleWord2TimeRanked = $window._.sortBy($window._.map($window._.remove($window._.cloneDeep(tableRows.singleWord2), function(row){
            return row.time !== '';
        }, 'time'), 'time'));

        var sentence1TimeRanked = $window._.sortBy($window._.map($window._.remove($window._.cloneDeep(tableRows.sentence1), function(row){
            return row.time !== '';
        }, 'time'), 'time'));

        var sentence2TimeRanked = $window._.sortBy($window._.map($window._.remove($window._.cloneDeep(tableRows.sentence2), function(row){
            return row.time !== '';
        }, 'time'), 'time'));

        var paragraphTimeRanked = $window._.sortBy($window._.map($window._.remove($window._.cloneDeep(tableRows.paragraph), function(row){
            return row.time !== '';
        }, 'time'), 'time'));

        var paragraphReadingTimeRanked = $window._.sortBy($window._.map($window._.remove($window._.cloneDeep(tableRows.paragraph), function(row){
            return row.readingTime !== '';
        }, 'readingTime'), 'readingTime'));

        var singleWord1Colors = $window.chroma.scale(['66bd7d', 'b6d382', 'ffe188', 'fa9c78', 'f7686c']).colors(singleWord1TimeRanked.length);
        var singleWord2Colors = $window.chroma.scale(['66bd7d', 'b6d382', 'ffe188', 'fa9c78', 'f7686c']).colors(singleWord2TimeRanked.length);
        var sentence1Colors = $window.chroma.scale(['66bd7d', 'b6d382', 'ffe188', 'fa9c78', 'f7686c']).colors(sentence1TimeRanked.length);
        var sentence2Colors = $window.chroma.scale(['66bd7d', 'b6d382', 'ffe188', 'fa9c78', 'f7686c']).colors(sentence2TimeRanked.length);
        var paragraphColors = $window.chroma.scale(['66bd7d', 'b6d382', 'ffe188', 'fa9c78', 'f7686c']).colors(paragraphTimeRanked.length);
        var paragraphReadingColors = $window.chroma.scale(['66bd7d', 'b6d382', 'ffe188', 'fa9c78', 'f7686c']).colors(paragraphReadingTimeRanked.length);

        console.log(tableRows);

        // Only pt supported (not mm or in)
        var doc = new jsPDF('p', 'pt');
        doc.text(20, 30, 'Single Word Comprehension: Part 1');

        doc.autoTable(singleWordColumns, tableRows.singleWord1, {
            theme: 'grid',
            styles: {
                halign: 'center',
                valign: 'middle',
                font: 'helvetica'
            },
            headerStyles: {
                fillColor: 50,
                textColor: 50,
                fillStyle: 'S'
            },
            createdCell: function (cell, data) {

                switch(data.column.dataKey){
                    case 'targetWord':
                        if(data.row.raw.answer === cell.text){
                            cell.styles.fillColor = [102, 189, 125];
                            cell.styles.textColor = [36,73,0];
                        }
                        break;
                    case 'distractor1':
                        if(data.row.raw.answer === cell.text){
                            cell.styles.fillColor = [247, 104, 108];
                            cell.styles.textColor = [91,31,20];
                        }
                        break;
                    case 'distractor2':
                        if(data.row.raw.answer === cell.text){
                            cell.styles.fillColor = [247, 104, 108];
                            cell.styles.textColor = [91,31,20];
                        }
                        break;
                    case 'nounVerb':
                        break;
                    case 'concreteAbstract':
                        break;
                    case 'time':

                        if(cell.raw !== ''){
                            cell.styles.fillColor = $window.chroma.hex(singleWord1Colors[singleWord1TimeRanked.indexOf(cell.raw)]).alpha(0.5).rgb();
                            cell.styles.textColor = [0,0,0];
                        }

                        break;
                    case 'answer':
                        break;
                }
            }
        });

        doc.addImage(document.getElementById('singleWord1BarChart').firstChild.firstChild.toDataURL('image/png'), 'PNG', 40, 480, 512, 340);

        doc.addPage();

        doc.addImage(document.getElementById('singleWord1Pie1').firstChild.firstChild.toDataURL('image/png'), 'PNG', 40, 40, 250, 333);
        doc.addImage(document.getElementById('singleWord1Pie2').firstChild.firstChild.toDataURL('image/png'), 'PNG', 290, 40, 250, 333);
        doc.addImage(document.getElementById('singleWord1Pie3').firstChild.firstChild.toDataURL('image/png'), 'PNG', 40, 390, 250, 333);
        doc.addImage(document.getElementById('singleWord1Pie4').firstChild.firstChild.toDataURL('image/png'), 'PNG', 290, 390, 250, 333);

        doc.addPage();

        doc.addImage(document.getElementById('singleWord1Pie5').firstChild.firstChild.toDataURL('image/png'), 'PNG', 40, 40, 250, 333);
        doc.addImage(document.getElementById('singleWord1Pie6').firstChild.firstChild.toDataURL('image/png'), 'PNG', 290, 40, 250, 333);
        doc.addImage(document.getElementById('singleWord1Pie7').firstChild.firstChild.toDataURL('image/png'), 'PNG', 180, 390, 250, 333);

        doc.addPage();
        doc.text(20, 30, 'Single Word Comprehension: Part 2');

        doc.autoTable(singleWordColumns, tableRows.singleWord2, {
            theme: 'grid',
            styles: {
                halign: 'center',
                valign: 'middle',
                font: 'helvetica'
            },
            headerStyles: {
                fillColor: 50,
                textColor: 50,
                fillStyle: 'S'
            },
            createdCell: function (cell, data) {

                switch(data.column.dataKey){
                    case 'targetWord':
                        if(data.row.raw.answer === cell.text){
                            cell.styles.fillColor = [102, 189, 125];
                            cell.styles.textColor = [36,73,0];
                        }
                        break;
                    case 'distractor1':
                        if(data.row.raw.answer === cell.text){
                            cell.styles.fillColor = [247, 104, 108];
                            cell.styles.textColor = [91,31,20];
                        }
                        break;
                    case 'distractor2':
                        if(data.row.raw.answer === cell.text){
                            cell.styles.fillColor = [247, 104, 108];
                            cell.styles.textColor = [91,31,20];
                        }
                        break;
                    case 'nounVerb':
                        break;
                    case 'concreteAbstract':
                        break;
                    case 'time':

                        if(cell.raw !== ''){
                            cell.styles.fillColor = $window.chroma.hex(singleWord2Colors[singleWord2TimeRanked.indexOf(cell.raw)]).alpha(0.5).rgb();
                            cell.styles.textColor = [0,0,0];
                        }

                        break;
                    case 'answer':
                        break;
                }
            }
        });

        doc.addImage(document.getElementById('singleWord2BarChart').firstChild.firstChild.toDataURL('image/png'), 'PNG', 40, 480, 512, 340);

        doc.addPage();

        doc.addImage(document.getElementById('singleWord2Pie1').firstChild.firstChild.toDataURL('image/png'), 'PNG', 40, 40, 250, 333);
        doc.addImage(document.getElementById('singleWord2Pie2').firstChild.firstChild.toDataURL('image/png'), 'PNG', 290, 40, 250, 333);
        doc.addImage(document.getElementById('singleWord2Pie3').firstChild.firstChild.toDataURL('image/png'), 'PNG', 40, 390, 250, 333);
        doc.addImage(document.getElementById('singleWord2Pie4').firstChild.firstChild.toDataURL('image/png'), 'PNG', 290, 390, 250, 333);

        doc.addPage();

        doc.addImage(document.getElementById('singleWord2Pie5').firstChild.firstChild.toDataURL('image/png'), 'PNG', 40, 40, 250, 333);
        doc.addImage(document.getElementById('singleWord2Pie6').firstChild.firstChild.toDataURL('image/png'), 'PNG', 290, 40, 250, 333);
        doc.addImage(document.getElementById('singleWord2Pie7').firstChild.firstChild.toDataURL('image/png'), 'PNG', 180, 390, 250, 333);

        doc.addPage();
        doc.text(20, 30, 'Sentence Comprehension: Part 1');

        doc.autoTable(sentenceColumns, tableRows.sentence1, {
            theme: 'grid',
            styles: {
                halign: 'center',
                valign: 'middle',
                font: 'helvetica'
            },
            headerStyles: {
                fillColor: 50,
                textColor: 50,
                fillStyle: 'S'
            },
            createdCell: function (cell, data) {

                switch(data.column.dataKey){
                    case 'targetPicture':
                        if(data.row.raw.answer === cell.text){
                            cell.styles.fillColor = [102, 189, 125];
                            cell.styles.textColor = [36,73,0];
                        }
                        break;
                    case 'distractor1':
                        if(data.row.raw.answer === cell.text){
                            cell.styles.fillColor = [247, 104, 108];
                            cell.styles.textColor = [91,31,20];
                        }
                        break;
                    case 'distractor2':
                        if(data.row.raw.answer === cell.text){
                            cell.styles.fillColor = [247, 104, 108];
                            cell.styles.textColor = [91,31,20];
                        }
                        break;
                    case 'distractor3':
                        if(data.row.raw.answer === cell.text){
                            cell.styles.fillColor = [247, 104, 108];
                            cell.styles.textColor = [91,31,20];
                        }
                        break;
                    case 'time':

                        if(cell.raw !== ''){
                            cell.styles.fillColor = $window.chroma.hex(sentence1Colors[sentence1TimeRanked.indexOf(cell.raw)]).alpha(0.5).rgb();
                            cell.styles.textColor = [0,0,0];
                        }
                        break;
                    case 'answer':
                        break;
                }
            }
        });

        doc.addPage();

        doc.addImage(document.getElementById('sentence1Pie1').firstChild.firstChild.toDataURL('image/png'), 'PNG', 40, 40, 250, 333);

        doc.addPage();
        doc.text(20, 30, 'Sentence Comprehension: Part 2');

        doc.autoTable(sentenceColumns, tableRows.sentence2, {
            theme: 'grid',
            styles: {
                halign: 'center',
                valign: 'middle',
                font: 'helvetica'
            },
            headerStyles: {
                fillColor: 50,
                textColor: 50,
                fillStyle: 'S'
            },
            createdCell: function (cell, data) {

                switch(data.column.dataKey){
                    case 'targetPicture':
                        if(data.row.raw.answer === cell.text){
                            cell.styles.fillColor = [102, 189, 125];
                            cell.styles.textColor = [36,73,0];
                        }
                        break;
                    case 'distractor1':
                        if(data.row.raw.answer === cell.text){
                            cell.styles.fillColor = [247, 104, 108];
                            cell.styles.textColor = [91,31,20];
                        }
                        break;
                    case 'distractor2':
                        if(data.row.raw.answer === cell.text){
                            cell.styles.fillColor = [247, 104, 108];
                            cell.styles.textColor = [91,31,20];
                        }
                        break;
                    case 'distractor3':
                        if(data.row.raw.answer === cell.text){
                            cell.styles.fillColor = [247, 104, 108];
                            cell.styles.textColor = [91,31,20];
                        }
                        break;
                    case 'time':

                        if(cell.raw !== ''){
                            cell.styles.fillColor = $window.chroma.hex(sentence2Colors[sentence2TimeRanked.indexOf(cell.raw)]).alpha(0.5).rgb();
                            cell.styles.textColor = [0,0,0];
                        }

                        break;
                    case 'answer':
                        break;
                }
            }
        });

        doc.addPage();

        doc.addImage(document.getElementById('sentence2Pie1').firstChild.firstChild.toDataURL('image/png'), 'PNG', 40, 40, 250, 333);

        doc.addPage();
        doc.text(20, 30, 'Paragraph Comprehension: Part 2');

        doc.autoTable(paragraphColumns, tableRows.paragraph, {
            theme: 'grid',
            styles: {
                halign: 'center',
                valign: 'middle',
                font: 'helvetica'
            },
            headerStyles: {
                fillColor: 50,
                textColor: 50,
                fillStyle: 'S'
            },
            createdCell: function (cell, data) {

                switch(data.column.dataKey){
                    case 'target':
                        if(data.row.raw.answer === cell.text){
                            cell.styles.fillColor = [102, 189, 125];
                            cell.styles.textColor = [36,73,0];
                        }
                        break;
                    case 'distractor1':
                        if(data.row.raw.answer === cell.text){
                            cell.styles.fillColor = [247, 104, 108];
                            cell.styles.textColor = [91,31,20];
                        }
                        break;
                    case 'distractor2':
                        if(data.row.raw.answer === cell.text){
                            cell.styles.fillColor = [247, 104, 108];
                            cell.styles.textColor = [91,31,20];
                        }
                        break;
                    case 'time':

                        if(cell.raw !== ''){
                            cell.styles.fillColor = $window.chroma.hex(paragraphColors[paragraphTimeRanked.indexOf(cell.raw)]).alpha(0.5).rgb();
                            cell.styles.textColor = [0,0,0];
                        }

                        break;
                    case 'readingTime':

                        if(cell.raw !== ''){
                            cell.styles.fillColor = $window.chroma.hex(paragraphReadingColors[paragraphReadingTimeRanked.indexOf(cell.raw)]).alpha(0.5).rgb();
                            cell.styles.textColor = [0,0,0];
                        }

                        break;
                    case 'answer':
                        break;
                }
            },
            drawCell: function (cell, data) {

                // Rowspan
                if (data.column.dataKey === 'item') {

                    if (data.row.index % data.row.raw.questionCount === 0) {
                        doc.rect(cell.x, cell.y, cell.width, cell.height * data.row.raw.questionCount, 'S');
                        doc.autoTableText(cell.raw + '', cell.x + cell.width / 2, cell.y + cell.height * data.row.raw.questionCount / 2, {
                            halign: 'center',
                            valign: 'middle'
                        });
                    }
                    return false;
                }

                if (data.column.dataKey === 'readingTime') {

                    if (data.row.index % data.row.raw.questionCount === 0) {
                        doc.rect(cell.x, cell.y, cell.width, cell.height * data.row.raw.questionCount, 'DF');
                        doc.autoTableText(cell.raw + '', cell.x + cell.width / 2, cell.y + cell.height * data.row.raw.questionCount / 2, {
                            halign: 'center',
                            valign: 'middle'
                        });
                    }
                    return false;
                }
            }
        });

        doc.addPage();

        doc.addImage(document.getElementById('paragraphPie1').firstChild.firstChild.toDataURL('image/png'), 'PNG', 40, 40, 250, 333);

        //doc.addImage(myBarChart.toBase64Image('image/png', 1.0), 'PNG', 40, 160, 515 ,257);
        doc.save('table.pdf');

    };

});
