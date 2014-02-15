'use strict';

angular.module('edeliveryApp', [
  'ui.bootstrap',
  'ui.chart',
  'ngGrid',
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
  'activityService',
  'utilService',
  'auth0',
  'authInterceptor'
]).config(function ($routeProvider, authProvider) {
    $routeProvider
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
      })    
      .when('/', {
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
      .when('/logout', {
        templateUrl: 'views/logout.html',
        controller: 'LogoutCtrl',
      })      
      .otherwise({
        redirectTo: '/login'
      });
    authProvider.init({
      domain: 'mikenewlin.auth0.com',
      clientID: 'Bl2CaO5KvF36RoOHJmdPJUdIcWZOGMoY',
      callbackURL: 'http://newlin-demo.herokuapp.com/',
      callbackOnLocationHash: true
     });       
  });