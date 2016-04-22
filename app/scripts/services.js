'use strict';

angular.module('passerelle2App')
    //.constant('baseURL','http://209.122.232.103:8090')
    //.constant('baseURL', 'http://0.0.0.0:8080')
    .constant('baseURL', 'http://bnb.jchevalier.pro')
    //.constant('baseURL', 'http://0.0.0.0:8091')
    .service('dialogService',[ '$mdDialog', function($mdDialog) {
      
        this.showDialog = function(message, state){
          $mdDialog.show(
            $mdDialog.alert()
              .parent(angular.element(document.body))
              .clickOutsideToClose(true)
              .title('Confirmation')
              .textContent(message)
              .ariaLabel('Alert Message')
              .ok('OK')
              .targetEvent(state)
          );
        };

    }])
    .service('resourcesService',[ '$resource', 'baseURL', function( $resource, baseURL) {

        this.getBookings = function(){
          return $resource(baseURL+'/bookings/:bookingId', {bookingId:'@id'},  {'update':{method:'PUT' }});
        };

        this.getVacations = function(){
          return $resource(baseURL+'/vacation/:vacationId', {vacationId:'@id'} ,  {'update':{method:'PUT' }});
        };

        // TODO: check if still needed 
        this.getDatesByRoom = function(){
          return $resource(baseURL+'/calendar/:room_id', null);
        };

        // get Rooms : resourcesService.getRooms().query({date:date});
        // get one room: resourcesService.getRooms().query({id:id, date:date});
        this.getRooms = function(){
            return $resource(baseURL+'/rooms/:id', null);
        };

        this.getChannels = function(){
            return [
                    {
                      id: 0,
                      text: 'lapasserelledescorton.fr',
                      url: 'http://www.lapasserelledescorton.fr/'
                    },
                    {
                      id: 1,
                      text: 'booking.com',
                      url: 'http://www.booking.com/index.fr.html'
                    },
                    {
                      id: 2,
                      text: 'airbnb.com',
                      url: 'https://www.airbnb.fr/'
                    }
                 ];
        };

        this.getStatuses = function() {
            return [
                    {value: 0, text: 'En attente de paiement'},
                    {value: 1, text: 'Accompte payé'},
                    {value: 2, text: 'Réservation annulée'},
                    {value: 3, text: 'Archivé'}
                   ];
        };

        this.getRoomName = function(rooms, id) {
          for (var i = 0; i < rooms.length; i++) {
            if (id === rooms[i].id) {
              return rooms[i].name;
            }
          }
        };
        
    }])
    .service('formService', function() {
        var timezone = 'Europe/Paris';

        this.getMinDate = function() {
          // now moment in FR
          var now = moment().tz(timezone);
          // normal minDate
          var minDate = now.toDate();
          // the limit moment to book a room : 22h in France
          var limitDate = moment.tz(minDate.toISOString().substring(0, 10)+'T22', timezone);
          // if now is after the limit moment, then the min Date should be the day after
          if (minDate.getTime() > limitDate.toDate().getTime()) {
            minDate = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate()+1 );
          }
          else {
            minDate = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
          }
          return minDate;
        };

        this.getNowISO = function(){
          // now moment in FR
          var now = moment().tz(timezone);
          var nowISO = now.toDate().toISOString();
          return nowISO.substring(0, 10);
        };

        this.updateDateOutLimits = function (dateIn) {
          this.minDateOut = new Date( dateIn.getFullYear(), dateIn.getMonth(), dateIn.getDate()+1 );   
          this.maxDateOut = new Date( this.minDateOut.getFullYear(), this.minDateOut.getMonth()+1, this.minDateOut.getDate() ); 
        };

        this.getRealDate = function (stringDate) {
          var date = moment.tz(stringDate, timezone); 
          return new Date ( date.year(), date.month(), date.date() );
        };

        this.updateDateEnd = function(dateStart, dateEnd){
          this.updateDateOutLimits(dateStart);
          if(dateStart >= dateEnd) {
              dateEnd = this.minDateOut;
          }
          if(dateEnd > this.maxDateOut) {
              dateEnd = this.maxDateOut;
          }
          return dateEnd;
        };

        this.isRoomAvailable = function(dateInA, dateOutA, dateInB, dateOutB) {
            return ( (dateInA.getTime() > dateInB.getTime() && dateInA.getTime() >= dateOutB.getTime()) || 
                      (dateInB.getTime() > dateInA.getTime() && dateInB.getTime() >= dateOutA.getTime()) );
        };

        this.isPeriodAvailable = function(roomDatas, dateIn, dateOut) {
            var result = true;
            for (var i = roomDatas.bookings.length - 1; i >= 0; i--) {
              if (!this.isRoomAvailable(dateIn, dateOut, this.getRealDate(roomDatas.bookings[i].dateIn), this.getRealDate(roomDatas.bookings[i].dateOut))) {
                  result = false;
                  break;
              }
            }
            for (i = roomDatas.vacations.length - 1; i >= 0; i--) {
              if (!this.isRoomAvailable(dateIn, dateOut, this.getRealDate(roomDatas.vacations[i].dateIn), this.getRealDate(roomDatas.vacations[i].dateOut))) {
                  result = false;
                  break;
              }
            }
            return result;
        };

        this.removeVacationFromDates = function(roomDatas, dateIn, dateOut) {
          var index;
          for (var i = 0; i < roomDatas.vacations.length; i++) {
            if (this.getRealDate(roomDatas.vacations[i].dateIn).getTime() === dateIn.getTime() &&
                this.getRealDate(roomDatas.vacations[i].dateOut).getTime() === dateOut.getTime() ) {
              index = i;
              break;
            }
          }
          if (index) {
            roomDatas.vacations.splice(index, 1);
          }
          return roomDatas;
        };

        this.removeBookingFromDates = function(roomDatas, dateIn, dateOut) {
          var isPresent = false;
          var i = 0;
          for (i = 0; i < roomDatas.bookings.length; i++) {
            if (this.getRealDate(roomDatas.bookings[i].dateIn).getTime() === dateIn.getTime() &&
                this.getRealDate(roomDatas.bookings[i].dateOut).getTime() === dateOut.getTime() ) {
              isPresent = true;
              break;
            }
          }
          if (isPresent) {
            roomDatas.bookings.splice(i, 1);
          }
          return roomDatas;
        };

        this.minDate = this.getMinDate();
        this.minDateOut = this.minDate;
        this.maxDateOut = this.minDate;
    })
;
