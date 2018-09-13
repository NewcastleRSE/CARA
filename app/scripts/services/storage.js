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

          return $q(function(resolve) {

            setTimeout(function() {
              if (item) {
                // Load Item
                assessments = JSON.parse(localStorage.getItem(item));


              } else {
                // Load all
                for (i=0; i < 6; i++) {

                  assessments['rca-assessment-' + i] = JSON.parse(localStorage.getItem('rca-assessment-' + i));
                }
              }


              resolve(assessments);
            }, 0);
          });


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

              localStorage.setItem(Storage.currentSlot, JSON.stringify(savedItem));

              if (localStorage.getItem(Storage.currentSlot) === JSON.stringify(savedItem)) {
                resolve();
                $rootScope.$emit('storage-updated');
              } else {
                reject();
              }




            }, 0);
          });
        };

    Storage.clearSlot = function() {
      localStorage.removeItem(Storage.currentSlot);
    };

        return Storage;
  });
