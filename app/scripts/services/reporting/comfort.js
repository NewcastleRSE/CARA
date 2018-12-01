'use strict';

/**
 * @ngdoc service
 * @name rcaApp.assessment
 * @description
 * # assessment
 * Service in the rcaApp.
 */
angular.module('rcaApp').service('Comfort', function ($window) {

    function comfortSetup() {
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
          {title: 'Distracter 1', dataKey: 'distractor1'},
          {title: 'Distracter 2', dataKey: 'distractor2'},
          {title: 'Noun/Verb', dataKey: 'nounVerb'},
          {title: 'Concrete/Abstract', dataKey: 'concreteAbstract'}
        ],
        rows: [],
        summaryRows: [],
        colours: [],
        timeRank: []
      };
    }

    this.calculate = function(data){

        var comfort = comfortSetup();

        comfort.time.startTime = new Date(data[0].started);
        comfort.time.endTime = new Date(data[data.length - 1].finished);
        comfort.time.duration = comfort.time.endTime - comfort.time.startTime;
        comfort.time.average = $window._.meanBy(data, 'timeTaken');

            //Data for colour coded response time table
            data.forEach(function (response, index) {

                var distractors = $window._.remove(response.answers, function (answer) {
                    return answer !== response.correctAnswer;
                });

                comfort.rows.push({
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
            
            return comfort;
        };
});
