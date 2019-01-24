'use strict';

/**
 * @ngdoc service
 * @name rcaApp.assessment
 * @description
 * # assessment
 * Service in the rcaApp.
 */
angular.module('rcaApp').service('Questionnaire', function ($window) {

    function questionnaireSetup() {
      return {
        time: {
          startTime: null,
          endTime: null,
          duration: null
        },
        columns: [
          {title: '', dataKey: 'rowNumber'},
          {title: 'Time', dataKey: 'time'},
          {title: 'Question', dataKey: 'question'},
          {title: 'Answer', dataKey: 'answer'},
        ],
        rows: [],
        colours: [],
        timeRank: []
      };
    }

    this.calculate = function(data){

        var questionnaire = questionnaireSetup();

        questionnaire.time.startTime = new Date(data[0].started);
        questionnaire.time.endTime = new Date(data[data.length - 1].finished);
        questionnaire.time.duration = questionnaire.time.endTime - questionnaire.time.startTime;
        questionnaire.time.average = $window._.meanBy(data, 'timeTaken');

        var total = 0;

        //Data for colour coded response time table
        data.forEach(function (response, index) {

            total = total + response.answerGiven;

            questionnaire.rows.push({
              rowNumber: index + 1,
              question: response.question.replace(/[_]/g, ''),
              answer: response.answerGiven.replace('At the moment ') + '/5',
              time: response.timeTaken / 1000
            });
        });

        questionnaire.rows.push({
          rowNumber: '',
          question: 'Total',
          answer: total + '/35',
          time: ''
        });

        questionnaire.timeRank = $window._.sortBy($window._.map($window._.remove($window._.cloneDeep(questionnaire.rows), function(row){
          return row.time !== '';
        }, 'time'), 'time'));

        questionnaire.colours = $window.chroma.scale(['66bd7d', 'b6d382', 'ffe188', 'fa9c78', 'f7686c']).colors(questionnaire.timeRank.length);
        
        console.log(questionnaire);

        return questionnaire;
    };
});
