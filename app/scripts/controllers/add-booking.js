'use strict';

angular.module('passerelle2App')
    .controller('AddBookingCtrl', [ '$scope', 'resourcesService', 'formService', '$log', function($scope, resourcesService, formService, $log) { 
		$scope.$log = $log;
		
		// init partials
		$scope.calendarsTemplate = 'views/calendars.html';
		$scope.modalTemplate = 'views/booking-modal.html';

		var date = formService.getNowISO();
		
		// init $scope Resource values 
        resourcesService.getBookings().query(
            function(response) {
                $scope.bookings = response;
            },
            function(response) {
                $scope.message = 'Error: '+response.status + ' ' + response.statusText;
            }
        );
        $scope.channels = resourcesService.getChannels();
		$scope.statuses = resourcesService.getStatuses();
        $scope.rooms = resourcesService.getRooms().query({date:date});

		$scope.getRoomName = resourcesService.getRoomName;

		// display behavioural values
		$scope.rowTitle = 'Nouvelle réservation';
		$scope.formTitle = 'Ajouter une réservation';
		$scope.selectedBooking = '';
		$scope.showBookings = false;
		$scope.selectedRoom = '';
		$scope.tab = 'all';

		$scope.select = function(setTab) {
            $scope.tab = setTab;
            $scope.selectedRoom = setTab;
            if (setTab==='all') {
            	$scope.selectedRoom = '';
            }
            
        };

        $scope.isSelected = function (checkTab) {
            return ($scope.tab === checkTab);
        };

        $scope.setSelectedBooking = function (booking) {
        	$scope.selectedBooking = booking;
        };

		$scope.sort = 'id';
		$scope.reverseSort = false;
		$scope.sortBookingBy = function (criteria){
			if ($scope.sort !== criteria) {
				$scope.sort = criteria;
				$scope.reverseSort = false;
			}
			else {
				$scope.reverseSort = !$scope.reverseSort;
			}
		};

	}])
;