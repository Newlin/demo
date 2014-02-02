'use strict';

var app = angular.module('activityService', ['ngResource']);

app.service('Activity', function(){
	
     var lastUpdate = new Date();
     var lastViewed = new Date();

     return {
     	getLastUpdate: function () {
        	return lastUpdate;
        },
        getLastViewed: function () {
        	return lastViewed;
        },
        setLastUpdate: function(value) {
        	lastUpdate = new Date(value);
        },
        setLastViewed: function(value) {
        	lastViewed = value;
        },
        hasActivity: function(value) {
        	return lastViewed < lastUpdate;
        }        
    };	
});
app.factory('ActivityService', ['$resource',
  function($resource){
    return $resource('historyactivity', {}, {});
  }]);