'use strict';


var monthlyService = angular.module('monthlyService', ['ngResource']);

monthlyService.factory('MonthlyCategoryTotals', ['$resource',
  function($resource){
    return $resource('monthlytotalsbycategory/:year', {}, {});
  }]);
  
monthlyService.factory('MonthlyCategoryFailedTotals', ['$resource',
  function($resource){
    return $resource('monthlyfailedtotalsbycategory/:year', {}, {});
  }]);
  
monthlyService.factory('MonthlyServiceTotals', ['$resource',
  function($resource){
    return $resource('monthlytotalsbyservice/:year/:category', {}, {});
  }]);
  
monthlyService.factory('MonthlyServiceFailedTotals', ['$resource',
  function($resource){
    return $resource('monthlyfailedtotalsbyservice/:year/:category', {}, {});
  }]);

monthlyService.factory('MonthlyFailedReasonTotals', ['$resource',
  function($resource){
    return $resource('monthlyfailedreasontotalsbyexception/:year/:category', {}, {});
  }]);

    
