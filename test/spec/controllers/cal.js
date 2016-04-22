'use strict';

describe('Controller: CalCtrl', function () {

  // load the controller's module
  beforeEach(module('passerelle2App'));

  var CalCtrl, $scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    $scope = $rootScope.$new();
    CalCtrl = $controller('CalCtrl', {
      $scope: $scope
      // place here mocked dependencies
    });
  }));
});