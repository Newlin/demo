'use strict';


var weeklyService = angular.module('weeklyService', ['ngResource']);

weeklyService.factory('WeeklyCategoryTotals', ['$resource',
  function($resource){
    return $resource('weeklytotalsbycategory/:year/:month', {}, {});
  }]);
  
weeklyService.factory('WeeklyCategoryFailedTotals', ['$resource',
  function($resource){
    return $resource('weeklyfailedtotalsbycategory/:year/:month', {}, {});
  }]);
  
weeklyService.factory('WeeklyServiceTotals', ['$resource',
  function($resource){
    return $resource('weeklytotalsbyservice/:year/:month/:category', {}, {});
  }]);
  
weeklyService.factory('WeeklyServiceFailedTotals', ['$resource',
  function($resource){
    return $resource('weeklyfailedtotalsbyservice/:year/:month/:category', {}, {});
  }]);

weeklyService.factory('WeeklyFailedReasonTotals', ['$resource',
  function($resource){
    return $resource('weeklyfailedreasontotalsbyexception/:year/:month/:category', {}, {});
  }]);
