'use strict';

/**
 * @ngdoc service
 * @name rcaApp.assessment
 * @description
 * # assessment
 * Service in the rcaApp.
 */
angular.module('rcaApp').service('Report', function ($window, Paragraph, Sentence1, Sentence2, SingleWord1, SingleWord2) {

    return function(assessment) {

        //console.log(assessment);

        if(assessment.questions['singleWord-part-1'].completed){
            SingleWord1.calculate($window._.filter(assessment.questions['singleWord-part-1'].items, {practice: false}));
        }

        if(assessment.questions['singleWord-part-2'].completed){
            SingleWord2.calculate($window._.filter(assessment.questions['singleWord-part-2'].items, {practice: false}));
        }

        if(assessment.questions['sentence-part-1'].completed){
            Sentence1.calculate(assessment.questions['sentence-part-1'].items);
        }

        if(assessment.questions['sentence-part-2'].completed){
            Sentence2.calculate(assessment.questions['sentence-part-2'].items);
        }

        if(assessment.questions['paragraph'].completed) {
            Paragraph.calculate($window._.filter(assessment.questions['paragraph'].items, {practice: false}));
            console.log(Paragraph);
        }

        /*var singleWord1ResponseTimes = new CanvasJS.Chart('singleWord1BarChart', {
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
                        { label: 'Total', y: SingleWord1.total.correct.time },
                        { label: 'Nouns', y: SingleWord1.nouns.correct.time },
                        { label: 'Verbs', y: SingleWord1.verbs.correct.time },
                        { label: 'Abstract Nouns', y: SingleWord1.abstractNouns.correct.time },
                        { label: 'Concrete Nouns', y: SingleWord1.concreteNouns.correct.time },
                        { label: 'Abstract Verbs', y: SingleWord1.abstractVerbs.correct.time },
                        { label: 'Concrete Verbs', y: SingleWord1.concreteVerbs.correct.time }
                    ]
                },
                {
                    type: 'column',
                    color: '#f7686c',
                    name: 'Incorrect',
                    dataPoints: [
                        { label: 'Total', y: SingleWord1.total.incorrect.time },
                        { label: 'Nouns', y: SingleWord1.nouns.incorrect.time },
                        { label: 'Verbs', y: SingleWord1.verbs.incorrect.time },
                        { label: 'Abstract Nouns', y: SingleWord1.abstractNouns.incorrect.time },
                        { label: 'Concrete Nouns', y: SingleWord1.concreteNouns.incorrect.time },
                        { label: 'Abstract Verbs', y: SingleWord1.abstractVerbs.incorrect.time },
                        { label: 'Concrete Verbs', y: SingleWord1.concreteVerbs.incorrect.time }
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
                        { label: 'Total', y: SingleWord2.total.correct.time },
                        { label: 'Nouns', y: SingleWord2.nouns.correct.time },
                        { label: 'Verbs', y: SingleWord2.verbs.correct.time },
                        { label: 'Abstract Nouns', y: SingleWord2.abstractNouns.correct.time },
                        { label: 'Concrete Nouns', y: SingleWord2.concreteNouns.correct.time },
                        { label: 'Abstract Verbs', y: SingleWord2.abstractVerbs.correct.time },
                        { label: 'Concrete Verbs', y: SingleWord2.concreteVerbs.correct.time }
                    ]
                },
                {
                    type: 'column',
                    color: '#f7686c',
                    name: 'Incorrect',
                    dataPoints: [
                        { label: 'Total', y: SingleWord2.total.incorrect.time },
                        { label: 'Nouns', y: SingleWord2.nouns.incorrect.time },
                        { label: 'Verbs', y: SingleWord2.verbs.incorrect.time },
                        { label: 'Abstract Nouns', y: SingleWord2.abstractNouns.incorrect.time },
                        { label: 'Concrete Nouns', y: SingleWord2.concreteNouns.incorrect.time },
                        { label: 'Abstract Verbs', y: SingleWord2.abstractVerbs.incorrect.time },
                        { label: 'Concrete Verbs', y: SingleWord2.concreteVerbs.incorrect.time }
                    ]
                }
            ]
        });

        singleWord1ResponseTimes.render();
        singleWord2ResponseTimes.render();*/


        /****** Override to merge Sentence Scores *******/

        console.log(Sentence1);

        var sentenceSummaryTotals = [{
            type: 'Phrases',
            nonReversible: Sentence1.nonReversiblePhrases.correct.count + Sentence2.nonReversiblePhrases.correct.count + ' / 6',
            reversible: '',
            total: Sentence1.phrases.correct.count + Sentence2.phrases.correct.count + ' / 6'
        },{
            type: 'Simple',
            nonReversible: Sentence1.nonReversibleSimple.correct.count + Sentence2.nonReversibleSimple.correct.count + ' / 28',
            reversible: Sentence1.phrases.correct.count + Sentence2.phrases.correct.count + ' / 9',
            total: Sentence1.reversibleSimple.correct.count + Sentence2.reversibleSimple.correct.count + ' / 37'
        },{
            type: 'Complex',
            nonReversible: '',
            nonReversibleScore: '',
            reversible: Sentence1.reversibleComplex.correct.count + Sentence2.reversibleComplex.correct.count + ' / 14',
            total: Sentence1.complex.correct.count + Sentence2.complex.correct.count + ' / 14'
        },{
            type: 'Total',
            nonReversible: Sentence1.nonReversibleTotal.correct.count + Sentence2.nonReversibleTotal.correct.count + ' / 34',
            reversible: Sentence1.reversibleTotal.correct.count + Sentence2.reversibleTotal.correct.count + ' / 23',
            total: Sentence1.total.correct.count + Sentence2.total.correct.count + ' / 57'
        }];


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
        doc.autoTable(SingleWord1.summaryColumns, SingleWord1.summaryRows, {
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
        doc.autoTable(SingleWord2.summaryColumns, SingleWord2.summaryRows, {
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

        doc.autoTable(Sentence1.summaryColumns, sentenceSummaryTotals, {
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

        doc.autoTable(Paragraph.summaryColumns, Paragraph.summaryRows, {
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

        doc.autoTable(SingleWord1.columns, SingleWord1.rows, {
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
                            cell.styles.fillColor = $window.chroma.hex(SingleWord1.colours[SingleWord1.timeRank.indexOf(cell.raw)]).alpha(0.5).rgb();
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


        //doc.addImage(document.getElementById('singleWord1BarChart').firstChild.firstChild.toDataURL('image/png'), 'PNG', 40, 480, 512, 340);

        footer();
        doc.addPage();


        doc.text(20, 30, 'Single Word Comprehension: Part 2');

        doc.autoTable(SingleWord2.columns, SingleWord2.rows, {
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
                            cell.styles.fillColor = $window.chroma.hex(SingleWord2.colours[SingleWord2.timeRank.indexOf(cell.raw)]).alpha(0.5).rgb();
                            cell.styles.textColor = [0,0,0];
                        }

                        break;
                    case 'answer':
                        break;
                }
            }
        });

        //doc.addImage(document.getElementById('singleWord2BarChart').firstChild.firstChild.toDataURL('image/png'), 'PNG', 40, 480, 512, 340);

        footer();
        doc.addPage();

        doc.text(20, 30, 'Sentence Comprehension: Part 1');

        doc.autoTable(Sentence1.columns, Sentence1.rows, {
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
                            cell.styles.fillColor = $window.chroma.hex(Sentence1.colours[Sentence1.timeRank.indexOf(cell.raw)]).alpha(0.5).rgb();
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

        doc.autoTable(Sentence2.columns, Sentence2.rows, {
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
                            cell.styles.fillColor = $window.chroma.hex(Sentence2.colours[Sentence2.timeRank.indexOf(cell.raw)]).alpha(0.5).rgb();
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

        doc.autoTable(Paragraph.columns, Paragraph.rows, {
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
                            cell.styles.fillColor = $window.chroma.hex(Paragraph.colours[Paragraph.timeRank.indexOf(cell.raw)]).alpha(0.5).rgb();
                            cell.styles.textColor = [0,0,0];
                        }

                        break;
                    case 'readingTime':

                        if(cell.raw !== ''){
                            cell.styles.fillColor = $window.chroma.hex(Paragraph.readingColours[Paragraph.readingTimeRank.indexOf(cell.raw)]).alpha(0.5).rgb();
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
