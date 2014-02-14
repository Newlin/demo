'use strict';


var dailyService = angular.module('dailyService', ['ngResource']);

dailyService.factory('DailyCategoryTotals', ['$resource',
  function($resource){
    return $resource('api/dailytotalsbycategory/:weekstart', {}, {});
  }]);
  
dailyService.factory('DailyCategoryFailedTotals', ['$resource',
  function($resource){
    return $resource('api/dailyfailedtotalsbycategory/:weekstart', {}, {});
  }]);
  
dailyService.factory('DailyServiceTotals', ['$resource',
  function($resource){
    return $resource('api/dailytotalsbyservice/:weekstart/:category', {}, {});
  }]);
  
dailyService.factory('DailyServiceFailedTotals', ['$resource',
  function($resource){
    return $resource('api/dailyfailedtotalsbyservice/:weekstart/:category', {}, {});
  }]);

dailyService.factory('DailyFailedReasonTotals', ['$resource',
  function($resource){
    return $resource('api/dailyfailedreasontotalsbyexception/:weekstart/:category', {}, {});
  }]);
dailyService.factory('DayTotalsList', ['$resource',
  function($resource){
    return $resource('api/daytotalslisting/:date', {}, {});
  }]);