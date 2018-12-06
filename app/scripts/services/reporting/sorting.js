'use strict';

/**
 * @ngdoc service
 * @name rcaApp.assessment
 * @description
 * # assessment
 * Service in the rcaApp.
 */
angular.module('rcaApp').service('Sorting', function ($window) {

    function sortingSetup() {
      return {
        time: {
          startTime: null,
          endTime: null,
          duration: null
        },
        columns: [
          {title: 'Impossible', dataKey: 'impossible'},
          {title: 'Difficult', dataKey: 'difficult'},
          {title: 'OK', dataKey: 'ok'},
          {title: 'No Problem', dataKey: 'noProblem'},
          {title: 'N/A', dataKey: 'notApplicable'}
        ],
        rows: [],
        colours: [],
        timeRank: []
      };
    }

    this.calculate = function(data){

        var sorting = sortingSetup();

        sorting.time.startTime = new Date(data.started);
        sorting.time.endTime = new Date(data.finished);
        sorting.time.duration = sorting.time.endTime - sorting.time.startTime;
        sorting.time.average = null;

        var groups = $window._.groupBy(data.items, 'difficulty');
        var matrix = [new Array(5), new Array(5), new Array(5), new Array(5), new Array(5)];

        Object.keys(groups).forEach(function(key){
          groups[key].forEach(function(card, index){
            matrix[parseInt(key)-1][index] = card.title;
          });
        });

        var rows = $window._.zip.apply($window._, matrix);

        rows.forEach(function(row){
          sorting.rows.push({
            notApplicable: row[0],
            impossible: row[1],
            difficult: row[2],
            ok: row[3],
            noProblem: row[4],
          });
        });
        
        return sorting;
    };
});
