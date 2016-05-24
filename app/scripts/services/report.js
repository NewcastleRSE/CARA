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

        console.log(assessment);

        var summarySingleWordColumns = [
            {title: 'Concrete', dataKey: 'concreteLabel'},
            {title: '', dataKey: 'concreteValue'},
            {title: 'Abstract', dataKey: 'abstractLabel'},
            {title: '', dataKey: 'abstractValue'},
            {title: '', dataKey: 'totalLabel'},
            {title: '', dataKey: 'totalValue'}
        ];

        var summarySentenceColumns = [
            {title: '', dataKey: 'type'},
            {title: 'Non-Reversible', dataKey: 'nonReversible'},
            {title: 'Reversible', dataKey: 'reversible'},
            {title: 'Total', dataKey: 'total'}
        ];

        var summaryParagraphColumns = [
            {title: 'Length', dataKey: 'length'},
            {title: 'Paragraphs', dataKey: 'paragraphs'},
            {title: '', dataKey: 'lengthScore'},
            {title: 'Question Type', dataKey: 'questionType'},
            {title: '', dataKey: 'typeScore'}
        ];


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

            summarySingleWordUnrelated: [],
            summarySingleWordRelated: [],
            summarySentence: [],
            summaryParagraph: [],
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

        tableRows.summarySingleWordUnrelated.push({
            concreteLabel: 'Nouns',
            concreteValue: singleWord1.concreteNouns.correct.count,
            abstractLabel: 'Nouns',
            abstractValue: singleWord1.abstractNouns.correct.count,
            totalLabel: 'Total Nouns/10',
            totalValue: singleWord1.nouns.correct.count
        });

        tableRows.summarySingleWordUnrelated.push({
            concreteLabel: 'Verbs',
            concreteValue: singleWord1.concreteVerbs.correct.count,
            abstractLabel: 'Verbs',
            abstractValue: singleWord1.abstractVerbs.correct.count,
            totalLabel: 'Total Verbs/10',
            totalValue: singleWord1.verbs.correct.count
        });

        tableRows.summarySingleWordUnrelated.push({
            concreteLabel: 'Total',
            concreteValue: singleWord1.concreteNouns.correct.count + singleWord1.concreteVerbs.correct.count,
            abstractLabel: 'Total',
            abstractValue: singleWord1.abstractNouns.correct.count + singleWord1.abstractVerbs.correct.count,
            totalLabel: 'Total/20',
            totalValue: singleWord1.total.correct.count
        });
        
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

        tableRows.summarySingleWordRelated.push({
            concreteLabel: 'Nouns',
            concreteValue: singleWord2.concreteNouns.correct.count,
            abstractLabel: 'Nouns',
            abstractValue: singleWord2.abstractNouns.correct.count,
            totalLabel: 'Total Nouns/10',
            totalValue: singleWord2.nouns.correct.count
        });

        tableRows.summarySingleWordRelated.push({
            concreteLabel: 'Verbs',
            concreteValue: singleWord2.concreteVerbs.correct.count,
            abstractLabel: 'Verbs',
            abstractValue: singleWord2.abstractVerbs.correct.count,
            totalLabel: 'Total Verbs/10',
            totalValue: singleWord2.verbs.correct.count
        });

        tableRows.summarySingleWordRelated.push({
            concreteLabel: 'Total',
            concreteValue: singleWord2.concreteNouns.correct.count + singleWord2.concreteVerbs.correct.count,
            abstractLabel: 'Total',
            abstractValue: singleWord2.abstractNouns.correct.count + singleWord2.abstractVerbs.correct.count,
            totalLabel: 'Total/20',
            totalValue: singleWord2.total.correct.count
        });

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

        tableRows.summarySentence.push({
            type: 'Phrases',
            nonReversible: '/6',
            reversible: '',
            total: '/6'
        });

        tableRows.summarySentence.push({
            type: 'Simple',
            nonReversible: '/28',
            reversible: '/9',
            total: '/37'
        });

        tableRows.summarySentence.push({
            type: 'Complex',
            nonReversible: '',
            reversible: '/14',
            total: '/14'
        });

        tableRows.summarySentence.push({
            type: 'Total',
            nonReversible: '/34',
            reversible: '/23',
            total: '/57'
        });


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

        tableRows.summaryParagraph.push({
            length: '< 40 Words',
            paragraphs: 'Paragraphs 1 & 2',
            lengthScore: '/4',
            questionType: 'Main ideas stated',
            typeScore: '/15'
        });

        tableRows.summaryParagraph.push({
            length: '41-60 Words',
            paragraphs: 'Paragraph 3-7',
            lengthScore: '/20',
            questionType: 'Main ideas implied',
            typeScore: '/13'
        });

        tableRows.summaryParagraph.push({
            length: '61-80 Words',
            paragraphs: 'Paragraphs 8-13',
            lengthScore: '/24',
            questionType: 'Details stated',
            typeScore: '/15'
        });

        tableRows.summaryParagraph.push({
            length: '100 Words',
            paragraphs: 'Paragraph 14',
            lengthScore: '/4',
            questionType: 'Details implied',
            typeScore: '/13'
        });

        tableRows.summaryParagraph.push({
            length: '> 200 Words',
            paragraphs: 'Paragraph 15',
            lengthScore: '/4',
            questionType: 'Gist',
            typeScore: '/9'
        });

        tableRows.summaryParagraph.push({
            length: '',
            paragraphs: '',
            lengthScore: '',
            questionType: 'Total',
            typeScore: '/65'
        });

        var summaryParagraphColumns = [
            {title: 'Length', dataKey: 'length'},
            {title: 'Paragraphs', dataKey: 'paragraphs'},
            {title: '', dataKey: 'lengthScore'},
            {title: 'Question Type', dataKey: 'questionType'},
            {title: '', dataKey: 'typeScore'}
        ];

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

        singleWord1ResponseTimes.render();
        singleWord2ResponseTimes.render();

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
        var doc = new $window.jsPDF('p', 'pt');
        doc.page = 1;

        function centeredText(text) {
            var textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
            return (doc.internal.pageSize.width - textWidth) / 2;
        }

        function footer() {
            doc.setFontSize(10);
            doc.text(centeredText('Page ' + doc.page + ' - ' + assessment.name), 820, 'Page ' + doc.page + ' - ' + assessment.name);
            doc.page ++;
            doc.setFontSize(12);
        }

        doc.setFontSize(32);
        doc.text(centeredText('SLT Report ' + assessment.name), 75, 'SLT Report ' + assessment.name);
        doc.setFontSize(16);
        doc.text(50, 115, 'Name:');
        doc.text(50, 145, 'Date of Birth:');
        doc.setFontSize(12);
        doc.text(50, 180, 'Notes');
        doc.rect(50, 195, 495, 550);

        footer();
        doc.addPage();

        doc.setFontSize(20);
        doc.text(50, 50, 'Summary of Results');
        doc.rect(50, 65, 495, 2, 'F');

        doc.setFontSize(16);
        doc.text(50, 100, '1. Single Word Distractors');
        doc.setFontSize(12);

        doc.text(50, 135, 'Unrelated Distractors');
        doc.autoTable(summarySingleWordColumns, tableRows.summarySingleWordUnrelated, {
            theme: 'grid',
            margin: [150, 50, 50, 50],
            styles: {
                halign: 'center',
                valign: 'middle',
                font: 'helvetica'
            },
            headerStyles: {
                fillColor: 50,
                textColor: 50,
                fillStyle: 'S'
            }
        });

        doc.text(50, 285, 'Related Distractors');
        doc.autoTable(summarySingleWordColumns, tableRows.summarySingleWordRelated, {
            theme: 'grid',
            margin: [300, 50, 50, 50],
            styles: {
                halign: 'center',
                valign: 'middle',
                font: 'helvetica'
            },
            headerStyles: {
                fillColor: 50,
                textColor: 50,
                fillStyle: 'S'
            }
        });

        footer();
        doc.addPage();

        doc.setFontSize(16);
        doc.text(50, 75, '2. Sentence Comprehension');
        doc.setFontSize(12);

        doc.autoTable(summarySentenceColumns, tableRows.summarySentence, {
            theme: 'grid',
            margin: [100, 50, 50, 50],
            styles: {
                halign: 'center',
                valign: 'middle',
                font: 'helvetica'
            },
            headerStyles: {
                fillColor: 50,
                textColor: 50,
                fillStyle: 'S'
            }
        });

        footer();
        doc.addPage();

        doc.setFontSize(16);
        doc.text(50, 75, '3. Paragraph Comprehension');
        doc.setFontSize(12);

        doc.autoTable(summaryParagraphColumns, tableRows.summaryParagraph, {
            theme: 'grid',
            margin: [100, 50, 50, 50],
            styles: {
                halign: 'center',
                valign: 'middle',
                font: 'helvetica'
            },
            headerStyles: {
                fillColor: 50,
                textColor: 50,
                fillStyle: 'S'
            }
        });

        footer();
        doc.addPage();

        doc.setFontSize(20);
        doc.text(50, 50, 'Single Word: Unrelated Distractors');
        doc.rect(50, 65, 495, 2, 'F');
        doc.setFontSize(12);

        doc.autoTable(singleWordColumns, tableRows.singleWord1, {
            theme: 'grid',
            margin: [100, 50, 50, 50],
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

        footer();
        doc.addPage();


        doc.addImage(document.getElementById('singleWord1BarChart').firstChild.firstChild.toDataURL('image/png'), 'PNG', 40, 480, 512, 340);

        footer();
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

        footer();
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

        footer();
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

        footer();
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
        
        doc.save('report-' + assessment.name + '.pdf');

    };

});
