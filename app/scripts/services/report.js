'use strict';

/**
 * @ngdoc service
 * @name rcaApp.assessment
 * @description
 * # assessment
 * Service in the rcaApp.
 */
angular.module('rcaApp').service('Report', function ($window, Sorting, Questionnaire, Paragraph, Sentence1, Sentence2, SingleWord1, SingleWord2) {

  function msToTime(duration) {

    if(duration && !isNaN(duration)){
      var milliseconds = parseInt((duration % 1000) / 100),
        seconds = parseInt((duration / 1000) % 60),
        minutes = parseInt((duration / (1000 * 60)) % 60),
        hours = parseInt((duration / (1000 * 60 * 60)) % 24);

      hours = (hours < 10) ? '0' + hours : hours;
      minutes = (minutes < 10) ? '0' + minutes : minutes;
      seconds = (seconds < 10) ? '0' + seconds : seconds;

      if(hours === '00'){
        return minutes + ':' + seconds + '.' + milliseconds;
      }
      else {
        return hours + ':' + minutes + ':' + seconds + '.' + milliseconds;
      }
    }
    else {
      return '';
    }
  }

  return function(assessment) {

    var singleWord1 = null,
      singleWord2 = null,
      sentence1 = null,
      sentence2 = null,
      paragraph = null,
      reading1 = null,
      reading2 = null,
      sorting = null;

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

    if(assessment.questions['reading-scale'].completed) {
      reading1 = Questionnaire.calculate($window._.filter(assessment.questions['reading-scale'].items, {practice: false}));
    }

    if(assessment.questions['reading-scale-2'].completed) {
      reading2 = Questionnaire.calculate($window._.filter(assessment.questions['reading-scale-2'].items, {practice: false}));
    }

    if(assessment.questions['card-sorting'].completed) {
      sorting = Sorting.calculate(assessment.questions['card-sorting']);
    }

    /****** Override to merge Sentence Scores *******/

    var sentenceSummaryTotals = [{
      type: 'Phrases',
      nonReversible: [0,0],
      reversible: '',
      total: [0,0],
    },{
      type: 'Simple Sentences',
      nonReversible: [0,0],
      reversible: [0,0],
      total: [0,0],
    },{
      type: 'Complex Sentences',
      nonReversible: '',
      reversible: [0,0],
      total: [0,0]
    },{
      type: 'Total',
      nonReversible: [0,0],
      reversible: [0,0],
      total: [0,0]
    }];

    if(assessment.questions['sentence-part-1'].completed || assessment.questions['sentence-part-2'].completed) {

      if(assessment.questions['sentence-part-1'].completed){
          sentenceSummaryTotals[0].nonReversible[0] += sentence1.nonReversiblePhrases.correct.count;
          sentenceSummaryTotals[0].nonReversible[1] += sentence1.nonReversiblePhrases.questionCount;
          sentenceSummaryTotals[0].total[0] += sentence1.nonReversiblePhrases.correct.count;
          sentenceSummaryTotals[0].total[1] += sentence1.nonReversiblePhrases.questionCount;
          
          sentenceSummaryTotals[1].nonReversible[0] += sentence1.nonReversibleSimple.correct.count;
          sentenceSummaryTotals[1].nonReversible[1] += sentence1.nonReversibleSimple.questionCount;
          sentenceSummaryTotals[1].reversible[0] += sentence1.reversibleSimple.correct.count;
          sentenceSummaryTotals[1].reversible[1] += sentence1.reversibleSimple.questionCount;
          sentenceSummaryTotals[1].total[0] += sentence1.nonReversibleSimple.correct.count + sentence1.reversibleSimple.correct.count;
          sentenceSummaryTotals[1].total[1] += sentence1.nonReversibleSimple.questionCount + sentence1.reversibleSimple.questionCount;

          sentenceSummaryTotals[2].reversible[0] += sentence1.reversibleComplex.correct.count;
          sentenceSummaryTotals[2].reversible[1] += sentence1.reversibleComplex.questionCount;
          sentenceSummaryTotals[2].total[0] += sentence1.reversibleComplex.correct.count;
          sentenceSummaryTotals[2].total[1] += sentence1.reversibleComplex.questionCount;

          sentenceSummaryTotals[3].nonReversible[0] += sentence1.nonReversiblePhrases.correct.count + sentence1.nonReversibleSimple.correct.count;
          sentenceSummaryTotals[3].nonReversible[1] += sentence1.nonReversiblePhrases.questionCount + sentence1.nonReversibleSimple.questionCount;
          sentenceSummaryTotals[3].reversible[0] += sentence1.reversibleSimple.correct.count + sentence1.reversibleComplex.correct.count;
          sentenceSummaryTotals[3].reversible[1] += sentence1.reversibleSimple.questionCount + sentence1.reversibleComplex.questionCount;
          sentenceSummaryTotals[3].total[0] += sentence1.nonReversiblePhrases.correct.count + sentence1.nonReversibleSimple.correct.count + sentence1.reversibleSimple.correct.count + sentence1.reversibleComplex.correct.count;
          sentenceSummaryTotals[3].total[1] += sentence1.nonReversiblePhrases.questionCount + sentence1.nonReversibleSimple.questionCount + sentence1.reversibleSimple.questionCount + sentence1.reversibleComplex.questionCount;
      }

      if(assessment.questions['sentence-part-2'].completed){
          sentenceSummaryTotals[0].nonReversible[0] += sentence2.nonReversiblePhrases.correct.count;
          sentenceSummaryTotals[0].nonReversible[1] += sentence2.nonReversiblePhrases.questionCount;
          sentenceSummaryTotals[0].total[0] += sentence2.nonReversiblePhrases.correct.count;
          sentenceSummaryTotals[0].total[1] += sentence2.nonReversiblePhrases.questionCount;
          
          sentenceSummaryTotals[1].nonReversible[0] += sentence2.nonReversibleSimple.correct.count;
          sentenceSummaryTotals[1].nonReversible[1] += sentence2.nonReversibleSimple.questionCount;
          sentenceSummaryTotals[1].reversible[0] += sentence2.reversibleSimple.correct.count;
          sentenceSummaryTotals[1].reversible[1] += sentence2.reversibleSimple.questionCount;
          sentenceSummaryTotals[1].total[0] += sentence2.nonReversibleSimple.correct.count + sentence2.reversibleSimple.correct.count;
          sentenceSummaryTotals[1].total[1] += sentence2.nonReversibleSimple.questionCount + sentence2.reversibleSimple.questionCount;

          sentenceSummaryTotals[2].reversible[0] += sentence2.reversibleComplex.correct.count;
          sentenceSummaryTotals[2].reversible[1] += sentence2.reversibleComplex.questionCount;
          sentenceSummaryTotals[2].total[0] += sentence2.reversibleComplex.correct.count;
          sentenceSummaryTotals[2].total[1] += sentence2.reversibleComplex.questionCount;

          sentenceSummaryTotals[3].nonReversible[0] += sentence2.nonReversiblePhrases.correct.count + sentence2.nonReversibleSimple.correct.count;
          sentenceSummaryTotals[3].nonReversible[1] += sentence2.nonReversiblePhrases.questionCount + sentence2.nonReversibleSimple.questionCount;
          sentenceSummaryTotals[3].reversible[0] += sentence2.reversibleSimple.correct.count + sentence2.reversibleComplex.correct.count;
          sentenceSummaryTotals[3].reversible[1] += sentence2.reversibleSimple.questionCount + sentence2.reversibleComplex.questionCount;
          sentenceSummaryTotals[3].total[0] += sentence2.nonReversiblePhrases.correct.count + sentence2.nonReversibleSimple.correct.count + sentence2.reversibleSimple.correct.count + sentence2.reversibleComplex.correct.count;
          sentenceSummaryTotals[3].total[1] += sentence2.nonReversiblePhrases.questionCount + sentence2.nonReversibleSimple.questionCount + sentence2.reversibleSimple.questionCount + sentence2.reversibleComplex.questionCount;
      }

      sentenceSummaryTotals.forEach(function(type){
        type.nonReversible = Array.isArray(type.nonReversible) ? type.nonReversible[0] + '/' + type.nonReversible[1] : '';
        type.reversible = Array.isArray(type.reversible) ? type.reversible[0] + '/' + type.reversible[1] : '';
        type.total = type.total[0] + '/' + type.total[1];
      });
    }

    if(singleWord1 || singleWord2){

      var chartData = [];

      if(singleWord1){
        chartData.push({ label: 'Unrelated', y: singleWord1.correctAnswers.length / (singleWord1.correctAnswers.length + singleWord1.incorrectAnswers.length) * 100 });
      }

      if(singleWord2){
        chartData.push({ label: 'Related', y: singleWord2.correctAnswers.length / (singleWord2.correctAnswers.length + singleWord2.incorrectAnswers.length) * 100 });
      }

      if(singleWord1){
        chartData.push({ label: 'Pt 1 - Nouns', y: singleWord1.nouns.correct.count / (singleWord1.nouns.correct.count + singleWord1.nouns.incorrect.count) * 100 });
        chartData.push({ label: 'Pt 1 - Verbs', y: singleWord1.verbs.correct.count / (singleWord1.verbs.correct.count + singleWord1.verbs.incorrect.count) * 100 });
        chartData.push({ label: 'Pt 1 - Concrete', y: (singleWord1.concreteNouns.correct.count + singleWord1.concreteVerbs.correct.count) / (singleWord1.concreteNouns.correct.count + singleWord1.concreteVerbs.correct.count + singleWord1.concreteNouns.incorrect.count + singleWord1.concreteVerbs.incorrect.count) * 100 });
        chartData.push({ label: 'Pt 1 - Abstract', y: (singleWord1.abstractNouns.correct.count + singleWord1.abstractVerbs.correct.count) / (singleWord1.abstractNouns.correct.count + singleWord1.abstractVerbs.correct.count + singleWord1.abstractNouns.incorrect.count + singleWord1.abstractVerbs.incorrect.count) * 100 });
      }

      if(singleWord2){
        chartData.push({ label: 'Pt 2 - Nouns', y: singleWord2.nouns.correct.count / (singleWord2.nouns.correct.count + singleWord2.nouns.incorrect.count) * 100 });
        chartData.push({ label: 'Pt 2 - Verbs', y: singleWord2.verbs.correct.count / (singleWord2.verbs.correct.count + singleWord2.verbs.incorrect.count) * 100 });
        chartData.push({ label: 'Pt 2 - Concrete', y: (singleWord2.concreteNouns.correct.count + singleWord2.concreteVerbs.correct.count) / (singleWord2.concreteNouns.correct.count + singleWord2.concreteVerbs.correct.count + singleWord2.concreteNouns.incorrect.count + singleWord2.concreteVerbs.incorrect.count) * 100 });
        chartData.push({ label: 'Pt 2 - Abstract', y: (singleWord2.abstractNouns.correct.count + singleWord2.abstractVerbs.correct.count) / (singleWord2.abstractNouns.correct.count + singleWord2.abstractVerbs.correct.count + singleWord2.abstractNouns.incorrect.count + singleWord2.abstractVerbs.incorrect.count) * 100 });
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
          maximum: 100
        },
        data: [
          {
            type: 'column',
            color: '#4D2277',
            name: 'Correct',
            indexLabelPlacement: 'outside',
            indexLabel: '{y}%',
            indexLabelFontSize: 8,
            indexLabelFontColor: 'black',
            indexLabelFormatter: function(event){
              return event.dataPoint.y.toFixed(0) + '%';
            },
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
          { label: 'Total', y: ((sentence1.total.correct.count + sentence2.total.correct.count) / (sentence1.total.questionCount + sentence2.total.questionCount)) * 100 },
          { label: 'Non-reversible', y: ((sentence1.nonReversibleTotal.correct.count + sentence2.nonReversibleTotal.correct.count)/34) * 100 },
          { label: 'Reversible', y: ((sentence1.reversibleTotal.correct.count + sentence2.reversibleTotal.correct.count)/23) * 100 },
          { label: 'Phrase', y: (sentence1.phrases.correct.count + sentence2.phrases.correct.count) / (sentence1.phrases.correct.count + sentence2.phrases.correct.count + sentence1.phrases.incorrect.count + sentence2.phrases.incorrect.count) * 100 },
          { label: 'Simple', y: (sentence1.simple.correct.count + sentence2.simple.correct.count) / (sentence1.simple.correct.count + sentence2.simple.correct.count + sentence1.simple.incorrect.count + sentence2.simple.incorrect.count) * 100 },
          { label: 'Complex', y: (sentence1.complex.correct.count + sentence2.complex.correct.count) / (sentence1.complex.correct.count + sentence2.complex.correct.count + sentence1.complex.incorrect.count + sentence2.complex.incorrect.count) * 100 }
        ]
      }
      else if(sentence1 && !sentence2) {
        chartData = [
          { label: 'Total', y: (sentence1.total.correct.count / sentence1.total.questionCount) * 100 },
          { label: 'Non-reversible', y: (sentence1.nonReversibleTotal.correct.count/ sentence1.nonReversibleTotal.questionCount) * 100 },
          { label: 'Reversible', y: (sentence1.reversibleTotal.correct.count / sentence1.reversibleTotal.questionCount) * 100 },
          { label: 'Phrase', y: (sentence1.phrases.correct.count / sentence1.phrases.questionCount) * 100 },
          { label: 'Simple', y: (sentence1.simple.correct.count / sentence1.simple.questionCount) * 100 },
          { label: 'Complex', y: (sentence1.complex.correct.count / sentence1.complex.questionCount) * 100 }
        ];
      }
      else {
        chartData = [
          { label: 'Total', y: (sentence2.total.correct.count / sentence2.total.questionCount) * 100 },
          { label: 'Non-reversible', y: (sentence2.nonReversibleTotal.correct.count/ sentence2.nonReversibleTotal.questionCount) * 100 },
          { label: 'Reversible', y: (sentence2.reversibleTotal.correct.count / sentence2.reversibleTotal.questionCount) * 100 },
          { label: 'Phrase', y: (sentence2.phrases.correct.count / sentence2.phrases.questionCount) * 100 },
          { label: 'Simple', y: (sentence2.simple.correct.count / sentence2.simple.questionCount) * 100 },
          { label: 'Complex', y: (sentence2.complex.correct.count / sentence2.complex.questionCount) * 100 }
        ];
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
          maximum: 100
        },
        data: [
          {
            type: 'column',
            color: '#4D2277',
            name: 'Correct',
            indexLabelPlacement: 'outside',
            indexLabel: '{y}%',
            indexLabelFontSize: 8,
            indexLabelFontColor: 'black',
            indexLabelFormatter: function(event){
              return event.dataPoint.y.toFixed(0) + '%';
            },
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
          maximum: 100
        },
        data: [
          {
            type: 'column',
            color: '#4D2277',
            name: 'Correct',
            indexLabelPlacement: 'outside',
            indexLabel: '{y}%',
            indexLabelFontSize: 8,
            indexLabelFontColor: 'black',
            indexLabelFormatter: function(event){
              return event.dataPoint.y.toFixed(0) + '%';
            },
            dataPoints: [
              { label: 'Total', y: paragraph.correctAnswers.length / (paragraph.correctAnswers.length + paragraph.incorrectAnswers.length) * 100 },
              { label: 'Main Ideas Stated', y: paragraph.mainIdeasStated.correct.count / (paragraph.mainIdeasStated.correct.count + paragraph.mainIdeasStated.incorrect.count) * 100 },
              { label: 'Main Ideas Inferred', y: paragraph.mainIdeasImplied.correct.count / (paragraph.mainIdeasImplied.correct.count + paragraph.mainIdeasImplied.incorrect.count) * 100 },
              { label: 'Details Stated', y: paragraph.detailsStated.correct.count / (paragraph.detailsStated.correct.count + paragraph.detailsStated.incorrect.count) * 100 },
              { label: 'Details Inferred', y: paragraph.detailsImplied.correct.count / (paragraph.detailsImplied.correct.count + paragraph.detailsImplied.incorrect.count) * 100 },
              { label: 'Gist', y: paragraph.gist.correct.count / (paragraph.gist.correct.count + paragraph.gist.incorrect.count) }
            ]
          }
        ]
      });

      paragraphSummary.render();
    }

    if(singleWord1 || singleWord2 || sentence1 || sentence2 || paragraph || reading1 || reading2 || sorting){

      var timeSummary = {
        columns: [
          {title: 'Assessment', dataKey: 'assessment'},
          {title: 'Score', dataKey: 'score'},
          {title: 'Time Taken', dataKey: 'timeTaken'},
          {title: 'Average Response', dataKey: 'averageTime'}
        ],
        rows: [],
      };
      var dataPoints = [];

      if(singleWord1){

        var singleWord1Score = singleWord1.correctAnswers.length / (singleWord1.correctAnswers.length + singleWord1.incorrectAnswers.length) * 100;

        dataPoints.push({ label: 'Single Words: Part 1', y: singleWord1Score });
        timeSummary.rows.push({assessment: 'Single Words: Part 1', score: singleWord1Score.toFixed(0) + '%', timeTaken: msToTime(singleWord1.time.duration), averageTime: msToTime(singleWord1.time.average) });
      }
      if(singleWord2){
        var singleWord2Score = singleWord2.correctAnswers.length / (singleWord2.correctAnswers.length + singleWord2.incorrectAnswers.length) * 100;
        dataPoints.push({ label: 'Single Words: Part 2', y: singleWord2Score });

        timeSummary.rows.push({assessment: 'Single Words: Part 2', score: singleWord2Score.toFixed(0) + '%', timeTaken: msToTime(singleWord2.time.duration), averageTime: msToTime(singleWord1.time.average) });
      }
      if(sentence1){
        var sentence1Score = (sentence1.total.correct.count / sentence1.total.questionCount) * 100;

        dataPoints.push({ label: 'Sentences: Part 1', y: sentence1Score });

        timeSummary.rows.push({assessment: 'Sentences: Part 1', score: sentence1Score.toFixed(0) + '%', timeTaken: msToTime(sentence1.time.duration), averageTime: msToTime(sentence1.time.average) });
        }
      if(sentence2){

        var sentence2Score = (sentence2.total.correct.count / sentence2.total.questionCount) * 100;

        dataPoints.push({ label: 'Sentences: Part 2', y: sentence2Score });

        timeSummary.rows.push({assessment: 'Sentences: Part 2', score: sentence2Score.toFixed(0) + '%', timeTaken: msToTime(sentence2.time.duration), averageTime: msToTime(sentence2.time.average) });
      }
      if(paragraph){

        var paragraphScore = paragraph.correctAnswers.length / (paragraph.correctAnswers.length + paragraph.incorrectAnswers.length) * 100;

        dataPoints.push({ label: 'Paragraphs', y: paragraphScore });

        timeSummary.rows.push({assessment: 'Paragraphs', score: paragraphScore.toFixed(0) + '%', timeTaken: msToTime(paragraph.time.duration), averageTime: msToTime(paragraph.time.average) });
      }
      if(reading1){
        timeSummary.rows.push({assessment: 'Reading 1', score: 'N/A', timeTaken: msToTime(reading1.time.duration), averageTime: 'N/A' });
      }
      if(reading2){
        timeSummary.rows.push({assessment: 'Reading 2', score: 'N/A', timeTaken: msToTime(reading2.time.duration), averageTime: 'N/A' });
      }
      if(sorting){
        timeSummary.rows.push({assessment: 'Card Sorting', score: 'N/A', timeTaken: msToTime(sorting.time.duration), averageTime: 'N/A' });
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
          maximum: 100
        },
        data: [
          {
            type: 'column',
            color: '#4D2277',
            name: 'Correct',
            indexLabelPlacement: 'outside',
            indexLabel: '{y}%',
            indexLabelFontSize: 8,
            indexLabelFontColor: 'black',
            indexLabelFormatter: function(event){
              return event.dataPoint.y.toFixed(0) + '%';
            },
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

        var imgData = 'data:image/png;base64,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AAAAAADguRARAQAAAACA50JEBAAAAAAAngsREQAAAAAAeC5ERAAAAAAA4LkQEQEAAAAAgOdCRAQAAAAAAJ4LEREAAAAAAHguREQAAAAAAOC5EBEBAAAAAIDnQkQEAAAAAACeCxERAAAAAAB4LkREAAAAAADguRARAQAAAACA50JEBAAAAAAAngsREQAAAAAAeC5ERAAAAAAA4LkQEQEAAAAAgOdCRAQAAAAAAJ4LEREAAAAAAHguREQAAAAAAOC5EBEBAAAAAIDnQkQEAAAAAACeCxERAAAAAAB4LkREAAAAAADguRARAQAAAACA50JEBAAAAAAAngsREQAAAAAAeC5ERAAAAAAA4LkQEQEAAAAAgOdCRAQAAAAAAJ4LEREAAAAAAHguREQAAAAAAOC5EBEBAAAAAIDnQkQEAAAAAACeCxERAAAAAAB4LkREAAAAAADguRARAQAAAACA50JEBAAAAAAAngsREQAAAAAAeC5ERAAAAAAA4LkQEQEAAAAAgOdCRAQAAAAAAJ4LEREAAAAAAHguREQAAAAAAOC5EBEBAAAAAIDnQkQEAAAAAACeCxERAAAAAAB4LkREAAAAAADguRARAQAAAACA50JEBAAAAAAAngsREQAAAAAAeC5ERAAAAAAA4LkQEQEAAAAAgOdCRAQAAAAAAJ4LEREAAAAAAHguREQAAAAAAOC5EBEBAAAAAIDnQkQEAAAAAACeCxERAAAAAAB4LkREAAAAAADguRARAQAAAACA50JEBAAAAAAAngsREQAAAAAAeC5ERAAAAAAA4LkQEQEAAAAAgOdCRAQAAAAAAJ4LEREAAAAAAHguREQAAAAAAOC5EBEBAAAAAIDnQkQEAAAAAACeCxERAAAAAAB4LkREAAAAAADguRARAQAAAACA50JEBAAAAAAAngsREQAAAAAAeC5ERAAAAAAA4LkQEQEAAAAAgOdCRAQAAAAAAJ4LEREAAAAAAHguREQAAAAAAOC5EBEBAAAAAIDnQkQEAAAAAACeCxERAAAAAAB4LkREAAAAAADguRARAQAAAACA50JEBAAAAAAAngsREQAAAAAAeC5ERAAAAAAA4LkQEQEAAAAAgOdCRAQAAAAAAJ4LEREAAAAAAHguREQAAAAAAOC5EBEBAAAAAIDnQkQEAAAAAACeCxERAAAAAAB4LkREAAAAAADguRARAQAA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'
        doc.addImage(imgData, 'PNG', 110, 50, 372, 200);

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

    doc.setFontSize(20);
    doc.text(50, 50, 'Summary of Results');
    doc.rect(50, 65, 495, 2, 'F');

    if(singleWord1 || singleWord2 || (sentence1 && sentence2) || paragraph){
      doc.setFontSize(16);
      doc.text(50, 100, '1. Overall Summary');
      doc.setFontSize(12);

      doc.autoTable(timeSummary.columns, timeSummary.rows, {
        theme: 'grid',
        margin: [150, 50, 50, 50],
        styles: {
          halign: 'center',
          valign: 'middle',
          font: 'helvetica',
          lineColor: 100,
          lineWidth: 1
        },
        headerStyles: {
          fillColor: false,
          textColor: 0
        }
      });

      doc.addImage(document.getElementById('overallSummary').firstChild.firstChild.toDataURL('image/png'), 'PNG', 40, 400, 512, 340);

      footer();
      doc.addPage();
    }

    if(singleWord1 || singleWord2) {
      doc.setFontSize(16);
      doc.text(50, 75, '2. Single Word Comprehension');
      doc.setFontSize(12);


      if(singleWord1) {
        doc.text(50, 135, 'Part 1 - Unrelated Distracters');
        doc.autoTable(singleWord1.summaryColumns, singleWord1.summaryRows, {
          theme: 'grid',
          margin: [100, 50, 50, 50],
          styles: {
            halign: 'center',
            valign: 'middle',
            font: 'helvetica',
            lineColor: 100,
            lineWidth: 1
          },
          headerStyles: {
            fillColor: false,
            textColor: 0
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
          },
          drawRow: function (row) {
            if(row.index === 2) {
              Object.keys(row.cells).forEach(function (key) {
                var cell = row.cells[key];
                cell.styles.lineWidth = 1.5;
              });
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
            font: 'helvetica',
            lineColor: 100,
            lineWidth: 1
          },
          headerStyles: {
            fillColor: false,
            textColor: 0
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
          },
          drawRow: function (row) {
            if(row.index === 2) {
              Object.keys(row.cells).forEach(function (key) {
                var cell = row.cells[key];
                cell.styles.lineWidth = 1.5;
              });
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

      doc.text(50, textHeight, '3. Sentence Comprehension');

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
          font: 'helvetica',
          lineColor: 100,
          lineWidth: 1
        },
        headerStyles: {
          fillColor: false,
          textColor: 0
        },
        createdCell: function (cell, data) {

          if(data.column.dataKey === 'type'){
            cell.styles.fontStyle = 'bold';
          }

          if(cell.text[0] === ''){
            cell.text = 'N/A';
          }

          if(cell.text === ''){
            cell.styles.fillColor = [153,153,153];
          }
        },
        drawRow: function (row) {
          if(row.index === 3) {
            Object.keys(row.cells).forEach(function (key) {
              var cell = row.cells[key];
              cell.styles.lineWidth = 1.5;
            });
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
        doc.text(50, 75, '4. Paragraph Comprehension');
      }
      else {
        doc.text(50, 100, '4. Paragraph Comprehension');
      }

      doc.setFontSize(12);

      doc.autoTable(paragraph.summaryColumns, paragraph.summaryRows, {
        theme: 'grid',
        margin: [100, 50, 50, 50],
        styles: {
          halign: 'center',
          valign: 'middle',
          font: 'helvetica',
          lineColor: 100,
          lineWidth: 1
        },
        headerStyles: {
          fillColor: false,
          textColor: 0
        },
        createdCell: function (cell, data) {

          switch (data.column.dataKey) {
            case 'length':
              cell.styles.fontStyle = 'bold';
              break;
            case 'paragraphs':
              cell.styles.fontStyle = 'bold';
              break;
            case 'lengthScore':
              cell.styles.lineWidth = 1.5;
              break;
            case 'questionType':
              cell.styles.fontStyle = 'bold';
              break;
            case 'typeScore':
              cell.styles.lineWidth = 1.5;
              break;
          }
        },
        drawRow: function (row) {
          if(row.index === 5) {
            Object.keys(row.cells).forEach(function (key) {
              var cell = row.cells[key];
              cell.styles.lineWidth = 1.5;
            });
          }
        }
      });

      doc.addImage(document.getElementById('paragraphSummary').firstChild.firstChild.toDataURL('image/png'), 'PNG', 40, 260, 512, 340);

      footer();
      doc.addPage();
    }

    if(assessment.questions['singleWord-part-1'].completed) {

      doc.setFontSize(20);
      doc.text(50, 50, 'Complete Results');
      doc.rect(50, 65, 495, 2, 'F');
      doc.setFontSize(12);
      doc.text(50, 90, 'Single Word Comprehension - Part 1: Unrelated Distracters');
      doc.setFontSize(8);
      doc.text(50, 110, 'The colour coding in the time column represents relatively slow (dark red) to fast (dark green) responses for this individual. Please see the');
      doc.text(50, 120, 'manual for more detail.');
      doc.setFontSize(12);

      doc.autoTable(singleWord1.columns, singleWord1.rows, {
        theme: 'grid',
        margin: [140, 50, 50, 50],
        styles: {
          halign: 'left',
          valign: 'middle',
          font: 'helvetica',
          lineColor: 100,
          lineWidth: 1
        },
        headerStyles: {
          fillColor: false,
          textColor: 0
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
      doc.setFontSize(8);
      doc.text(50, 50, 'The colour coding in the time column represents relatively slow (dark red) to fast (dark green) responses for this individual. Please see the');
      doc.text(50, 60, 'manual for more detail.');
      doc.setFontSize(12);

      doc.autoTable(singleWord2.columns, singleWord2.rows, {
        theme: 'grid',
        styles: {
          halign: 'center',
          valign: 'middle',
          font: 'helvetica',
          lineColor: 100,
          lineWidth: 1
        },
        margin: { top: 80 },
        headerStyles: {
          fillColor: false,
          textColor: 0
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
          font: 'helvetica',
          lineColor: 100,
          lineWidth: 1
        },
        headerStyles: {
          fillColor: false,
          textColor: 0
        }
      });

      footer();
      doc.addPage();

      doc.text(50, 30, 'Sentence Comprehension: Part 1 - Results');
      doc.setFontSize(8);
      doc.text(50, 50, 'The colour coding in the time column represents relatively slow (dark red) to fast (dark green) responses for this individual. Please see the');
      doc.text(50, 60, 'manual for more detail. Please see the manual for distracters.');
      doc.setFontSize(12);

      doc.autoTable(sentence1.columns, sentence1.rows, {
        theme: 'grid',
        styles: {
          halign: 'center',
          valign: 'middle',
          font: 'helvetica',
          lineColor: 100,
          lineWidth: 1
        },
        margin: {top: 80},
        headerStyles: {
          fillColor: false,
          textColor: 0
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
          font: 'helvetica',
          lineColor: 100,
          lineWidth: 1
        },
        headerStyles: {
          fillColor: false,
          textColor: 0
        }
      });

      footer();
      doc.addPage();

      doc.text(50, 30, 'Sentence Comprehension: Part 2 - Results');
      doc.setFontSize(8);
      doc.text(50, 50, 'The colour coding in the time column represents relatively slow (dark red) to fast (dark green) responses for this individual. Please see the');
      doc.text(50, 60, 'manual for more detail. Please see the manual for distracters.');
      doc.setFontSize(12);

      doc.autoTable(sentence2.columns, sentence2.rows, {
        theme: 'grid',
        styles: {
          halign: 'center',
          valign: 'middle',
          font: 'helvetica',
          lineColor: 100,
          lineWidth: 1
        },
        margin: {top: 80},
        headerStyles: {
          fillColor: false,
          textColor: 0
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

      doc.setFontSize(8);
      doc.text(50, 50, 'The colour coding in the time column represents relatively slow (dark red) to fast (dark green) responses for this individual. Please see the');
      doc.text(50, 60, 'manual for more detail.');
      doc.setFontSize(12);

      var paragraphPage1Rows = paragraph.rows.slice(0,32);
      var paragraphPage2Rows = paragraph.rows.slice(32);

      doc.autoTable(paragraph.columns, paragraphPage1Rows, {
        theme: 'grid',
        styles: {
          halign: 'center',
          valign: 'middle',
          font: 'helvetica',
          lineColor: 100,
          lineWidth: 1
        },
        margin: {top: 80},
        headerStyles: {
          fillColor: false,
          textColor: 0
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
          font: 'helvetica',
          lineColor: 100,
          lineWidth: 1
        },
        headerStyles: {
          fillColor: false,
          textColor: 0
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

      doc.text(50, 30, 'Paragraph Comprehension - Gists');
      doc.setFontSize(8);
      doc.text(50, 50, 'The colour coding in the time column represents relatively slow (dark red) to fast (dark green) responses for this individual. Please see the');
      doc.text(50, 60, 'manual for more detail.');
      doc.setFontSize(12);

      doc.autoTable(paragraph.gistColumns, paragraph.gistRows, {
        theme: 'grid',
        styles: {
          halign: 'center',
          valign: 'middle',
          font: 'helvetica',
          lineColor: 100,
          lineWidth: 1
        },
        margin: {top: 80},
        headerStyles: {
          fillColor: false,
          textColor: 0
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
      doc.addPage();
    }

    if(assessment.questions['reading-scale'].completed && assessment.questions['reading-scale-2'].completed) {
      doc.text(50, 30, 'Reading Scale Part 1');
      doc.setFontSize(8);
      doc.text(50, 50, 'The colour coding in the time column represents relatively slow (dark red) to fast (dark green) responses for this individual. Please see the');
      doc.text(50, 60, 'manual for more detail.');
      doc.setFontSize(12);

      doc.autoTable(reading1.columns, reading1.rows, {
        theme: 'grid',
        margin: [80, 50, 50, 50],
        styles: {
          halign: 'left',
          valign: 'middle',
          font: 'helvetica',
          lineColor: 100,
          lineWidth: 1
        },
        headerStyles: {
          fillColor: false,
          textColor: 0
        },
        createdCell: function (cell, data) {
          switch (data.column.dataKey) {
            case 'time':

              if (cell.raw !== '') {
                cell.styles.fillColor = $window.chroma.hex(reading1.colours[reading1.timeRank.indexOf(cell.raw)]).alpha(0.5).rgb();
                cell.styles.textColor = [0, 0, 0];
              }
              break;
            case 'rowNumber':
              break;
            case 'question':
              break;
            case 'answer':
              break;
          }
        }
      });

      doc.text(50, 300, 'Reading Scale Part 2');
      doc.setFontSize(8);
      doc.text(50, 320, 'The colour coding in the time column represents relatively slow (dark red) to fast (dark green) responses for this individual. Please see the');
      doc.text(50, 330, 'manual for more detail.');
      doc.setFontSize(12);

      doc.autoTable(reading2.columns, reading2.rows, {
        theme: 'grid',
        margin: [350, 50, 50, 50],
        styles: {
          halign: 'left',
          valign: 'middle',
          font: 'helvetica',
          lineColor: 100,
          lineWidth: 1
        },
        headerStyles: {
          fillColor: false,
          textColor: 0
        },
        createdCell: function (cell, data) {
          switch (data.column.dataKey) {
            case 'time':

              if (cell.raw !== '') {
                cell.styles.fillColor = $window.chroma.hex(reading2.colours[reading2.timeRank.indexOf(cell.raw)]).alpha(0.5).rgb();
                cell.styles.textColor = [0, 0, 0];
              }
              break;
            case 'rowNumber':
              break;
            case 'question':
              break;
            case 'answer':
              break;
          }
        }
      });

      footer();
      doc.addPage();
    }

    if(assessment.questions['card-sorting'].completed) {

      doc.text(50, 30, 'Reading Activities Sorting');

      doc.autoTable(sorting.columns, sorting.rows, {
        theme: 'grid',
        margin: [60, 50, 50, 50],
        styles: {
          halign: 'left',
          valign: 'middle',
          font: 'helvetica',
          lineColor: 100,
          lineWidth: 1
        },
        headerStyles: {
          fillColor: false,
          textColor: 0
        }
      });

      footer();
    }

    doc.addPage();

    doc.setFontSize(10);
    doc.text(50, 50, 'This area is intentionally blank and is for the clinician to record any observations or comments from the client.');
    doc.rect(50, 65, 495, 680);

    footer();

    doc.save('report-' + assessment.name + '.pdf');

  };

});
