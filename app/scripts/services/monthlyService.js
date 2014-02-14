'use strict';


var monthlyService = angular.module('monthlyService', ['ngResource']);

monthlyService.factory('MonthlyCategoryTotals', ['$resource',
  function($resource){
    return $resource('api/monthlytotalsbycategory/:year', {}, {});
  }]);
  
monthlyService.factory('MonthlyCategoryFailedTotals', ['$resource',
  function($resource){
    return $resource('api/monthlyfailedtotalsbycategory/:year', {}, {});
  }]);
  
monthlyService.factory('MonthlyServiceTotals', ['$resource',
  function($resource){
    return $resource('api/monthlytotalsbyservice/:year/:category', {}, {});
  }]);
  
monthlyService.factory('MonthlyServiceFailedTotals', ['$resource',
  function($resource){
    return $resource('api/monthlyfailedtotalsbyservice/:year/:category', {}, {});
  }]);

monthlyService.factory('MonthlyFailedReasonTotals', ['$resource',
  function($resource){
    return $resource('api/monthlyfailedreasontotalsbyexception/:year/:category', {}, {});
  }]);

    
