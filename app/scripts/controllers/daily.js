'use strict';

var dailyControllers = angular.module('dailyControllers', []);

dailyControllers.controller('DailyCtrl', ['$scope', 'DailyCategoryTotals', 'DailyCategoryFailedTotals', 'DailyServiceTotals', 'DailyServiceFailedTotals', 'DailyFailedReasonTotals', 'DateUtil', '$routeParams', 'Activity', 'ActivityService',
  function($scope, DailyCategoryTotals, DailyCategoryFailedTotals, DailyServiceTotals, DailyServiceFailedTotals, DailyFailedReasonTotals, DateUtil, $routeParams, Activity, ActivityService) {
    ActivityService.get(function(activity) {
   		Activity.setLastUpdate(activity.last_update);
   	});	
  	function tooltipContentEditor(str, seriesIndex, pointIndex, plot) {
   		// display series_label, x-axis_tick, y-axis value
   		return plot.series[seriesIndex]["label"] + ", " + plot.data[seriesIndex][pointIndex];
	}
	
  	var selectedDt = new Date($routeParams.dt);
	$scope.category = $routeParams.category;
	$scope.weekStart = DateUtil.dateFormat(DateUtil.weekStart(selectedDt), "MM-DD-YYYY");
	var weekstartInput = DateUtil.dateFormat(DateUtil.weekStart(selectedDt), "YYYYMMDD");
	if ($routeParams.category == "All") {
		DailyCategoryTotals.get({weekstart: weekstartInput}, function(data) {
			$scope.deliverytotal = data.totals;
			if (data.totals > 0) {
				$scope.isopen1 = true;
    			loadSuccessfulChart(data);
    		}
    		else {
    			$scope.isopen1 = false;
    		}	
		});
		DailyCategoryFailedTotals.get({weekstart: weekstartInput}, function(data) {
			$scope.faileddeliverytotal = data.totals;
			if (data.totals > 0) {
				$scope.isopen2 = true;
    			loadFailedChart(data);
    		}
    		else {
    			$scope.isopen2 = false;
    		}	
		});		
	}
	else {
		DailyServiceTotals.get({weekstart: weekstartInput, category: $routeParams.category}, function(data) {
			$scope.deliverytotal = data.totals;
			if (data.totals > 0) {
				$scope.isopen1 = true;
    			loadSuccessfulChart(data);
    		}
    		else {
    			$scope.isopen1 = false;
    		}	
		});
		DailyServiceFailedTotals.get({weekstart: weekstartInput, category: $routeParams.category}, function(data) {
			$scope.faileddeliverytotal = data.totals;
			if (data.totals > 0) {
				$scope.isopen2 = true;
    			loadFailedChart(data);
    		}
    		else {
    			$scope.isopen2 = false;
    		}	

		});		
	}
	function loadSuccessfulChart(data) {
    	$scope.chart = data.dailytotals; 
    	$scope.chartOptions =  {
    		stackSeries: true,
        	seriesDefaults:{
            	renderer:jQuery.jqplot.BarRenderer,
            	rendererOptions: {fillToZero: true},
          	},
        	series: data.category,
        	legend: {
            	show: true,
            	placement: 'outsideGrid'
        	},
        	axes: {
            	xaxis: {
                	renderer: jQuery.jqplot.CategoryAxisRenderer,
               		ticks: data.days
            	},
            },	
    		highlighter: {
      			show: true,
      			showTooltip: true,      // show a tooltip with data point values.
            	tooltipLocation: 'ne',  // location of tooltip: n, ne, e, se, s, sw, w, nw.
           		tooltipContentEditor:tooltipContentEditor 
    		},
    	};
		
	}
	function loadFailedChart(data) {
    	$scope.chart2 = data.dailytotals;     	
    	$scope.chartOptions2 =  {
    		stackSeries: true,
        	seriesDefaults:{
            	renderer:jQuery.jqplot.BarRenderer,
            	rendererOptions: {fillToZero: true},
        	},
        	series: data.category,
        	legend: {
            	show: true,
            	placement: 'outsideGrid'
        	},
        	axes: {
            	xaxis: {
                	renderer: jQuery.jqplot.CategoryAxisRenderer,
               		ticks: data.days
            	},

        	},
    		highlighter: {
      			show: true,
      			showTooltip: true,      // show a tooltip with data point values.
            	tooltipLocation: 'ne',  // location of tooltip: n, ne, e, se, s, sw, w, nw.
           		tooltipContentEditor:tooltipContentEditor 
    		},        	
    	}; 		
	}

   	DailyFailedReasonTotals.get({weekstart: weekstartInput, category: $routeParams.category}, function(data) {
		$scope.failedreasonstotal = data.totals;
		if (data.totals > 0) {
			$scope.isopen3 = true;
    		loadFailedReasonChart(data);
    	}
    	else {
    		$scope.isopen3 = false;
    	}	
   	});
	function loadFailedReasonChart(data) {
    	$scope.chart3 = data.dailytotals;     	
    	$scope.chartOptions3 =  {
    		stackSeries: true,
        	seriesDefaults:{
            	renderer:jQuery.jqplot.BarRenderer,
            	rendererOptions: {fillToZero: true},
	
        	},
        	series: data.exception,
        	legend: {
            	show: true,
            	placement: 'outsideGrid'
        	},
        	axes: {
            	xaxis: {
                	renderer: jQuery.jqplot.CategoryAxisRenderer,
               		ticks: data.days
            	},

        	},
    		highlighter: {
      			show: true,
      			showTooltip: true,      // show a tooltip with data point values.
            	tooltipLocation: 'ne',  // location of tooltip: n, ne, e, se, s, sw, w, nw.
           		tooltipContentEditor:tooltipContentEditor 
    		},        	
    	};    	    	
	}
}]);

