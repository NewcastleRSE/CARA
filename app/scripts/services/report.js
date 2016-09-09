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
        
        console.log(assessment);

        var singleWord1 = null,
            singleWord2 = null,
            sentence1 = null,
            sentence2 = null,
            sentenceSummaryTotals = null,
            paragraph = null;


        /****** Override to merge Sentence Scores *******/

        if(assessment.questions['singleWord-part-1'].completed){
            singleWord1 = SingleWord1.calculate($window._.filter(assessment.questions['singleWord-part-1'].items, {practice: false}));
        }

        if(assessment.questions['singleWord-part-2'].completed){
            singleWord2 = SingleWord2.calculate($window._.filter(assessment.questions['singleWord-part-2'].items, {practice: false}));
        }

        if(assessment.questions['sentence-part-1'].completed){
            sentence1 = Sentence1.calculate($window._.filter(assessment.questions['sentence-part-1'].items, {practice: false}));
        }

        if(assessment.questions['sentence-part-2'].completed){
            sentence2 = Sentence2.calculate($window._.filter(assessment.questions['sentence-part-2'].items, {practice: false}));
        }

        if(assessment.questions['paragraph'].completed) {
            paragraph = Paragraph.calculate($window._.filter(assessment.questions['paragraph'].items, {practice: false}));
        }

        /****** Override to merge Sentence Scores *******/

        var sentenceSummaryTotals = [];

        if(assessment.questions['sentence-part-1'].completed || assessment.questions['sentence-part-2'].completed) {

            sentenceSummaryTotals = [{
                type: 'Phrases',
                nonReversible: (((sentence1) ? sentence1.nonReversiblePhrases.correct.count : 0 ) + ((sentence2) ? sentence2.nonReversiblePhrases.correct.count : 0 )) + ' / ' + (((sentence1) ? sentence1.nonReversiblePhrases.questionCount : 0 ) + ((sentence2) ? sentence2.nonReversiblePhrases.questionCount : 0 )),
                reversible: '',
                total: ((sentence1) ? sentence1.nonReversiblePhrases.correct.count : 0 ) + ((sentence2) ? sentence2.nonReversiblePhrases.correct.count : 0 ) + ' / ' + (((sentence1) ? sentence1.nonReversiblePhrases.questionCount : 0 ) + ((sentence2) ? sentence2.nonReversiblePhrases.questionCount : 0 ))
            },{
                type: 'Simple',
                nonReversible: ((sentence1) ? sentence1.nonReversibleSimple.correct.count : 0 ) + ((sentence2) ? sentence2.nonReversibleSimple.correct.count : 0 ) + ' / ' + (((sentence1) ? sentence1.nonReversibleSimple.questionCount : 0 ) + ((sentence2) ? sentence2.nonReversibleSimple.questionCount : 0 )),
                reversible: ((sentence1) ? sentence1.reversibleSimple.correct.count : 0 ) + ((sentence2) ? sentence2.reversibleSimple.correct.count : 0 ) + ' / ' + (((sentence1) ? sentence1.reversibleSimple.questionCount : 0 ) + ((sentence2) ? sentence2.reversibleSimple.questionCount : 0 )),
                total: ((sentence1) ? sentence1.simple.correct.count : 0 ) + ((sentence2) ? sentence2.simple.correct.count : 0 ) + ' / ' + (((sentence1) ? sentence1.simple.questionCount : 0 ) + ((sentence2) ? sentence2.simple.questionCount : 0 ))
            },{
                type: 'Complex',
                nonReversible: '',
                nonReversibleScore: '',
                reversible: ((sentence1) ? sentence1.reversibleComplex.correct.count : 0 ) + ((sentence2) ? sentence2.reversibleComplex.correct.count : 0 ) + ' / ' + (((sentence1) ? sentence1.reversibleComplex.questionCount : 0 ) + ((sentence2) ? sentence2.reversibleComplex.questionCount : 0 )),
                total: ((sentence1) ? sentence1.complex.correct.count : 0 ) + ((sentence2) ? sentence2.complex.correct.count : 0 ) + ' / ' + (((sentence1) ? sentence1.complex.questionCount : 0 ) + ((sentence2) ? sentence2.complex.questionCount : 0 ))
            },{
                type: 'Total',
                nonReversible: ((sentence1) ? sentence1.nonReversibleTotal.correct.count : 0 ) + ((sentence2) ? sentence2.nonReversibleTotal.correct.count : 0 ) + ' / ' + (((sentence1) ? sentence1.nonReversibleTotal.questionCount : 0 ) + ((sentence2) ? sentence2.nonReversibleTotal.questionCount : 0 )),
                reversible: ((sentence1) ? sentence1.reversibleTotal.correct.count : 0 ) + ((sentence2) ? sentence2.reversibleTotal.correct.count : 0 ) + ' / ' + (((sentence1) ? sentence1.reversibleTotal.questionCount : 0 ) + ((sentence2) ? sentence2.reversibleTotal.questionCount : 0 )),
                total: ((sentence1) ? sentence1.total.correct.count : 0 ) + ((sentence2) ? sentence2.total.correct.count : 0 ) + ' / ' + (((sentence1) ? sentence1.total.questionCount : 0 ) + ((sentence2) ? sentence2.total.questionCount : 0 ))
            }];
        }

        if(singleWord1 || singleWord2){

            var chartData = [];

            if(singleWord1){
                chartData.push({ label: 'Unrelated', y: singleWord1.correctAnswers.length / (singleWord1.correctAnswers.length + singleWord1.incorrectAnswers.length) });
            }

            if(singleWord2){
                chartData.push({ label: 'Related', y: singleWord2.correctAnswers.length / (singleWord2.correctAnswers.length + singleWord2.incorrectAnswers.length) });
            }

            if(singleWord1){
                chartData.push({ label: 'Pt 1 - Nouns', y: singleWord1.nouns.correct.count / (singleWord1.nouns.correct.count + singleWord1.nouns.incorrect.count) });
                chartData.push({ label: 'Pt 1 - Verbs', y: singleWord1.verbs.correct.count / (singleWord1.verbs.correct.count + singleWord1.verbs.incorrect.count) });
                chartData.push({ label: 'Pt 1 - Concrete', y: (singleWord1.concreteNouns.correct.count + singleWord1.concreteVerbs.correct.count) / (singleWord1.concreteNouns.correct.count + singleWord1.concreteVerbs.correct.count + singleWord1.concreteNouns.incorrect.count + singleWord1.concreteVerbs.incorrect.count) });
                chartData.push({ label: 'Pt 1 - Abstract', y: (singleWord1.abstractNouns.correct.count + singleWord1.abstractVerbs.correct.count) / (singleWord1.abstractNouns.correct.count + singleWord1.abstractVerbs.correct.count + singleWord1.abstractNouns.incorrect.count + singleWord1.abstractVerbs.incorrect.count) });
            }

            if(singleWord2){
                chartData.push({ label: 'Pt 2 - Nouns', y: singleWord2.nouns.correct.count / (singleWord2.nouns.correct.count + singleWord2.nouns.incorrect.count) });
                chartData.push({ label: 'Pt 2 - Verbs', y: singleWord2.verbs.correct.count / (singleWord2.verbs.correct.count + singleWord2.verbs.incorrect.count) });
                chartData.push({ label: 'Pt 2 - Concrete', y: (singleWord2.concreteNouns.correct.count + singleWord2.concreteVerbs.correct.count) / (singleWord2.concreteNouns.correct.count + singleWord2.concreteVerbs.correct.count + singleWord2.concreteNouns.incorrect.count + singleWord2.concreteVerbs.incorrect.count) });
                chartData.push({ label: 'Pt 2 - Abstract', y: (singleWord2.abstractNouns.correct.count + singleWord2.abstractVerbs.correct.count) / (singleWord2.abstractNouns.correct.count + singleWord2.abstractVerbs.correct.count + singleWord2.abstractNouns.incorrect.count + singleWord2.abstractVerbs.incorrect.count) });
            }

            var singleWordSummary = new CanvasJS.Chart('singleWordSummary', {
                title:{
                    text: 'Single Word Summary',
                    fontSize: 16
                },
                axisX: {
                    labelAngle: 135
                },
                axisY:{
                    title: 'Correct',
                    titleFontSize: 14,
                    margin: 5,
                    minimum: 0,
                    maximum: 1
                },
                data: [
                    {
                        type: 'column',
                        color: '#66BD7D',
                        name: 'Correct',
                        dataPoints: chartData
                    }
                ]
            });

            singleWordSummary.render();
        }

        if(sentence1 || sentence2){
            
            chartData = [];
            
            if(sentence1 && sentence2) {
                chartData = [
                    { label: 'Total', y: ((sentence1.total.correct.count + sentence2.total.correct.count) / (sentence1.total.questionCount + sentence2.total.questionCount)) },
                    { label: 'Non-reversible', y: ((sentence1.nonReversibleTotal.correct.count + sentence2.nonReversibleTotal.correct.count)/34) },
                    { label: 'Reversible', y: ((sentence1.reversibleTotal.correct.count + sentence2.reversibleTotal.correct.count)/23) },
                    { label: 'Phrase', y: (sentence1.phrases.correct.count + sentence2.phrases.correct.count) / (sentence1.phrases.correct.count + sentence2.phrases.correct.count + sentence1.phrases.incorrect.count + sentence2.phrases.incorrect.count) },
                    { label: 'Simple', y: (sentence1.simple.correct.count + sentence2.simple.correct.count) / (sentence1.simple.correct.count + sentence2.simple.correct.count + sentence1.simple.incorrect.count + sentence2.simple.incorrect.count) },
                    { label: 'Complex', y: (sentence1.complex.correct.count + sentence2.complex.correct.count) / (sentence1.complex.correct.count + sentence2.complex.correct.count + sentence1.complex.incorrect.count + sentence2.complex.incorrect.count) }
                ]
            }
            else if(sentence1 && !sentence2) {

                console.log(sentence1);

                chartData = [
                    { label: 'Total', y: (sentence1.total.correct.count / sentence1.total.questionCount) },
                    { label: 'Non-reversible', y: (sentence1.nonReversibleTotal.correct.count/ sentence1.nonReversibleTotal.questionCount) },
                    { label: 'Reversible', y: (sentence1.reversibleTotal.correct.count / sentence1.reversibleTotal.questionCount) },
                    { label: 'Phrase', y: (sentence1.phrases.correct.count / sentence1.phrases.questionCount) },
                    { label: 'Simple', y: (sentence1.simple.correct.count / sentence1.simple.questionCount) },
                    { label: 'Complex', y: (sentence1.complex.correct.count / sentence1.complex.questionCount) }
                ]
            }
            else {
                chartData = [
                    { label: 'Total', y: (sentence2.total.correct.count / sentence2.total.questionCount) },
                    { label: 'Non-reversible', y: (sentence2.nonReversibleTotal.correct.count/ sentence2.nonReversibleTotal.questionCount) },
                    { label: 'Reversible', y: (sentence2.reversibleTotal.correct.count / sentence2.reversibleTotal.questionCount) },
                    { label: 'Phrase', y: (sentence2.phrases.correct.count / sentence2.phrases.questionCount) },
                    { label: 'Simple', y: (sentence2.simple.correct.count / sentence2.simple.questionCount) },
                    { label: 'Complex', y: (sentence2.complex.correct.count / sentence2.complex.questionCount) }
                ]
            }
            
            var sentenceSummary = new CanvasJS.Chart('sentenceSummary', {
                title:{
                    text: 'Sentence Summary',
                    fontSize: 16
                },
                axisX: {
                    labelAngle: 135
                },
                axisY:{
                    title: '',
                    titleFontSize: 14,
                    margin: 5,
                    minimum: 0,
                    maximum: 1
                },
                data: [
                    {
                        type: 'column',
                        color: '#66BD7D',
                        name: 'Correct',
                        dataPoints: chartData
                    }
                ]
            });

            sentenceSummary.render();
        }

        if(paragraph){
            var paragraphSummary = new CanvasJS.Chart('paragraphSummary', {
                title:{
                    text: 'Paragraph Summary',
                    fontSize: 16
                },
                axisX: {
                    labelAngle: 135
                },
                axisY:{
                    title: '',
                    titleFontSize: 14,
                    margin: 5,
                    minimum: 0,
                    maximum: 1
                },
                data: [
                    {
                        type: 'column',
                        color: '#66BD7D',
                        name: 'Correct',
                        dataPoints: [
                            { label: 'Total', y: paragraph.correctAnswers.length / (paragraph.correctAnswers.length + paragraph.incorrectAnswers.length) },
                            { label: 'Main Ideas Stated', y: paragraph.mainIdeasStated.correct.count / (paragraph.mainIdeasStated.correct.count + paragraph.mainIdeasStated.incorrect.count) },
                            { label: 'Main Ideas Implied', y: paragraph.mainIdeasImplied.correct.count / (paragraph.mainIdeasImplied.correct.count + paragraph.mainIdeasImplied.incorrect.count) },
                            { label: 'Details Stated', y: paragraph.detailsStated.correct.count / (paragraph.detailsStated.correct.count + paragraph.detailsStated.incorrect.count) },
                            { label: 'Details Implied', y: paragraph.detailsImplied.correct.count / (paragraph.detailsImplied.correct.count + paragraph.detailsImplied.incorrect.count) },
                            { label: 'Gist', y: paragraph.gist.correct.count / (paragraph.gist.correct.count + paragraph.gist.incorrect.count) }
                        ]
                    }
                ]
            });

            paragraphSummary.render();
        }

        if(singleWord1 || singleWord2 || sentence1 || sentence2 || paragraph){

            var dataPoints = [];

            if(singleWord1){
                dataPoints.push({ label: 'Single Word: Unrelated', y: singleWord1.correctAnswers.length / (singleWord1.correctAnswers.length + singleWord1.incorrectAnswers.length) });
            }
            if(singleWord2){
                dataPoints.push({ label: 'Single Word: Related', y: singleWord2.correctAnswers.length / (singleWord2.correctAnswers.length + singleWord2.incorrectAnswers.length) });
            }
            if(sentence1 && sentence2){
                dataPoints.push({ label: 'Sentence', y: ((sentence1.total.correct.count + sentence2.total.correct.count) / (sentence1.total.questionCount + sentence2.total.questionCount)) });
            }
            if(sentence1 && !sentence2){
                dataPoints.push({ label: 'Sentence', y: (sentence1.total.correct.count / sentence1.total.questionCount) });
            }
            if(!sentence1 && sentence2){
                dataPoints.push({ label: 'Sentence', y: (sentence2.total.correct.count / sentence2.total.questionCount) });
            }
            if(paragraph){
                dataPoints.push({ label: 'Paragraph', y: paragraph.correctAnswers.length / (paragraph.correctAnswers.length + paragraph.incorrectAnswers.length) });
            }

            var overallSummary = new CanvasJS.Chart('overallSummary', {
                title:{
                    text: 'Overall Summary',
                    fontSize: 16
                },
                axisX: {
                    labelAngle: 135
                },
                axisY:{
                    title: '',
                    titleFontSize: 14,
                    margin: 5,
                    minimum: 0,
                    maximum: 1
                },
                data: [
                    {
                        type: 'column',
                        color: '#66BD7D',
                        name: 'Correct',
                        dataPoints: dataPoints
                    }
                ]
            });

            overallSummary.render();
        }

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
        doc.text(centeredText('SLT Report ' + assessment.name), 275, 'SLT Report ' + assessment.name);
        doc.setFontSize(16);
        doc.text(100, 365, 'Name:');
        doc.text(100, 415, 'Date of Birth:');

        doc.addPage();

        doc.setFontSize(12);
        doc.text(50, 50, 'For Clinician Notes');
        doc.rect(50, 65, 495, 680);

        footer();
        doc.addPage();

        doc.setFontSize(20);
        doc.text(50, 50, 'Summary of Results');
        doc.rect(50, 65, 495, 2, 'F');

        if(singleWord1 || singleWord2) {
            doc.setFontSize(16);
            doc.text(50, 100, '1. Single Word Distractors');
            doc.setFontSize(12);


            if(singleWord1) {
                doc.text(50, 135, 'Unrelated Distractors');
                doc.autoTable(singleWord1.summaryColumns, singleWord1.summaryRows, {
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
            }

            if(singleWord2) {
                doc.text(50, 285, 'Related Distractors');
                doc.autoTable(singleWord2.summaryColumns, singleWord2.summaryRows, {
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
            }

            if(singleWord1 && singleWord2){
                doc.addImage(document.getElementById('singleWordSummary').firstChild.firstChild.toDataURL('image/png'), 'PNG', 40, 460, 512, 340);
            }
            else if((singleWord1 && !singleWord2) || (!singleWord1 && singleWord2)){
                doc.addImage(document.getElementById('singleWordSummary').firstChild.firstChild.toDataURL('image/png'), 'PNG', 40, 285, 512, 340);
            }


        footer();
        doc.addPage();

        }

        if(assessment.questions['sentence-part-1'].completed || assessment.questions['sentence-part-2'].completed) {
            doc.setFontSize(16);

            if(assessment.questions['singleWord-part-1'].completed || assessment.questions['singleWord-part-2'].completed) {
                doc.text(50, 75, '2. Sentence Comprehension');
            }
            else {
                doc.text(50, 100, '2. Sentence Comprehension');
            }

            doc.setFontSize(12);

            doc.autoTable(sentence1.summaryColumns, sentenceSummaryTotals, {
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

            doc.addImage(document.getElementById('sentenceSummary').firstChild.firstChild.toDataURL('image/png'), 'PNG', 40, 280, 512, 340);

            footer();
            doc.addPage();
        }

        if(assessment.questions['paragraph'].completed) {
            doc.setFontSize(16);

            if(assessment.questions['sentence-part-1'].completed || assessment.questions['sentence-part-2'].completed || assessment.questions['singleWord-part-1'].completed || assessment.questions['singleWord-part-2'].completed) {
                doc.text(50, 75, '3. Paragraph Comprehension');
            }
            else {
                doc.text(50, 100, '3. Paragraph Comprehension');
            }

            doc.setFontSize(12);

            doc.autoTable(paragraph.summaryColumns, paragraph.summaryRows, {
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

            doc.addImage(document.getElementById('paragraphSummary').firstChild.firstChild.toDataURL('image/png'), 'PNG', 40, 260, 512, 340);

            footer();
            doc.addPage();
        }

        if(singleWord1 || singleWord2 || (sentence1 && sentence2) || paragraph){
            doc.setFontSize(16);
            doc.text(50, 75, '4. Overall Summary');
            doc.setFontSize(12);

            doc.addImage(document.getElementById('overallSummary').firstChild.firstChild.toDataURL('image/png'), 'PNG', 40, 100, 512, 340);

            footer();
            doc.addPage();
        }

        if(assessment.questions['singleWord-part-1'].completed) {

            doc.setFontSize(20);
            doc.text(50, 50, 'Single Word: Unrelated Distractors');
            doc.rect(50, 65, 495, 2, 'F');
            doc.setFontSize(12);

            doc.autoTable(singleWord1.columns, singleWord1.rows, {
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

                    switch (data.column.dataKey) {
                        case 'targetWord':
                            if (data.row.raw.answer === cell.text) {
                                cell.styles.fillColor = [102, 189, 125];
                                cell.styles.textColor = [36, 73, 0];
                            }
                            break;
                        case 'distractor1':
                            if (data.row.raw.answer === cell.text) {
                                cell.styles.fillColor = [247, 104, 108];
                                cell.styles.textColor = [91, 31, 20];
                            }
                            break;
                        case 'distractor2':
                            if (data.row.raw.answer === cell.text) {
                                cell.styles.fillColor = [247, 104, 108];
                                cell.styles.textColor = [91, 31, 20];
                            }
                            break;
                        case 'nounVerb':
                            break;
                        case 'concreteAbstract':
                            break;
                        case 'time':

                            if (cell.raw !== '') {
                                cell.styles.fillColor = $window.chroma.hex(singleWord1.colours[singleWord1.timeRank.indexOf(cell.raw)]).alpha(0.5).rgb();
                                cell.styles.textColor = [0, 0, 0];
                            }

                            break;
                        case 'answer':
                            break;
                    }
                }
            });

            footer();
            doc.addPage();
        }

        if(assessment.questions['singleWord-part-2'].completed) {

            doc.text(20, 30, 'Single Word Comprehension: Part 2');

            doc.autoTable(singleWord2.columns, singleWord2.rows, {
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

                    switch (data.column.dataKey) {
                        case 'targetWord':
                            if (data.row.raw.answer === cell.text) {
                                cell.styles.fillColor = [102, 189, 125];
                                cell.styles.textColor = [36, 73, 0];
                            }
                            break;
                        case 'distractor1':
                            if (data.row.raw.answer === cell.text) {
                                cell.styles.fillColor = [247, 104, 108];
                                cell.styles.textColor = [91, 31, 20];
                            }
                            break;
                        case 'distractor2':
                            if (data.row.raw.answer === cell.text) {
                                cell.styles.fillColor = [247, 104, 108];
                                cell.styles.textColor = [91, 31, 20];
                            }
                            break;
                        case 'nounVerb':
                            break;
                        case 'concreteAbstract':
                            break;
                        case 'time':

                            if (cell.raw !== '') {
                                cell.styles.fillColor = $window.chroma.hex(singleWord2.colours[singleWord2.timeRank.indexOf(cell.raw)]).alpha(0.5).rgb();
                                cell.styles.textColor = [0, 0, 0];
                            }

                            break;
                        case 'answer':
                            break;
                    }
                }
            });

            footer();
            doc.addPage();
        }

        if(assessment.questions['sentence-part-1'].completed) {

            doc.text(20, 30, 'Sentence Comprehension: Part 1');

            doc.autoTable(sentence1.columns, sentence1.rows, {
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

                    switch (data.column.dataKey) {
                        case 'targetPicture':
                            if (data.row.raw.answer === cell.text) {
                                cell.styles.fillColor = [102, 189, 125];
                                cell.styles.textColor = [36, 73, 0];
                            }
                            break;
                        case 'distractor1':
                            if (data.row.raw.answer === cell.text) {
                                cell.styles.fillColor = [247, 104, 108];
                                cell.styles.textColor = [91, 31, 20];
                            }
                            break;
                        case 'distractor2':
                            if (data.row.raw.answer === cell.text) {
                                cell.styles.fillColor = [247, 104, 108];
                                cell.styles.textColor = [91, 31, 20];
                            }
                            break;
                        case 'distractor3':
                            if (data.row.raw.answer === cell.text) {
                                cell.styles.fillColor = [247, 104, 108];
                                cell.styles.textColor = [91, 31, 20];
                            }
                            break;
                        case 'time':

                            if (cell.raw !== '') {
                                cell.styles.fillColor = $window.chroma.hex(sentence1.colours[sentence1.timeRank.indexOf(cell.raw)]).alpha(0.5).rgb();
                                cell.styles.textColor = [0, 0, 0];
                            }
                            break;
                        case 'answer':
                            break;
                    }
                }
            });

            footer();
            doc.addPage();

        }

        if(assessment.questions['sentence-part-2'].completed) {

            doc.text(20, 30, 'Sentence Comprehension: Part 2');

            doc.autoTable(sentence2.columns, sentence2.rows, {
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

                    switch (data.column.dataKey) {
                        case 'targetPicture':
                            if (data.row.raw.answer === cell.text) {
                                cell.styles.fillColor = [102, 189, 125];
                                cell.styles.textColor = [36, 73, 0];
                            }
                            break;
                        case 'distractor1':
                            if (data.row.raw.answer === cell.text) {
                                cell.styles.fillColor = [247, 104, 108];
                                cell.styles.textColor = [91, 31, 20];
                            }
                            break;
                        case 'distractor2':
                            if (data.row.raw.answer === cell.text) {
                                cell.styles.fillColor = [247, 104, 108];
                                cell.styles.textColor = [91, 31, 20];
                            }
                            break;
                        case 'distractor3':
                            if (data.row.raw.answer === cell.text) {
                                cell.styles.fillColor = [247, 104, 108];
                                cell.styles.textColor = [91, 31, 20];
                            }
                            break;
                        case 'time':

                            if (cell.raw !== '') {
                                cell.styles.fillColor = $window.chroma.hex(sentence2.colours[sentence2.timeRank.indexOf(cell.raw)]).alpha(0.5).rgb();
                                cell.styles.textColor = [0, 0, 0];
                            }

                            break;
                        case 'answer':
                            break;
                    }
                }
            });

            footer();
            doc.addPage();
        }

        if(assessment.questions['paragraph'].completed) {

            doc.text(20, 30, 'paragraph Comprehension: Part 2');

            doc.autoTable(paragraph.columns, paragraph.rows, {
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

                    switch (data.column.dataKey) {
                        case 'target':
                            if (data.row.raw.answer === cell.text) {
                                cell.styles.fillColor = [102, 189, 125];
                                cell.styles.textColor = [36, 73, 0];
                            }
                            break;
                        case 'distractor1':
                            if (data.row.raw.answer === cell.text) {
                                cell.styles.fillColor = [247, 104, 108];
                                cell.styles.textColor = [91, 31, 20];
                            }
                            break;
                        case 'distractor2':
                            if (data.row.raw.answer === cell.text) {
                                cell.styles.fillColor = [247, 104, 108];
                                cell.styles.textColor = [91, 31, 20];
                            }
                            break;
                        case 'time':

                            if (cell.raw !== '') {
                                cell.styles.fillColor = $window.chroma.hex(paragraph.colours[paragraph.timeRank.indexOf(cell.raw)]).alpha(0.5).rgb();
                                cell.styles.textColor = [0, 0, 0];
                            }

                            break;
                        case 'readingTime':

                            if (cell.raw !== '') {
                                cell.styles.fillColor = $window.chroma.hex(paragraph.readingColours[paragraph.readingTimeRank.indexOf(cell.raw)]).alpha(0.5).rgb();
                                cell.styles.textColor = [0, 0, 0];
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
        }
        
        doc.save('report-' + assessment.name + '.pdf');

    };

});
