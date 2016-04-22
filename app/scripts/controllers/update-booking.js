'use strict';

angular.module('passerelle2App')
    .controller('UpdateBookingCtrl', [ '$scope', 'resourcesService', 'formService', '$stateParams', '$log', function($scope, resourcesService, formService, $stateParams, $log) { 
       	var selectedId = $stateParams.bookingId;
    	$scope.isUpdate = true;
    	$scope.rowTitle = 'Modifier une réservation';
		$scope.formTitle = 'Modifier la réservation';

        var date = formService.getNowISO();

    	// init partials
		$scope.calendarsTemplate = 'views/calendars.html';

		// init $scope Resource values 
        $scope.channels = resourcesService.getChannels();
		$scope.statuses = resourcesService.getStatuses();
        $scope.rooms = resourcesService.getRooms().query({date:date});
		$scope.booking = resourcesService.getBookings().get({bookingId:selectedId});
        $scope.booking.$promise.then( 
            // success
            function(response) {
                var dateIn = formService.getRealDate (response.dateIn);
                var dateOut = formService.getRealDate (response.dateOut);
                $scope.booking = response;
                $scope.booking.dateIn = dateIn;
                $scope.booking.dateOut = dateOut;
                $scope.rowTitle = 'Réservation n° ' + selectedId; 
            },
            // fail
            function(response) {
                $scope.retrieveError = true;
                $scope.errorMessage = 'La réservation n\'a pas été trouvée' ;
                $log.warn('Error: '+response.status + ' ' + response.statusText);
            }
        );
    	
}]);