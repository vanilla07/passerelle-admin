'use strict';

/**
 * @ngdoc function
 * @name passerelleAngularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the passerelleAngularApp
 */
angular.module('passerelle2App')
  .controller('MainCtrl', [ '$scope', 'resourcesService', 'formService', function($scope, resourcesService, formService) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    var date = formService.getNowISO();
    // Resource variables
    $scope.nextBookings = [];
    $scope.channels = resourcesService.getChannels();
	  $scope.statuses = resourcesService.getStatuses();
    $scope.rooms = resourcesService.getRooms().query({date:date});
    $scope.rooms.$promise.then(function(data) {
      $scope.nextBookings = [];
      // parcours des chambres
      for (var i = 0; i < data.length; i++) {
        // recuperation de la resa en cours ou la prochaine
        var booking = data[i].bookings[0];
        // si elle existe : on la sauvegarde pour affichage
        if (booking) {
          var fullBooking = resourcesService.getBookings().get({bookingId:booking.id});
          fullBooking.$promise.roomName = data[i].name;
          $scope.nextBookings.push(fullBooking);
        }
        else {
          var emptyBooking = {};
          emptyBooking.roomName = data[i].name;
          emptyBooking.isEmpty = true;
          $scope.nextBookings.push(emptyBooking);
        }
      }
    });

    $scope.getRoomName = resourcesService.getRoomName;

    $scope.selectBooking = function(id) {
      for (var i = 0; i < $scope.nextBookings.length; i++) {
        if (id === $scope.nextBookings[i].id) {
          $scope.selectedBooking = $scope.nextBookings[i];
          break;
        }
      }
    };

    $scope.modalTemplate = 'views/booking-modal.html';
  }]);
