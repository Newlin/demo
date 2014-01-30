'use strict';

angular.module('edeliveryApp', [
  'ui.bootstrap',
  'ui.chart',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'monthlyService',
  'weeklyService',
  'dailyService',
  'indexService',
  'indexControllers',
  'monthlyControllers',
  'weeklyControllers',
  'dailyControllers',
  'edeliveryControllers',
  'utilService'

]).config(function ($routeProvider) {
    $routeProvider
      .when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
      })
      .when('/daily/:dt/:category', {
        templateUrl: 'views/daily.html',
        controller: 'DailyCtrl',
        loadedView: 'daily'
      })
      .when('/weekly/:dt/:category', {
        templateUrl: 'views/weekly.html',
        controller: 'WeeklyCtrl',
        loadedView: 'weekly'
      })
      .when('/monthly/:dt/:category', {
        templateUrl: 'views/monthly.html',
        controller: 'MonthlyCtrl',
        loadedView: 'monthly'
      })    
      .otherwise({
        redirectTo: '/main'
      });
  });