'use strict';

/**
 * @ngdoc overview
 * @name passerelleAngularApp
 * @description
 * # passerelleAngularApp
 *
 * Main module of the application.
 */

angular
  .module('passerelle2App', [
    'ui.router',
    'ngResource',
    'ngMessages',
    'ngAria',
    'ngAnimate',
    'ui.bootstrap',
    'ngMaterial',
    'angularMoment',
    'angular-confirm'
  ])
  .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        
      // route for the home page
      .state('app', {
          url:'/',
          views: {
              'header': {
                  templateUrl : 'views/header.html',
                  controller  : 'HeaderCtrl'
              },
              'content': {
                  templateUrl : 'views/main.html',
                  controller  : 'MainCtrl'
              },
              'footer': {
                  templateUrl : 'views/footer.html',
              }
          }

      })

      /// BOOKINGS
      .state('app.bookings', {
          abstract: true,
          url:'bookings',
          views: {
              'content@': {
                  templateUrl : 'views/booking.html',
                  controller  : 'AddBookingCtrl'                  
              }
          },
      })
      /// route for the add reservation page
      .state('app.bookings.add', {
          url:'/add',
          templateUrl: 'views/booking-form.html'
      })
      .state('app.updatebooking', {
          abstract: true,
          url:'booking/:bookingId',
          views: {
              'content@': {
                  templateUrl : 'views/booking.html',
                  controller  : 'UpdateBookingCtrl'                  
              }
          }
      })
      /// route for the update booking page
      .state('app.updatebooking.form', {
          url: '/update',
          templateUrl: 'views/booking-form.html'
      })
      /// END BOOKINGS

      /// VACATION
      .state('app.vacation', {
          abstract: true,
          url:'vacation',
          views: {
              'content@': {
                  templateUrl : 'views/vacation.html',
                  controller  : 'AddVacationCtrl'                  
              }
          }
      })
      /// route for the add vacation page
      .state('app.vacation.add', {
          url:'/add',
          templateUrl: 'views/vacation-form.html'
      })
      .state('app.updatevacation', {
          abstract: true,
          url:'vacation/:vacationId',
          views: {
              'content@': {
                  templateUrl : 'views/vacation.html',
                  controller  : 'UpdateVacationCtrl'                  
              }
          }
      })
      /// route for the update vacation page
      .state('app.updatevacation.form', {
          url: '/update',
          templateUrl: 'views/vacation-form.html'
      })
      /// END VACATION
      ;
    
    $urlRouterProvider.otherwise('/');

    
  }])
  .config(function($provide) {
      $provide.decorator('$state', function($delegate, $stateParams) {
          $delegate.forceReload = function() {
              return $delegate.go($delegate.current, $stateParams, {
                  reload: true,
                  inherit: false,
                  notify: true
              });
          };
          return $delegate;
      });
  })
  .config(function($mdDateLocaleProvider) {
    // Can change week display to start on Monday.
    $mdDateLocaleProvider.firstDayOfWeek = 1;
    $mdDateLocaleProvider.shortDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    $mdDateLocaleProvider.formatDate = function(date) {
      return moment(date).format('DD/MM/YYYY');
    };
    $mdDateLocaleProvider.parseDate = function(dateString) {
        var m = moment(dateString, 'DD/MM/YYYY', true);
        return m.isValid() ? m.toDate() : new Date(NaN); 
    };
  })
  .run(function($rootScope) {
    $rootScope.$on('$viewContentLoaded',function(){
      $('html, body').animate({ scrollTop: 0 }, 200);
    });
  })
;
