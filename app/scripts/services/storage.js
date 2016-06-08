'use strict';

/**
 * @ngdoc service
 * @name rcaApp.Storage
 * @description
 * # Storage
 * Service in the rcaApp.
 */
angular.module('rcaApp')
  .service('Storage', function ($window, $rootScope, $q) {

        var Storage = {};

        Storage.currentSlot = 'rca-assessment-0';

        Storage.load = function(item){
          var assessments = {},
              i;

          if (item) {
            // Load Item
            return JSON.parse(localStorage.getItem(item));


          } else {
            // Load all
            for (i=0; i < 6; i++) {

              assessments['rca-assessment-' + i] = JSON.parse(localStorage.getItem('rca-assessment-' + i));
            }

            return assessments;
          }
        };

        Storage.save = function(questions, meta) {

          meta = meta || {};

          return $q(function(resolve, reject) {
            setTimeout(function() {

              var savedItem = {
                name : 'Slot ' + Storage.currentSlot,
                modified: new Date().getTime(),
                questions: questions,
                status: 'In Progress'
              };

              savedItem = angular.extend(savedItem, meta);

              console.log('saving',Storage.currentSlot);

              localStorage.setItem(Storage.currentSlot, JSON.stringify(savedItem));

              $rootScope.$emit('storage-updated');

              resolve();
            }, 0);
          });
        };

    Storage.clearSlot = function() {
      localStorage.removeItem(Storage.currentSlot);
    };

        return Storage;
  });