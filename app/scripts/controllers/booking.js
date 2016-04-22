'use strict';

angular.module('passerelle2App')
    .controller('BookCtrl', [ '$scope', 'resourcesService', 'formService' ,'$log', '$state', 'dialogService', 
    function($scope, resourcesService, formService, $log, $state, dialogService) { 
		$scope.$log = $log;		
		$scope.minDate = formService.minDate;
		//recalculate the limits of dateOut
		formService.updateDateOutLimits($scope.minDate);
		$scope.minDateOut = formService.minDateOut;
		$scope.maxDateOut = formService.maxDateOut;
		
		$scope.checkavailability = function (booking) {
			$scope.hideAvailibilityMsg = true;
			if (booking.room && booking.dateIn) {
				$scope.roomName = resourcesService.getRoomName($scope.rooms, parseInt(booking.room));
				var date = booking.dateIn.toISOString().substring(0, 10);
				resourcesService.getRooms().get({id:booking.room, date:date}).$promise.then( function(data) {
					if ($scope.isUpdate) {
						data = formService.removeBookingFromDates(data, $scope.oldDateIn, $scope.oldDateOut);
					}
					$scope.hideAvailibilityMsg = formService.isPeriodAvailable(data, booking.dateIn, booking.dateOut);
				});
			}
		};

		$scope.onChangeDateStart = function () {
			//update dateOut if needed
			$scope.booking.dateOut = formService.updateDateEnd($scope.booking.dateIn, $scope.booking.dateOut);
			//update the limits of dateOut
			formService.updateDateOutLimits($scope.booking.dateIn);
			$scope.minDateOut = formService.minDateOut;
			$scope.maxDateOut = formService.maxDateOut;
			//update error message
			$scope.checkavailability($scope.booking);	
		};

		$scope.updateAvailability = function () {
			$scope.checkavailability($scope.booking);
		};

		// functions to send the form
		$scope.newBooking = function () {
			$scope.booking = 
				{
					room:'',
					name:'', 
					email:'',
					guestsNumber:2,
					dateIn: $scope.minDate,
					dateOut: $scope.minDateOut, 
					notes:'', 
					dateReservation:'',
					status:0,
					channel:0,
					telephone:''
				};
		};
		
		if ($scope.isUpdate) {
			$scope.booking.$promise.then(function(data){
				$scope.oldDateIn = data.dateIn;
				$scope.oldDateOut = data.dateOut;
				$scope.checkavailability(data);
			});
		}
		else {
			$scope.newBooking();
			$scope.checkavailability($scope.booking);
		}

		$scope.book = function () {
        
            // new booking
            if (!$scope.isUpdate) {
            	$scope.booking.dateReservation = new Date().toISOString();
            	resourcesService.getBookings().save($scope.booking, 
            		// recuperer le resultat de save (success ou error)
            		function() {
		                $scope.message = 'La réservation a bien été ajoutée'; 
		                // succes on efface les donnees du formulaire
	            		$scope.newBooking();
	            		//affichage du message de confirmation
	            		dialogService.showDialog($scope.message, $state.reload());
		            },
		            function() {
		                $scope.message = 'Echec de l\'ajout de la réservation';
		                //affichage message de confirmation
		                dialogService.showDialog($scope.message, $state.reload());
		            }
            	); 
	        }
	        // update booking
	        else {
	        	var id = $scope.booking.id;
	        	resourcesService.getBookings().update({ bookingId: id }, $scope.booking, 
            		function() {
		                $scope.message = 'La réservation a bien été modifiée'; 
		                dialogService.showDialog($scope.message, $state.reload());
		            },
		            function(response) {
		                $scope.message = 'Echec de la modification de la réservation';
		                $log.warn ('Error: '+response.status + ' ' + response.statusText);
		                dialogService.showDialog($scope.message, $state.reload());
		            }
		        );
	        }

		};

	}])
;