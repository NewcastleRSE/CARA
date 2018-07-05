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
      paragraph = null;

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
      paragraph = Paragraph.calculate($window._.filter(assessment.questions['paragraph'].items, {practice: false}), $window._.filter(assessment.questions['paragraph-2'].items, {practice: false}));
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
          labelAngle: 135,
          labelFontSize: 10,
          labelFontColor: 'black',
          lineThickness: 1,
          lineColor: 'black',
          tickThickness: 1,
          tickColor: 'black'
        },
        axisY:{
          title: 'Correct',
          titleFontSize: 14,
          titleFontColor: 'black',
          labelFontSize: 10,
          labelFontColor: 'black',
          lineThickness: 1,
          lineColor: 'black',
          gridThickness: 1,
          gridColor: 'black',
          tickThickness: 1,
          tickColor: 'black',
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
          labelFontSize: 10,
          labelFontColor: 'black',
          lineThickness: 1,
          lineColor: 'black',
          tickThickness: 1,
          tickColor: 'black',
          labelAngle: 135
        },
        axisY:{
          title: 'Correct',
          titleFontSize: 14,
          titleFontColor: 'black',
          labelFontSize: 10,
          labelFontColor: 'black',
          lineThickness: 1,
          lineColor: 'black',
          gridThickness: 1,
          gridColor: 'black',
          tickThickness: 1,
          tickColor: 'black',
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
          labelFontSize: 10,
          labelFontColor: 'black',
          lineThickness: 1,
          lineColor: 'black',
          tickThickness: 1,
          tickColor: 'black',
          labelAngle: 135
        },
        axisY:{
          title: 'Correct',
          titleFontSize: 14,
          titleFontColor: 'black',
          labelFontSize: 10,
          labelFontColor: 'black',
          lineThickness: 1,
          lineColor: 'black',
          gridThickness: 1,
          gridColor: 'black',
          tickThickness: 1,
          tickColor: 'black',
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
              { label: 'Main Ideas Inferred', y: paragraph.mainIdeasImplied.correct.count / (paragraph.mainIdeasImplied.correct.count + paragraph.mainIdeasImplied.incorrect.count) },
              { label: 'Details Stated', y: paragraph.detailsStated.correct.count / (paragraph.detailsStated.correct.count + paragraph.detailsStated.incorrect.count) },
              { label: 'Details Inferred', y: paragraph.detailsImplied.correct.count / (paragraph.detailsImplied.correct.count + paragraph.detailsImplied.incorrect.count) },
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
        dataPoints.push({ label: 'Single Words: Part 1', y: singleWord1.correctAnswers.length / (singleWord1.correctAnswers.length + singleWord1.incorrectAnswers.length) });
      }
      if(singleWord2){
        dataPoints.push({ label: 'Single Words: Part 2', y: singleWord2.correctAnswers.length / (singleWord2.correctAnswers.length + singleWord2.incorrectAnswers.length) });
      }
      if(sentence1){
        dataPoints.push({ label: 'Sentences: Part 1', y: (sentence1.total.correct.count / sentence1.total.questionCount) });
      }
      if(sentence2){
        dataPoints.push({ label: 'Sentences: Part 2', y: (sentence2.total.correct.count / sentence2.total.questionCount) });
      }
      if(paragraph){
        dataPoints.push({ label: 'Paragraphs', y: paragraph.correctAnswers.length / (paragraph.correctAnswers.length + paragraph.incorrectAnswers.length) });
      }

      var overallSummary = new CanvasJS.Chart('overallSummary', {
        title:{
          text: 'Overall Summary',
          fontSize: 16
        },
        axisX: {
          labelFontSize: 10,
          labelFontColor: 'black',
          lineThickness: 1,
          lineColor: 'black',
          tickThickness: 1,
          tickColor: 'black',
          labelAngle: 135
        },
        axisY:{
          title: 'Correct',
          titleFontSize: 14,
          titleFontColor: 'black',
          labelFontSize: 10,
          labelFontColor: 'black',
          lineThickness: 1,
          lineColor: 'black',
          gridThickness: 1,
          gridColor: 'black',
          tickThickness: 1,
          tickColor: 'black',
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
      //doc.text(centeredText('CARA: Comprehensive Assessment of Reading in Aphasia'), 805, 'CARA: Comprehensive Assessment of Reading in Aphasia');
      doc.text(centeredText('CARA: Comprehensive Assessment of Reading in Aphasia            Page ' + doc.page + ' - ' + assessment.name), 820, 'CARA: Comprehensive Assessment of Reading in Aphasia             Page ' + doc.page + ' - ' + assessment.name);
      doc.page ++;
      doc.setFontSize(12);
    }

    doc.setFontSize(28);
    doc.text(centeredText('CARA: Comprehensive Assessment'), 135, 'CARA: Comprehensive Assessment');
    doc.text(centeredText('of Reading in Aphasia'), 175, 'of Reading in Aphasia');
    doc.setFontSize(16);
    doc.text(centeredText('Morris, Webster, Howard and Garraffa'), 210, 'Morris, Webster, Howard and Garraffa');

    doc.setFontSize(20);
    doc.text(centeredText('Results Report'), 290, 'Results Report');
    doc.setFontSize(16);
    doc.text(centeredText('Participant ID: ' + assessment.name), 315, 'Participant ID: ' + assessment.name);

    doc.setFontSize(16);
    doc.text(centeredText('To be completed by clinician:'), 495, 'To be completed by clinician:' );
    doc.text(100, 545, 'Name:');
    doc.text(100, 595, 'Date of Birth:');
    doc.text(100, 645, 'Date of Completion:');
    doc.setFontSize(12);
    doc.text(centeredText('Note: This report is designed to be used in conjunction with the manual.'), 715, 'Note: This report is designed to be used in conjunction with the manual.' );

    footer();
    doc.addPage();

    doc.setFontSize(10);
    doc.text(50, 50, 'This area is intentionally blank and is for the clinician to record any observations or comments from the client.');
    doc.rect(50, 65, 495, 680);

    footer();
    doc.addPage();

    doc.setFontSize(20);
    doc.text(50, 50, 'Summary of Results');
    doc.rect(50, 65, 495, 2, 'F');

    if(singleWord1 || singleWord2) {
      doc.setFontSize(16);
      doc.text(50, 100, '1. Single Word Comprehension');
      doc.setFontSize(12);


      if(singleWord1) {
        doc.text(50, 135, 'Part 1 - Unrelated Distracters');
        doc.autoTable(singleWord1.summaryColumns, singleWord1.summaryRows, {
          theme: 'grid',
          margin: [150, 50, 50, 50],
          styles: {
            halign: 'center',
            valign: 'middle',
            font: 'helvetica'
          },
          headerStyles: {
            fillColor: false,
            textColor: 0,
            lineColor: 200,
            lineWidth: 1
          },
          createdCell: function (cell, data) {
            switch (data.column.dataKey) {
              case 'concreteLabel':
                cell.styles.fontStyle = 'bold';
                break;
              case 'abstractLabel':
                cell.styles.fontStyle = 'bold';
                break;
            }
          }
        });
      }

      if(singleWord2) {
        doc.text(50, 285, 'Part 2 - Related Distracters');
        doc.autoTable(singleWord2.summaryColumns, singleWord2.summaryRows, {
          theme: 'grid',
          margin: [300, 50, 50, 50],
          styles: {
            halign: 'center',
            valign: 'middle',
            font: 'helvetica'
          },
          headerStyles: {
            fillColor: false,
            textColor: 0,
            lineColor: 200,
            lineWidth: 1
          },
          createdCell: function (cell, data) {
            switch (data.column.dataKey) {
              case 'concreteLabel':
                cell.styles.fontStyle = 'bold';
                break;
              case 'abstractLabel':
                cell.styles.fontStyle = 'bold';
                break;
            }
          }
        });
      }

      if(singleWord1 && singleWord2){
        doc.addImage(document.getElementById('singleWordSummary').firstChild.firstChild.toDataURL('image/png'), 'PNG', 40, 460, 512, 340);
      }
      else if((singleWord1 && !singleWord2) || (!singleWord1 && singleWord2)){
        doc.addImage(document.getElementById('singleWordSummary').firstChild.firstChild.toDataURL('image/png'), 'PNG', 40, 300, 512, 340);
      }


      footer();
      doc.addPage();

    }

    if(assessment.questions['sentence-part-1'].completed || assessment.questions['sentence-part-2'].completed) {
      doc.setFontSize(16);

      var textHeight = 100;

      if(assessment.questions['singleWord-part-1'].completed || assessment.questions['singleWord-part-2'].completed) {
        textHeight = 75;
      }

      doc.text(50, textHeight, '2. Sentence Comprehension');

      doc.setFontSize(12);

      if(assessment.questions['sentence-part-1'].completed && assessment.questions['sentence-part-2'].completed) {
        doc.text(50, textHeight += 35, 'Parts 1 & 2 (Combined)');
      }
      else {
        if(assessment.questions['sentence-part-1'].completed) {
          doc.text(50, textHeight += 35, 'Part 1');
        }
        else if(assessment.questions['sentence-part-2'].completed) {
          doc.text(50, textHeight += 35, 'Part 2');
        }
      }

      doc.autoTable(sentence1.summaryColumns, sentenceSummaryTotals, {
        theme: 'grid',
        margin: [textHeight+=15, 50, 50, 50],
        styles: {
          halign: 'center',
          valign: 'middle',
          font: 'helvetica'
        },
        headerStyles: {
          fillColor: false,
          textColor: 0,
          lineColor: 200,
          lineWidth: 1
        },
        createdCell: function (cell, data) {

          if(data.column.dataKey === 'type'){
            cell.styles.fontStyle = 'bold';
          }

          if(cell.text[0] === ""){
            cell.text = "--";
          }

          if(cell.text === ''){
            cell.styles.fillColor = [153,153,153];
          }
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
          fillColor: false,
          textColor: 0,
          lineColor: 200,
          lineWidth: 1
        },
        createdCell: function (cell, data) {

          switch (data.column.dataKey) {
            case 'length':
              cell.styles.fontStyle = 'bold';
              break;
            case 'paragraphs':
              cell.styles.fontStyle = 'bold';
              break;
            case 'questionType':
              cell.styles.fontStyle = 'bold';
              break;
          }
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
      doc.text(50, 50, 'Complete Results');
      doc.rect(50, 65, 495, 2, 'F');
      doc.setFontSize(12);
      doc.text(50, 90, 'Single Word Comprehension - Part 1: Unrelated Distracters');

      doc.autoTable(singleWord1.columns, singleWord1.rows, {
        theme: 'grid',
        margin: [100, 50, 50, 50],
        styles: {
          halign: 'left',
          valign: 'middle',
          font: 'helvetica'
        },
        headerStyles: {
          fillColor: false,
          textColor: 0,
          lineColor: 200,
          lineWidth: 1
        },
        createdCell: function (cell, data) {

          switch (data.column.dataKey) {
            case 'targetWord':
              if (data.row.raw.answer === data.row.raw.targetWord) {
                cell.styles.fillColor = [102, 189, 125];
                cell.styles.textColor = [36, 73, 0];
              }
              break;
            case 'distractor1':
              if (data.row.raw.answer === data.row.raw.distractor1) {
                cell.styles.fillColor = [247, 104, 108];
                cell.styles.textColor = [91, 31, 20];
              }
              break;
            case 'distractor2':
              if (data.row.raw.answer === data.row.raw.distractor2) {
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

      doc.text(50, 30, 'Single Word Comprehension - Part 2: Related Distracters');

      doc.autoTable(singleWord2.columns, singleWord2.rows, {
        theme: 'grid',
        styles: {
          halign: 'center',
          valign: 'middle',
          font: 'helvetica'
        },
        headerStyles: {
          fillColor: false,
          textColor: 0,
          lineColor: 200,
          lineWidth: 1
        },
        createdCell: function (cell, data) {

          switch (data.column.dataKey) {
            case 'targetWord':
              if (data.row.raw.answer === data.row.raw.targetWord) {
                cell.styles.fillColor = [102, 189, 125];
                cell.styles.textColor = [36, 73, 0];
              }
              break;
            case 'distractor1':
              if (data.row.raw.answer === data.row.raw.distractor1) {
                cell.styles.fillColor = [247, 104, 108];
                cell.styles.textColor = [91, 31, 20];
              }
              break;
            case 'distractor2':
              if (data.row.raw.answer === data.row.raw.distractor2) {
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

      doc.text(50, 30, 'Sentence Comprehension: Part 1 - Key');

      doc.autoTable(sentence1.keyColumns, sentence1.keyRows, {
        theme: 'grid',
        styles: {
          halign: 'left',
          valign: 'middle',
          font: 'helvetica'
        },
        headerStyles: {
          fillColor: false,
          textColor: 0,
          lineColor: 200,
          lineWidth: 1
        }
      });

      footer();
      doc.addPage();

      doc.text(50, 30, 'Sentence Comprehension: Part 1 - Results');

      doc.autoTable(sentence1.columns, sentence1.rows, {
        theme: 'grid',
        styles: {
          halign: 'center',
          valign: 'middle',
          font: 'helvetica'
        },
        headerStyles: {
          fillColor: false,
          textColor: 0,
          lineColor: 200,
          lineWidth: 1
        },
        createdCell: function (cell, data) {

          switch (data.column.dataKey) {
            case 'targetPicture':
              if (data.row.raw.answer === data.row.raw.targetPicture) {
                cell.styles.fillColor = [102, 189, 125];
                cell.styles.textColor = [36, 73, 0];
              }
              break;
            case 'distractor1':
              if (data.row.raw.answer === data.row.raw.distractor1) {
                cell.styles.fillColor = [247, 104, 108];
                cell.styles.textColor = [91, 31, 20];
              }
              break;
            case 'distractor2':
              if (data.row.raw.answer === data.row.raw.distractor2) {
                cell.styles.fillColor = [247, 104, 108];
                cell.styles.textColor = [91, 31, 20];
              }
              break;
            case 'distractor3':
              if (data.row.raw.answer === data.row.raw.distractor3) {
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

      doc.text(50, 30, 'Sentence Comprehension: Part 2 - Key');

      doc.autoTable(sentence2.keyColumns, sentence2.keyRows, {
        theme: 'grid',
        styles: {
          halign: 'left',
          valign: 'middle',
          font: 'helvetica'
        },
        headerStyles: {
          fillColor: false,
          textColor: 0,
          lineColor: 200,
          lineWidth: 1
        }
      });

      footer();
      doc.addPage();

      doc.text(50, 30, 'Sentence Comprehension: Part 2 - Results');

      doc.autoTable(sentence2.columns, sentence2.rows, {
        theme: 'grid',
        styles: {
          halign: 'center',
          valign: 'middle',
          font: 'helvetica'
        },
        headerStyles: {
          fillColor: false,
          textColor: 0,
          lineColor: 200,
          lineWidth: 1
        },
        createdCell: function (cell, data) {

          switch (data.column.dataKey) {
            case 'targetPicture':
              if (data.row.raw.answer === data.row.raw.targetPicture) {
                cell.styles.fillColor = [102, 189, 125];
                cell.styles.textColor = [36, 73, 0];
              }
              break;
            case 'distractor1':
              if (data.row.raw.answer === data.row.raw.distractor1) {
                cell.styles.fillColor = [247, 104, 108];
                cell.styles.textColor = [91, 31, 20];
              }
              break;
            case 'distractor2':
              if (data.row.raw.answer === data.row.raw.distractor2) {
                cell.styles.fillColor = [247, 104, 108];
                cell.styles.textColor = [91, 31, 20];
              }
              break;
            case 'distractor3':
              if (data.row.raw.answer === data.row.raw.distractor3) {
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

      doc.text(50, 30, 'Paragraph Comprehension');

      var paragraphPage1Rows = paragraph.rows.slice(0,32);
      var paragraphPage2Rows = paragraph.rows.slice(32);

      doc.autoTable(paragraph.columns, paragraphPage1Rows, {
        theme: 'grid',
        styles: {
          halign: 'center',
          valign: 'middle',
          font: 'helvetica'
        },
        headerStyles: {
          fillColor: false,
          textColor: 0,
          lineColor: 200,
          lineWidth: 1
        },
        createdCell: function (cell, data) {

          switch (data.column.dataKey) {
            case 'target':
              if (data.row.raw.answer === data.row.raw.target) {
                cell.styles.fillColor = [102, 189, 125];
                cell.styles.textColor = [36, 73, 0];
              }
              break;
            case 'distractor1':
              if (data.row.raw.answer === data.row.raw.distractor1) {
                cell.styles.fillColor = [247, 104, 108];
                cell.styles.textColor = [91, 31, 20];
              }
              break;
            case 'distractor2':
              if (data.row.raw.answer === data.row.raw.distractor2) {
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

      footer();
      doc.addPage();

      doc.autoTable(paragraph.columns, paragraphPage2Rows, {
        theme: 'grid',
        styles: {
          halign: 'center',
          valign: 'middle',
          font: 'helvetica'
        },
        headerStyles: {
          fillColor: false,
          textColor: 0,
          lineColor: 200,
          lineWidth: 1
        },
        createdCell: function (cell, data) {

          switch (data.column.dataKey) {
            case 'target':
              if (data.row.raw.answer === data.row.raw.target) {
                cell.styles.fillColor = [102, 189, 125];
                cell.styles.textColor = [36, 73, 0];
              }
              break;
            case 'distractor1':
              if (data.row.raw.answer === data.row.raw.distractor1) {
                cell.styles.fillColor = [247, 104, 108];
                cell.styles.textColor = [91, 31, 20];
              }
              break;
            case 'distractor2':
              if (data.row.raw.answer === data.row.raw.distractor2) {
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

    footer();
    doc.addPage();

    doc.text(50, 30, 'Paragraph Comprehension - Gists');

    doc.autoTable(paragraph.gistColumns, paragraph.gistRows, {
      theme: 'grid',
      styles: {
        halign: 'center',
        valign: 'middle',
        font: 'helvetica'
      },
      headerStyles: {
        fillColor: false,
        textColor: 0,
        lineColor: 200,
        lineWidth: 1
      },
      createdCell: function (cell, data) {

        switch (data.column.dataKey) {
          case 'target':
            if (data.row.raw.answer === data.row.raw.target) {
              cell.styles.fillColor = [102, 189, 125];
              cell.styles.textColor = [36, 73, 0];
            }
            break;
          case 'distractor1':
            if (data.row.raw.answer === data.row.raw.distractor1) {
              cell.styles.fillColor = [247, 104, 108];
              cell.styles.textColor = [91, 31, 20];
            }
            break;
          case 'distractor2':
            if (data.row.raw.answer === data.row.raw.distractor2) {
              cell.styles.fillColor = [247, 104, 108];
              cell.styles.textColor = [91, 31, 20];
            }
            break;
          case 'time':

            if (cell.raw !== '') {
              cell.styles.fillColor = $window.chroma.hex(paragraph.gistColours[paragraph.gistTimeRank.indexOf(cell.raw)]).alpha(0.5).rgb();
              cell.styles.textColor = [0, 0, 0];
            }

            break;
          case 'answer':
            break;
        }
      }
    });

    footer();

    doc.save('report-' + assessment.name + '.pdf');

  };

});
