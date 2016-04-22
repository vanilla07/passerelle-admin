'use strict';

describe('formService test', function () {
  var formService;
  beforeEach(module('passerelle2App'));

  beforeEach(inject(function (_formService_) {
    formService = _formService_;
  }));

  var dateFullIn = new Date ('2016-03-15');
  var dateFullOut = new Date ('2016-03-25');

  it('should return false as the period contains the unavailable period', function () {
    expect(formService.isRoomAvailable(new Date ('2016-03-10'),new Date ('2016-03-30'), dateFullIn, dateFullOut)).toBe(false);
  });
  it('should return false as the period is inside the unavailable period', function () {
    expect(formService.isRoomAvailable(new Date ('2016-03-16'),new Date ('2016-03-20'), dateFullIn, dateFullOut)).toBe(false);
  });
  it('should return false as the ending date is inside the unavailable period', function () {
    expect(formService.isRoomAvailable(new Date ('2016-03-10'),new Date ('2016-03-20'), dateFullIn, dateFullOut)).toBe(false);
  });
  it('should return false as the beginning date is inside the unavailable period', function () {
    expect(formService.isRoomAvailable(new Date ('2016-03-15'),new Date ('2016-03-30'), dateFullIn, dateFullOut)).toBe(false);
  });
  it('should return false as the 2 periods are equal', function () {
    expect(formService.isRoomAvailable(new Date ('2016-03-15'),new Date ('2016-03-25'), dateFullIn, dateFullOut)).toBe(false);
  });
  it('should return true as the beginning date is the ending unavailable date', function () {
    expect(formService.isRoomAvailable(new Date ('2016-03-25'),new Date ('2016-03-30'), dateFullIn, dateFullOut)).toBe(true);
  });
  it('should return true as the ending date is the beginning unavailable date', function () {
    expect(formService.isRoomAvailable(new Date ('2016-03-10'),new Date ('2016-03-15'), dateFullIn, dateFullOut)).toBe(true);
  });
  it('should return true as the ending date is before the beginning unavailable date', function () {
    expect(formService.isRoomAvailable(new Date ('2016-03-05'),new Date ('2016-03-10'), dateFullIn, dateFullOut)).toBe(true);
  });
  it('should return true as the beginning date is after the ending unavailable date', function () {
    expect(formService.isRoomAvailable(new Date ('2016-03-27'),new Date ('2016-03-30'), dateFullIn, dateFullOut)).toBe(true);
  }); 

});