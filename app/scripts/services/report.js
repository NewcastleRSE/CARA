'use strict';

/**
 * @ngdoc service
 * @name rcaApp.assessment
 * @description
 * # assessment
 * Service in the rcaApp.
 */
angular.module('rcaApp')
  .service('Report', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var Report = {};

    Report.SingleWordPart1 = {
        AverageTime: {
            Total: 11.48,
            Nouns: 11.53,
            Verbs: 11.44,
            AbstractNouns: 19.21,
            ConcreteNouns: 9.61,
            AbstractVerbs: 13.40,
            ConcreteVerbs: 8.83
        },
        Scores: {
            Total: {
                Correct: 12,
                Incorrect: 8
            },
            Nouns: {
                Correct: 5,
                Incorrect: 5
            },
            Verbs: {
                Correct: 12,
                Incorrect: 8
            },
            AbstractNouns: {
                Correct: 1,
                Incorrect: 4
            },
            ConcreteNouns: {
                Correct: 4,
                Incorrect: 1
            },
            AbstractVerbs: {
                Correct: 4,
                Incorrect: 1
            },
            ConcreteVerbs: {
                Correct: 3,
                Incorrect: 2
            }
        },
        Positions: {
            BottomLeft: 3,
            BottomMiddle: 6,
            BottomRight: 8,
            NoResponse: 3
        },
        ColorScale: ['#006400', '#076b00', '#197400', '#2d7f00', '#438c00', '#5c9c00', '#79ae00', '#99c200', '#bed900', '#e8f200', '#fff600', '#fee200', '#f9cc00', '#f2b600', '#e79e00', '#da8500', '#ca6b01', '#b75001', '#a23102', '#8b0000']
    };

    return Report;
  });
