'use strict';

var edeliveryControllers = angular.module('edeliveryControllers', []);


edeliveryControllers.controller('MainCtrl', ['$scope', 'DayTotalsList', 'DateUtil', 'Activity', 'auth',
  function($scope, DayTotalsList, DateUtil, Activity, auth) {

  	$scope.user = auth.profile;
	Activity.setLastViewed(new Date());
	$scope.today = DateUtil.dateFormat(new Date(), "MM-DD-YYYY");
	$scope.lastload = Activity.getLastUpdate().toLocaleString();
	var dayInput = DateUtil.dateFormat(new Date(), "YYYYMMDD");
	$scope.myData = [];
    DayTotalsList.get({date: dayInput}, function(data) {
   		$scope.myData = data.listing;
   		$scope.delivered = data.delivered_totals;
   		$scope.failed = data.failed_totals;
   	});
	$scope.gridOptions = { 
		data: 'myData', 
		columnDefs: [
			{field:'category_description', displayName:'Category', width:"15%"}, 
			{field:'service_description', displayName:'Service', width:"25%"}, 
			{field: 'delivery_exception', displayName:'Exception', width:"48%", cellTemplate: '<div ng-class="{red: row.getProperty(col.field).length > 0}"><div class="ngCellText">{{row.getProperty(col.field)}}</div></div>'},			
			{field: 'total', displayName: 'Total',width:"10%"}
		]
	};		

  }]);
  
