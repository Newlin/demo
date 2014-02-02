'use strict';


var dailyService = angular.module('dailyService', ['ngResource']);

dailyService.factory('DailyCategoryTotals', ['$resource',
  function($resource){
    return $resource('dailytotalsbycategory/:weekstart', {}, {});
  }]);
  
dailyService.factory('DailyCategoryFailedTotals', ['$resource',
  function($resource){
    return $resource('dailyfailedtotalsbycategory/:weekstart', {}, {});
  }]);
  
dailyService.factory('DailyServiceTotals', ['$resource',
  function($resource){
    return $resource('dailytotalsbyservice/:weekstart/:category', {}, {});
  }]);
  
dailyService.factory('DailyServiceFailedTotals', ['$resource',
  function($resource){
    return $resource('dailyfailedtotalsbyservice/:weekstart/:category', {}, {});
  }]);

dailyService.factory('DailyFailedReasonTotals', ['$resource',
  function($resource){
    return $resource('dailyfailedreasontotalsbyexception/:weekstart/:category', {}, {});
  }]);
dailyService.factory('DayTotalsList', ['$resource',
  function($resource){
    return $resource('daytotalslisting/:date', {}, {});
  }]);