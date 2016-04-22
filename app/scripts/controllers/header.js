'use strict';

angular.module('passerelle2App')
  .controller('HeaderCtrl', [ '$scope', '$location', function($scope, $location) { 
    		
	$scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };

  }]);