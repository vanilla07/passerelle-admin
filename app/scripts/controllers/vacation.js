'use strict';

angular.module('passerelle2App')
    .controller('VacationCtrl', [ '$scope', 'resourcesService', 'formService', '$log', '$state', 'dialogService', 
    	function($scope, resourcesService, formService, $log, $state, dialogService ) { 
		$scope.$log = $log;
		$scope.noRoomSelected = false;
		$scope.selectedRooms = [];

		
		$scope.minDate = formService.minDate;
		//recalculate the limits of dateOut
		formService.updateDateOutLimits($scope.minDate);
		$scope.minDateOut = formService.minDateOut;
		$scope.maxDateOut = formService.maxDateOut;
		
		var j = 0;
		$scope.checkAvailability = function () {
			for (j = $scope.selectedRooms.length - 1; j >= 0; j--) {
				$scope.checkavailabilityByRoom($scope.vacation, $scope.selectedRooms[j]);
				if (!$scope.hideAvailibilityMsg) {
					$scope.roomName = resourcesService.getRoomName($scope.rooms, $scope.selectedRooms[j]);
					break;
				}
			}
		};
		$scope.checkavailabilityByRoom = function (vacation, room) {
			$scope.hideAvailibilityMsg = true;
			if (room && vacation.dateStart) {
				var date = vacation.dateStart.toISOString().substring(0, 10);
				resourcesService.getRooms().get({id:room, date:date}).$promise.then( function(data) {
					if ($scope.isUpdate) {
						data = formService.removeVacationFromDates(data, $scope.oldDateIn, $scope.oldDateOut);
					}
					$scope.hideAvailibilityMsg = formService.isPeriodAvailable(data, vacation.dateStart, vacation.dateEnd);
				});
			}
		};

		$scope.onChangeDateStart = function () {
			//update dateEnd if needed
			$scope.vacation.dateEnd = formService.updateDateEnd($scope.vacation.dateStart, $scope.vacation.dateEnd);
			//update the limits of dateOut
			formService.updateDateOutLimits($scope.vacation.dateStart);
			$scope.minDateOut = formService.minDateOut;
			$scope.maxDateOut = formService.maxDateOut;
			//update error message
			$scope.checkAvailability();	
		};
		
		$scope.initSelectedRooms = function () {
			$scope.selectedRooms = [];
			for (j = 0; j < $scope.rooms.length; j++) {
				$scope.selectedRooms.push($scope.rooms[j].id);
			}
		};

		$scope.toggleRoom = function(item, list) {
			var idx = list.indexOf(item);
			if (idx > -1) { list.splice(idx, 1); }
			else { list.push(item); }
			// error message if no room selected
			$scope.noRoomSelected = list.length === 0;
			// update error message for availability
			$scope.checkAvailability(); 
		};
		$scope.existsRoom = function(item, list) {
			return list.indexOf(item) > -1;
		};

		//functions to send the form
		$scope.newVacation = function () {
			$scope.vacation = 
				{
					name:'', 
					dateStart: $scope.minDate,
					dateEnd: $scope.minDateOut, 
					notes:'',
					rooms: [] 
				};
		};

		if ($scope.isUpdate) {
			$scope.vacation.$promise.then(function(data){
				$scope.oldDateIn = data.dateStart;
				$scope.oldDateOut = data.dateEnd;
				for (var i = 0; i < data.rooms.length; i++) {
					$scope.selectedRooms.push(data.rooms[i].room);
				}
				$scope.checkAvailability();
			});
		}
		else {
			// initialize the variables
			$scope.rooms.$promise.then( function(){
				$scope.initSelectedRooms();
			});
			$scope.newVacation();
			$scope.checkAvailability();
		}

		$scope.addVacation = function () {
            // new vacation
            if (!$scope.isUpdate) {
            	for (var i = 0; i < $scope.selectedRooms.length; i++) {
	            	$scope.vacation.rooms.push({room : $scope.selectedRooms[i]});
	            }
		        resourcesService.getVacations().save($scope.vacation,
		        	function() {
		                $scope.message = 'La fermeture a bien été enregistrée'; 
		                dialogService.showDialog($scope.message, $state.reload());
		            },
		            function(response) {
		                $scope.message = 'Echec de l\'enregistrement de la fermeture';
		                $log.warn ('Error: '+response.status + ' ' + response.statusText);
		                dialogService.showDialog($scope.message, $state.reload());
		            }
		        );               
			}
			// update vacation
			else {
				$scope.vacation.rooms.length = 0;
				for (var j = 0; j < $scope.selectedRooms.length; j++) {
	            	$scope.vacation.rooms.push({room : $scope.selectedRooms[j]});
	            }
				resourcesService.getVacations().update({ vacationId: $scope.vacation.id }, $scope.vacation, 
            		function() {
		                $scope.message = 'La fermeture a bien été modifiée'; 
		                dialogService.showDialog($scope.message, $state.reload());
		            },
		            function(response) {
		                $scope.message = 'Echec de la modification de la fermeture';
		                $log.warn ('Error: '+response.status + ' ' + response.statusText);
		                dialogService.showDialog($scope.message, $state.reload());
		            }
		        );
			}
		};
	}])
;