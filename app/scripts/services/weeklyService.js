'use strict';


var weeklyService = angular.module('weeklyService', ['ngResource']);

weeklyService.factory('WeeklyCategoryTotals', ['$resource',
  function($resource){
    return $resource('api/weeklytotalsbycategory/:year/:month', {}, {});
  }]);
  
weeklyService.factory('WeeklyCategoryFailedTotals', ['$resource',
  function($resource){
    return $resource('api/weeklyfailedtotalsbycategory/:year/:month', {}, {});
  }]);
  
weeklyService.factory('WeeklyServiceTotals', ['$resource',
  function($resource){
    return $resource('api/weeklytotalsbyservice/:year/:month/:category', {}, {});
  }]);
  
weeklyService.factory('WeeklyServiceFailedTotals', ['$resource',
  function($resource){
    return $resource('api/weeklyfailedtotalsbyservice/:year/:month/:category', {}, {});
  }]);

weeklyService.factory('WeeklyFailedReasonTotals', ['$resource',
  function($resource){
    return $resource('api/weeklyfailedreasontotalsbyexception/:year/:month/:category', {}, {});
  }]);
