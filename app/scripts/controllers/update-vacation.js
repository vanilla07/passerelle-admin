'use strict';

angular.module('passerelle2App')
    .controller('UpdateVacationCtrl', [ '$scope', 'resourcesService', 'formService', '$stateParams', '$log', function($scope, resourcesService, formService, $stateParams, $log) { 
       	var selectedId = $stateParams.vacationId;
    	$scope.isUpdate = true;
    	$scope.rowTitle = 'Modifier une fermeture';
		$scope.formTitle = 'Modifier la fermeture';

        var date = formService.getNowISO();

    	// init partials
		$scope.calendarsTemplate = 'views/calendars.html';

		// init $scope Resource values 
        $scope.rooms = resourcesService.getRooms().query({date:date});
		$scope.vacation = resourcesService.getVacations().get({vacationId:selectedId});
        $scope.vacation.$promise.then( 
            // success
            function(response) {
                $scope.vacation = response;
                $scope.vacation.dateStart = formService.getRealDate (response.dateStart);
                $scope.vacation.dateEnd = formService.getRealDate (response.dateEnd);
                $scope.rowTitle = 'Fermeture n° ' + selectedId; 
            },
            // fail
            function(response) {
                $scope.retrieveError = true;
                $scope.errorMessage = 'La fermeture n\'a pas été trouvée' ;
                $log.warn('Error: '+response.status + ' ' + response.statusText);
            }
        );
    	
}]);