'use strict';

/**
 * @ngdoc function
 * @name rcaApp.controller:ReportCtrl
 * @description
 * # ReportCtrl
 * Controller of the rcaApp
 */
angular.module('rcaApp')
    .controller('ReportCtrl', function ($scope,$window,Report) {
        $scope.report = Report;

        var columns = [
            {title: '', dataKey: 'rowNumber'},
            {title: 'Item', dataKey: 'item'},
            {title: 'Target Word', dataKey: 'targetWord'},
            {title: 'Distractor 1', dataKey: 'distractor1'},
            {title: 'Distractor 2', dataKey: 'distractor2'},
            {title: 'Noun/Verb', dataKey: 'nounVerb'},
            {title: 'Concrete/Abstract', dataKey: 'concreteAbstract'},
            {title: 'Time', dataKey: 'time'},
            {title: 'Answer', dataKey: 'answer'}
        ];
        
        var rows = [
            {
                rowNumber: 1,
                item: 'Door',
                targetWord: 'Window',
                distractor1: 'Star',
                distractor2: 'Bottle',
                nounVerb: 'N',
                concreteAbstract: 'C',
                time: '',
                answer: ''
            },
            {
                rowNumber: 2,
                item: 'Street',
                targetWord: 'Road',
                distractor1: 'Moon',
                distractor2: 'Fork',
                nounVerb: 'N',
                concreteAbstract: 'C',
                time: 16.86915,
                answer: 'A'
            },
            {
                rowNumber: 3,
                item: 'Book',
                targetWord: 'Page',
                distractor1: 'Fence',
                distractor2: 'Wine',
                nounVerb: 'N',
                concreteAbstract: 'C',
                time: 5.10273,
                answer: 'A'
            }
        ];

        var data = {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [
                {
                    label: "My First dataset",
                    fill: true,
                    backgroundColor: "rgba(220,220,220,0.8)",
                    borderColor: "rgba(220,220,220,0.8)",
                    borderWidth: 1,
                    hoverBackgroundColor: "rgba(220,220,220,1)",
                    hoverBorderColor: "rgba(220,220,220,1)",
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: "My Second dataset",
                    backgroundColor: "rgba(151,187,205,0.8)",
                    borderColor: "rgba(151,187,205,0.8)",
                    borderWidth: 1,
                    hoverBackgroundColor: "rgba(151,187,205,1)",
                    hoverBorderColor: "rgba(151,187,205,1)",
                    data: [28, 48, 40, 19, 86, 27, 90]
                }
            ]
        };

        var ctx = document.getElementById('chart').getContext("2d");

        var myBarChart = new $window.Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                responsiveAnimationDuration: 0,
                animation : false
            }
        }, {});

        myBarChart.onComplete = function() {
            //console.log('animation complete');
        };

        //Setting up color scale for use in ranking repsonse times
        var timeRanked = $window._.sortBy($window._.map($window._.remove($window._.cloneDeep(rows), function(row){
            return row.time !== ''
        }, 'time'), 'time'));
        var colors = chroma.scale(['66bd7d', 'b6d382', 'ffe188', 'fa9c78', 'f7686c']).colors(timeRanked.length);

        // Only pt supported (not mm or in)
        var doc = new jsPDF('p', 'pt');
        doc.autoTable(columns, rows, {
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

                //console.log(cell);
                //console.log(data);

                switch(data.column.dataKey){
                    case 'targetWord':
                        cell.styles.fillColor = [178,255,102];
                        cell.styles.textColor = [51,102,0];
                        break;
                    case 'distractor1':
                        break;
                    case 'distractor2':
                        break;
                    case 'nounVerb':
                        break;
                    case 'concreteAbstract':
                        break;
                    case 'time':

                        if(cell.raw !== ''){
                            cell.styles.fillColor = $window.chroma.hex(colors[timeRanked.indexOf(cell.raw)]).alpha(0.5).rgb();
                            cell.styles.textColor = [0,0,0];
                        }

                        break;
                    case 'answer':
                        break;
                }
            }
        });
        doc.addImage(myBarChart.toBase64Image("image/png", 1.0), 'PNG', 40, 160, 515 ,257);
        doc.save('table.pdf');
    });
