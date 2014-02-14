'use strict';


var indexService = angular.module('indexService', ['ngResource']);

indexService.factory('ServiceCategories', ['$resource',
  function($resource){
    return $resource('api/servicecategories', {}, {});
  }]);
  
indexService.factory('Services', ['$resource',
  function($resource){
    return $resource('api/services', {}, {});
  }]);


    
