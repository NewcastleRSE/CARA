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
          {title: 'Impossible or avoid', dataKey: 'impossible'},
          {title: 'Trying to read but difficult', dataKey: 'difficult'},
          {title: 'Trying to read but OK', dataKey: 'ok'},
          {title: 'No problem', dataKey: 'noProblem'},
          {title: 'Not applicable', dataKey: 'notApplicable'}
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

        var cols = $window._.groupBy(data, 'difficulty');

        //Data for colour coded response time table
        data.forEach(function (response, index) {

            // var distractors = $window._.remove(response.answers, function (answer) {
            //     return answer !== response.correctAnswer;
            // });

            // questionnaire.rows.push({
            //   impossible: '',
            //   difficult: ''
            // });

        });
        
        return questionnaire;
    };
});
