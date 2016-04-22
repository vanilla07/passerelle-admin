'use strict';

angular.module('passerelle2App')
    .controller('AddVacationCtrl', [ '$scope', 'resourcesService', 'formService', '$log', function($scope, resourcesService, formService, $log) { 
		$scope.$log = $log;
		
		// init partials
		$scope.calendarsTemplate = 'views/calendars.html';
		$scope.modalTemplate = 'views/vacation-modal.html';

		var date = formService.getNowISO();
		
		// init $scope Resource values 
        resourcesService.getVacations().query(
            function(response) {
                $scope.vacations = response;
            },
            function(response) {
                $scope.message = 'Error: '+response.status + ' ' + response.statusText;
            }
        );
        
        $scope.rooms = resourcesService.getRooms().query({date:date});
		$scope.getRoomName = resourcesService.getRoomName;

		// display behavioural values
		$scope.rowTitle = 'Nouvelle fermeture';
		$scope.formTitle = 'Fermer des chambres';
		$scope.selectedVacation = '';
		$scope.showVacations = false;
		$scope.selectedRoom = '';
		$scope.tab = 'all';


		// TODO essayer de refactorer ce code aussi present pour les bookings
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

        $scope.setSelectedVacation = function (vacation) {
        	$scope.selectedVacation = vacation;
        };

		$scope.sort = 'id';
		$scope.reverseSort = false;
		$scope.sortVacationBy = function (criteria){
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