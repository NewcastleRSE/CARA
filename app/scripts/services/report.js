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

        assessment.questions['singleWord-part-1'].items.forEach(function(response, index){

            var distractors = $window._.remove(response.answers, function(answer){
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

        assessment.questions['singleWord-part-2'].items.forEach(function(response, index){

            var distractors = $window._.remove(response.answers, function(answer){
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

        assessment.questions['sentence-part-1'].items.forEach(function(response, index){

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

        assessment.questions['sentence-part-2'].items.forEach(function(response, index){

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

        assessment.questions['paragraph'].items.forEach(function(response, index){

            var item = 'P' + (index + 1);
            var readingTime = response.timeTaken / 1000;

            response.questions.forEach(function(question){

                var distractors = $window._.remove(question.answers, function(answer){
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

        console.log(ctx);

        var myBarChart = new $window.Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                responsiveAnimationDuration: 0,
                animation : false
            }
        }, {});

        myBarChart.onComplete = function() {
            console.log('animation complete');
        };

        //Setting up color scale for use in ranking repsonse times
        var singleWord1TimeRanked = $window._.sortBy($window._.map($window._.remove($window._.cloneDeep(tableRows.singleWord1), function(row){
            return row.time !== ''
        }, 'time'), 'time'));

        var singleWord2TimeRanked = $window._.sortBy($window._.map($window._.remove($window._.cloneDeep(tableRows.singleWord2), function(row){
            return row.time !== ''
        }, 'time'), 'time'));

        var sentence1TimeRanked = $window._.sortBy($window._.map($window._.remove($window._.cloneDeep(tableRows.sentence1), function(row){
            return row.time !== ''
        }, 'time'), 'time'));

        var sentence2TimeRanked = $window._.sortBy($window._.map($window._.remove($window._.cloneDeep(tableRows.sentence2), function(row){
            return row.time !== ''
        }, 'time'), 'time'));

        var paragraphTimeRanked = $window._.sortBy($window._.map($window._.remove($window._.cloneDeep(tableRows.paragraph), function(row){
            return row.time !== ''
        }, 'time'), 'time'));

        var paragraphReadingTimeRanked = $window._.sortBy($window._.map($window._.remove($window._.cloneDeep(tableRows.paragraph), function(row){
            return row.readingTime !== ''
        }, 'readingTime'), 'readingTime'));

        var singleWord1Colors = chroma.scale(['66bd7d', 'b6d382', 'ffe188', 'fa9c78', 'f7686c']).colors(singleWord1TimeRanked.length);
        var singleWord2Colors = chroma.scale(['66bd7d', 'b6d382', 'ffe188', 'fa9c78', 'f7686c']).colors(singleWord2TimeRanked.length);
        var sentence1Colors = chroma.scale(['66bd7d', 'b6d382', 'ffe188', 'fa9c78', 'f7686c']).colors(sentence1TimeRanked.length);
        var sentence2Colors = chroma.scale(['66bd7d', 'b6d382', 'ffe188', 'fa9c78', 'f7686c']).colors(sentence2TimeRanked.length);
        var paragraphColors = chroma.scale(['66bd7d', 'b6d382', 'ffe188', 'fa9c78', 'f7686c']).colors(paragraphTimeRanked.length);
        var paragraphReadingColors = chroma.scale(['66bd7d', 'b6d382', 'ffe188', 'fa9c78', 'f7686c']).colors(paragraphReadingTimeRanked.length);

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
                    case 'answer':
                        break;
                }
            }
        });

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

        //doc.addImage(myBarChart.toBase64Image("image/png", 1.0), 'PNG', 40, 160, 515 ,257);
        doc.save('table.pdf');

    };

});
